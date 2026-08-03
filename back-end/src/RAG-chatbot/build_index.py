"""
Build FAISS index từ knowledge-base và lưu xuống đĩa.
CHỈ CHẠY FILE NÀY khi dữ liệu trong ./knowledge-base thay đổi.
KHÔNG chạy lại mỗi lần start server.

Cách dùng:
    python build_index.py
"""

import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import warnings

warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)

from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_core.documents import Document

load_dotenv()

KB_PATH = "./knowledge-base"
INDEX_PATH = "./faiss_index"  # thư mục lưu index trên đĩa


def build_and_save_index():
    loader = DirectoryLoader(
        path=KB_PATH,
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
        show_progress=True,
        use_multithreading=True,
    )
    raw_docs = loader.load()

    header_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[("#", "h1"), ("##", "h2")],
        strip_headers=False,
    )
    sub_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        add_start_index=True,
        strip_whitespace=True,
    )

    all_chunks: list[Document] = []
    for doc in raw_docs:
        source_name = doc.metadata.get("source", "unknown")
        sections = header_splitter.split_text(doc.page_content)
        if not sections:
            sections = [Document(page_content=doc.page_content, metadata={})]

        for sec in sections:
            title_parts = [v for v in sec.metadata.values() if v]
            title_prefix = " - ".join(title_parts)
            content = f"{title_prefix}\n{sec.page_content}" if title_prefix else sec.page_content

            if len(content) > 500:
                sub_docs = sub_splitter.split_documents(
                    [Document(page_content=content, metadata={"source": source_name, **sec.metadata})]
                )
                for sd in sub_docs:
                    if title_prefix and not sd.page_content.startswith(title_prefix):
                        sd.page_content = f"{title_prefix}\n{sd.page_content}"
                all_chunks.extend(sub_docs)
            else:
                all_chunks.append(
                    Document(page_content=content, metadata={"source": source_name, **sec.metadata})
                )

    print(f"Tổng số chunk sau khi xử lý: {len(all_chunks)}")

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    vectorstore = FAISS.from_documents(
        documents=all_chunks,
        embedding=embeddings,
        distance_strategy=DistanceStrategy.COSINE,
    )

    vectorstore.save_local(INDEX_PATH)
    print(f"Đã lưu FAISS index vào: {INDEX_PATH}")

    # Lưu luôn chunks dạng pickle-free (docstore) để build lại BM25Retriever khi load,
    # vì BM25Retriever không có sẵn hàm save/load như FAISS.
    import json

    with open(os.path.join(INDEX_PATH, "chunks.json"), "w", encoding="utf-8") as f:
        json.dump(
            [{"page_content": d.page_content, "metadata": d.metadata} for d in all_chunks],
            f,
            ensure_ascii=False,
        )
    print("Đã lưu chunks.json (dùng để build lại BM25Retriever khi load index).")
