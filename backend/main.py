from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.resources import router as resources_router
from routes.chat import router as chat_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://collegable-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resources_router)
app.include_router(chat_router)

@app.get("/health")
def health():
    return {"status": "ok"}
