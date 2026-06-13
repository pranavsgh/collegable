# FastAPI application entry point — wires together all routers and middleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.checklist import router as checklist_router
from routes.resources import router as resources_router
from routes.roadmap import router as roadmap_router
from routes.chat import router as chat_router


app = FastAPI()

# Allow the Vite dev server to call this API during local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all feature routers — each file owns its own URL prefix and logic
app.include_router(checklist_router)
app.include_router(roadmap_router)
app.include_router(resources_router)
app.include_router(chat_router)

# Simple liveness check used by deploy platforms and load balancers
@app.get("/health")
def health():
    return {"status": "ok"}
