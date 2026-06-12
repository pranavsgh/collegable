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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">
          <span
            onClick={() => navigate("/")}
            className="font-bold text-navy text-lg tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            Collegable
          </span>
        </div>
      </header>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded p-8">
            <h1 className="font-bold text-2xl text-navy mb-1">Sign In</h1>
            <p className="text-sm text-gray-500 mb-8">Welcome back. Continue your college roadmap.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full px-3.5 py-2.5 rounded border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-navy transition-colors bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="w-full px-3.5 py-2.5 rounded border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-navy transition-colors bg-white"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 bg-navy text-white font-semibold text-sm py-3 rounded hover:bg-navy-light transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-cb-blue font-semibold cursor-pointer hover:underline"
              >
                Create a free account
              </span>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            We never sell your data. Ever.
          </p>
        </div>
      </div>
    </div>
  )
}
