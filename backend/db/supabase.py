# Load environment variables from .env so secrets stay out of source code
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# Pull Supabase connection details from environment — never hardcode these
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Single shared client used by every route and service in the backend
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
