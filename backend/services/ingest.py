# Ingestion service — chunks text documents and upserts their embeddings into Pinecone
import os
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

# Local embedding model — runs entirely on-device, no external API call needed
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Pinecone client and index handle, used for all vector upserts
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))


def chunk_text(text: str, chunk_size: int = 500):
    # Split on whitespace and group into fixed-size word chunks
    # Simple word-count chunking is sufficient for the short knowledge-base documents we have
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
        embedding = embed_model.encode(chunk).tolist()
        # ID format "<source>-<index>" makes it easy to identify and overwrite existing chunks
        vectors.append({
            "id": f"{source}-{i}",
            "values": embedding,
            "metadata": {"text": chunk, "source": source}
        })
    # Upsert is idempotent — re-running the script won't duplicate data
    index.upsert(vectors=vectors)
    print(f"Ingested {len(vectors)} chunks from {source}")


if __name__ == "__main__":
    # Quick smoke test with a short FAFSA snippet
    sample = """
    FAFSA stands for Free Application for Federal Student Aid.
    Every student should fill it out in their senior year of high school.
    The FAFSA opens on October 1st each year. Filing early increases your chances of getting aid.
    You will need your parents tax returns, social security number, and bank statements.
    The Expected Family Contribution (EFC) determines how much aid you receive.
    """
    ingest_document(sample, "fafsa-guide")
