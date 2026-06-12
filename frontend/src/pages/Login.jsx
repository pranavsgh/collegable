import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError("")
    if (!form.email || !form.password) { setError("Please fill in all fields."); return }
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) { setError(error.message); setLoading(false); return }

    const { data: onboarding } = await supabase
      .from("onboarding_answers")
      .select("id")
      .eq("user_id", data.user.id)
      .maybeSingle()

    setLoading(false)

    if (onboarding) {
      navigate("/dashboard")
    } else {
      navigate("/onboarding")
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span onClick={() => navigate("/")} className="font-display font-bold text-2xl text-[#1a1a2e] tracking-tight cursor-pointer hover:text-[#6C63FF] transition-colors">Collegable</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#f0f0f5] p-8">
          <h1 className="font-display font-bold text-2xl text-[#1a1a2e] mb-1">Welcome back</h1>
          <p className="text-sm text-[#9a9ab0] mb-8">Log in to continue your roadmap.</p>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>
          )}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-[#4a4a6a] uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl border border-[#e0e0f0] text-sm text-[#1a1a2e] placeholder-[#c0c0d0] focus:outline-none focus:border-[#6C63FF] transition-colors bg-[#FAFAF7]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4a4a6a] uppercase tracking-wide mb-1.5 block">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" className="w-full px-4 py-3 rounded-xl border border-[#e0e0f0] text-sm text-[#1a1a2e] placeholder-[#c0c0d0] focus:outline-none focus:border-[#6C63FF] transition-colors bg-[#FAFAF7]" />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full mt-6 bg-[#6C63FF] text-white font-semibold text-base py-3.5 rounded-xl hover:bg-[#5a52e0] transition-colors disabled:opacity-60">
            {loading ? "Logging in..." : "Log In →"}
          </button>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#f0f0f5]"></div>
            <span className="text-xs text-[#c0c0d0]">or</span>
            <div className="flex-1 h-px bg-[#f0f0f5]"></div>
          </div>
          <p className="text-center text-sm text-[#9a9ab0]">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} className="text-[#FF6B6B] font-semibold cursor-pointer hover:underline">Sign up free</span>
          </p>
        </div>
        <p className="text-center text-xs text-[#c0c0d0] mt-6">We never sell your data. Ever.</p>
      </div>
    </div>
  )
}