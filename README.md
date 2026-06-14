# Collegable

A free college prep platform for high school students navigating the application process on their own. Students answer a short onboarding quiz and get a personalized checklist, curated resources, and an AI advisor named Cali.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database + Auth | Supabase |
| AI | Gemini 2.5 Flash Lite (Google) |
| Vector DB | Pinecone |

## How it works

- **Auth** — handled directly by Supabase in the browser (no backend involved)
- **Onboarding** — 15-question quiz; answers saved to Supabase, used to personalize the checklist
- **Checklist** — grade-specific tasks stored in the frontend; completion state persisted to Supabase
- **Chat** — the only feature that goes through the FastAPI backend; uses RAG (Pinecone + Gemini) to power Cali, the AI college advisor

## Project structure

```
collegable/
├── frontend/          # React app
│   └── src/
│       ├── pages/     # Landing, Login, Signup, Onboarding, Dashboard
│       ├── components # ProtectedRoute
│       └── lib/       # Supabase client, API helper
└── backend/           # FastAPI app
    ├── routes/        # chat.py, resources.py
    ├── services/      # rag.py (Pinecone query), ingest.py (vector ingestion)
    ├── middleware/     # auth.py (JWT), rate_limit.py (sliding window)
    └── db/            # supabase.py (shared client)
```

## Local setup

### Prerequisites
- Node.js
- Python 3.9+
- A Supabase project
- A Pinecone index
- A Google AI API key

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
GOOGLE_API_KEY=your_google_api_key
```

```bash
uvicorn main:app --reload
```

### Seed the knowledge base

Run this once to load college prep content into Pinecone:

```bash
cd backend
python ingest_resources.py
```

## Supabase tables

| Table | Purpose |
|---|---|
| `onboarding_answers` | Stores each user's quiz answers |
| `checklist_progress` | Stores which checklist tasks a user has completed |
| `chat_history` | Stores all chat messages by session |

Row Level Security is enabled on all three tables — users can only access their own rows.
