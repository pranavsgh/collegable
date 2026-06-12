// Signup page — collects name, email, and password then creates a Supabase account
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Signup() {
  const navigate = useNavigate()

  // Tracks the three controlled inputs on this form
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  // True while the Supabase signUp call is in flight — disables the button
  const [loading, setLoading] = useState(false)

  // Holds any validation or auth error to display to the user
  const [error, setError] = useState("")

  // Updates the matching field in form state whenever the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError("")

    // Client-side validation before hitting the API
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return }

    setLoading(true)

    // Pass full_name in user_metadata so Dashboard can greet the user by first name
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } }
    })

    setLoading(false)
    if (error) { setError(error.message); return }

    // New accounts always go through onboarding before reaching the dashboard
    navigate("/onboarding")
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top navigation bar with logo linking back to the home page */}
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

      {/* Centered signup card */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded p-8">
            <h1 className="font-bold text-2xl text-navy mb-1">Create your account</h1>
            <p className="text-sm text-gray-500 mb-8">Free forever. No credit card needed.</p>

            {/* Error banner — only rendered when an error string is present */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Name, email, and password inputs — all wired to handleChange */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-navy transition-colors bg-white"
                />
              </div>
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
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-navy transition-colors bg-white"
                />
              </div>
            </div>

            {/* Submit button — label changes while the request is in flight */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 bg-navy text-white font-semibold text-sm py-3 rounded hover:bg-navy-light transition-colors disabled:opacity-60"
            >
              {loading ? "Creating your account..." : "Create Account"}
            </button>

            {/* Visual divider between the create button and the sign-in link */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Link to login for users who already have an account */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-cb-blue font-semibold cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </div>

          {/* Privacy and terms note shown below the card */}
          <p className="text-center text-xs text-gray-400 mt-5">
            By signing up you agree to our terms. We never sell your data.
          </p>
        </div>
      </div>
    </div>
  )
}
