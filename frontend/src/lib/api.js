// API client — wraps backend calls so components don't deal with fetch/auth directly
import { supabase } from "./supabase"

// Falls back to localhost when VITE_API_URL is not set (local development)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function sendChatMessage(question, grade, sessionId) {
  // Always grab a fresh session before each request in case the token was refreshed
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error("Not authenticated")

  // Strip non-numeric characters from grade strings like "11th grade" → 11
  const gradeNum = parseInt(grade?.replace(/\D/g, "")) || 12

  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ question, grade: gradeNum, session_id: sessionId }),
  })

  // Expose rate-limit errors as a named sentinel so callers can show a friendly message
  if (res.status === 429) throw new Error("rate_limited")
  if (!res.ok) throw new Error("Failed to get response")
  return res.json()
}
