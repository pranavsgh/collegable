import os
from google import genai
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))


def chunk_text(text: str, chunk_size: int = 500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks


def ingest_document(text: str, source: str):
    chunks = chunk_text(text)
    vectors = []
    for i, chunk in enumerate(chunks):
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=chunk
        )
        embedding = result.embeddings[0].values
        vectors.append({
            "id": f"{source}-{i}",
            "values": embedding,
            "metadata": {"text": chunk, "source": source}
        })
    index.upsert(vectors=vectors)
    print(f"Ingested {len(vectors)} chunks from {source}")
