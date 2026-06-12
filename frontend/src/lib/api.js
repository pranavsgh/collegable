import { supabase } from "./supabase"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function sendChatMessage(question, grade, sessionId) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error("Not authenticated")

  const gradeNum = parseInt(grade?.replace(/\D/g, "")) || 12
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ question, grade: gradeNum, session_id: sessionId }),
  })

  if (res.status === 429) throw new Error("rate_limited")
  if (!res.ok) throw new Error("Failed to get response")
  return res.json()
}
