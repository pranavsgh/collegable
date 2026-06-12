# RAG service — embeds a query and retrieves the closest knowledge-base chunks from Pinecone
import os
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

# Same model used at ingest time — embeddings must be from the same model to compare correctly
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))


def get_embedding(text: str):
    # Returns a flat float list that Pinecone expects as the query vector
    return embed_model.encode(text).tolist()


def query_knowledge_base(question: str, top_k: int = 5):
    embedding = get_embedding(question)
    # Fetch the top-k most similar chunks; include_metadata=True gives us the raw text back
    results = index.query(vector=embedding, top_k=top_k, include_metadata=True)
    chunks = [match["metadata"]["text"] for match in results["matches"]]
    return chunks
