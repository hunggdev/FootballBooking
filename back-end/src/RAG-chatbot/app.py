from fastapi import FastAPI
from pydantic import BaseModel
from rag import ask
from build_index import build_and_save_index

build_and_save_index()

app = FastAPI()

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(req: ChatRequest):
    answer = ask(req.question)

    return {
        "answer": answer
    }