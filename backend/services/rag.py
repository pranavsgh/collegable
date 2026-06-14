import os
from pinecone import Pinecone
from google import genai
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def get_embedding(text: str):
    try:
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text
        )
        return response.embeddings[0].values
    except Exception:
        return None

def query_knowledge_base(question: str, top_k: int = 5):
    embedding = get_embedding(question)
    if not embedding:
        return []
    results = index.query(vector=embedding, top_k=top_k, include_metadata=True)
    chunks = [match["metadata"]["text"] for match in results["matches"]]
    return chunks
