const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function sendChatMessage(question, grade, userId, sessionId) {
  const gradeNum = parseInt(grade?.replace(/\D/g, "")) || 12
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, grade: gradeNum, user_id: userId, session_id: sessionId }),
  })
  if (!res.ok) throw new Error("Failed to get response")
  return res.json()
}