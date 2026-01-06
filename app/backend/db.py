import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# Prevent error if env vars are missing during initial setup, but warn/fail in prod logic
if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_KEY not set in environment")

supabase: Client = create_client(url, key)
