"""
FastAPI app cho chatbot Green Field.
Index (FAISS + chunks) được BUILD SẴN bằng build_index.py, ở đây chỉ LOAD lên,
chỉ chạy 1 LẦN lúc server khởi động (lifespan), không build lại mỗi request.

Cách dùng:
    1. python build_index.py            (chạy 1 lần, hoặc mỗi khi đổi dữ liệu)
    2. uvicorn app:app --reload
"""

import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import json
import warnings
from contextlib import asynccontextmanager

warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.vectorstores import FAISS
from langchain_community.retrievers import BM25Retriever
from langchain_classic.retrievers import EnsembleRetriever
from langchain_classic.retrievers.multi_query import MultiQueryRetriever
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

load_dotenv()

INDEX_PATH = "./faiss_index"

# Biến toàn cục giữ rag_chain sau khi load xong ở lifespan, dùng lại cho mọi request
rag_chain = None


def load_rag_chain():
    if not os.path.exists(INDEX_PATH):
        raise RuntimeError(
            f"Không tìm thấy index tại '{INDEX_PATH}'. "
            f"Hãy chạy `python build_index.py` trước khi start server."
        )

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    # allow_dangerous_deserialization=True vì đây là file do chính mình tạo ra, an toàn.
    vectorstore = FAISS.load_local(
        INDEX_PATH, embeddings, allow_dangerous_deserialization=True
    )
    vector_retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6})

    with open(os.path.join(INDEX_PATH, "chunks.json"), "r", encoding="utf-8") as f:
        chunks_data = json.load(f)
    all_chunks = [Document(page_content=c["page_content"], metadata=c["metadata"]) for c in chunks_data]

    bm25_retriever = BM25Retriever.from_documents(all_chunks)
    bm25_retriever.k = 6

    ensemble_retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[0.4, 0.6],
    )

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    retriever = MultiQueryRetriever.from_llm(retriever=ensemble_retriever, llm=llm)

    template = (
        "Bạn là AI Assistant của sân bóng Green Field.\n"
        "Nhiệm vụ:\n"
        "1) Chỉ trả lời bằng thông tin trong Context.\n"
        "2) Nếu Context không có thông tin liên quan, hãy trả lời chính xác câu:\n"
        "   \"Xin lỗi, tôi chưa có thông tin về vấn đề này.\"\n"
        "3) Không sử dụng kiến thức bên ngoài, không đoán, không bịa thông tin.\n"
        "4) Nếu câu hỏi dùng từ đồng nghĩa (vd: nội quy/quy định/quy tắc, đặt sân/đặt lịch/booking),\n"
        "   hãy hiểu là cùng một ý và trả lời dựa trên Context tương ứng.\n"
        "5) Trả lời ngắn gọn, rõ ràng, đúng trọng tâm câu hỏi.\n\n"
        "Context:\n{context}\n\n"
        "Question: {question}\n\n"
        "Trả lời bằng tiếng Việt."

        # "Bạn là AI Assistant của sân bóng Green Field.\n\n"
        # "PHÂN LOẠI CÂU HỎI trước khi trả lời:\n"
        # "A) Giao tiếp xã giao / chào hỏi / cảm ơn / tạm biệt / hỏi bot là ai / phàn nàn / hỏi mơ hồ...\n"
        # "   -> Trả lời tự nhiên, thân thiện, ngắn gọn theo phong cách và hướng dẫn trong Context\n"
        # "      (phần 'Giao tiếp tự nhiên'), KHÔNG cần bịa thông tin về sân bóng.\n"
        # "B) Câu hỏi tra cứu thông tin cụ thể về sân bóng (giá, giờ, dịch vụ, chính sách, nội quy...)\n"
        # "   -> Chỉ trả lời bằng thông tin có trong Context.\n"
        # "   -> Nếu Context không có thông tin liên quan, trả lời đúng câu:\n"
        # "      \"Xin lỗi, tôi chưa có thông tin về vấn đề này.\"\n"
        # "   -> Không dùng kiến thức bên ngoài, không đoán, không bịa thông tin.\n\n"
        # "QUY TẮC CHUNG:\n"
        # "1) Hiểu các từ đồng nghĩa là cùng một ý (vd: nội quy/quy định/quy tắc, đặt sân/đặt lịch/booking).\n"
        # "2) Nếu Context có NHIỀU mục liên quan đến câu hỏi (vd: nhiều loại sân, nhiều khung giờ),\n"
        # "   hãy liệt kê ĐẦY ĐỦ tất cả các mục đó, không chỉ trả lời một phần rồi dừng lại.\n"
        # "3) Trả lời ngắn gọn, rõ ràng, đúng trọng tâm câu hỏi, giọng điệu thân thiện.\n\n"
        # "Context:\n{context}\n\n"
        # "Question: {question}\n\n"
        # "Trả lời bằng tiếng Việt."
    )
    prompt = ChatPromptTemplate.from_template(template)

    def format_docs(docs: list[Document]) -> str:
        seen = set()
        unique_texts = []
        for d in docs:
            key = d.page_content.strip()
            if key not in seen:
                seen.add(key)
                unique_texts.append(key)
        return "\n\n---\n\n".join(unique_texts)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain

def ask(question: str): 
    global rag_chain
    rag_chain = load_rag_chain()
    return rag_chain.invoke(question)

# ---------------------------------------------------------------------------
# 9. VÒNG LẶP CHAT
# ---------------------------------------------------------------------------
# if __name__ == "__main__":
#     print("\n--- Bắt đầu trò chuyện (Nhấn Ctrl+C để thoát) ---")
#     try:
#         while True:
#             question = input("\nQuestion: ")
#             if not question.strip():
#                 continue

#             answer = rag_chain.invoke(question)
#             print("\nAnswer:\n" + answer)
#             print("-" * 50)
#     except KeyboardInterrupt:
#         print("\nĐã thoát chương trình.")


#  "Bạn là AI Assistant của sân bóng Green Field.\n"
#     "Nhiệm vụ:\n"
#     "1) Chỉ trả lời bằng thông tin trong Context.\n"
#     "2) Nếu Context không có thông tin liên quan, hãy trả lời chính xác câu:\n"
#     "   \"Xin lỗi, tôi chưa có thông tin về vấn đề này.\"\n"
#     "3) Không sử dụng kiến thức bên ngoài, không đoán, không bịa thông tin.\n"
#     "4) Nếu câu hỏi dùng từ đồng nghĩa (vd: nội quy/quy định/quy tắc, đặt sân/đặt lịch/booking),\n"
#     "   hãy hiểu là cùng một ý và trả lời dựa trên Context tương ứng.\n"
#     "5) Trả lời ngắn gọn, rõ ràng, đúng trọng tâm câu hỏi.\n\n"
#     "Context:\n{context}\n\n"
#     "Question: {question}\n\n"
#     "Trả lời bằng tiếng Việt."