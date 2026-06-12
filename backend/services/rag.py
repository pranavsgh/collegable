import os
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

embed_model = SentenceTransformer("all-MiniLM-L6-v2")
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))

def get_embedding(text: str):
    return embed_model.encode(text).tolist()

def query_knowledge_base(question: str, top_k: int = 5):
    embedding = get_embedding(question)
    results = index.query(vector=embedding, top_k=top_k, include_metadata=True)
    chunks = [match["metadata"]["text"] for match in results["matches"]]
    return chunks