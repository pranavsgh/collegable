import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { sendChatMessage } from "../lib/api"

const checklistData = {
  "9th grade": [
    { id: 1, task: "Explore different clubs and extracurriculars", category: "Extracurriculars" },
    { id: 2, task: "Meet with your school counselor to plan 4-year course schedule", category: "Academic" },
    { id: 3, task: "Start building good study habits", category: "Academic" },
    { id: 4, task: "Research what GPA colleges look for", category: "Research" },
    { id: 5, task: "Create a list of your interests and strengths", category: "Planning" },
  ],
  "10th grade": [
    { id: 1, task: "Take the PSAT for practice", category: "Testing" },
    { id: 2, task: "Start researching colleges that interest you", category: "Research" },
    { id: 3, task: "Get involved in leadership roles in clubs", category: "Extracurriculars" },
    { id: 4, task: "Talk to your counselor about AP/IB courses", category: "Academic" },
    { id: 5, task: "Attend college fairs if available", category: "Research" },
    { id: 6, task: "Begin thinking about potential majors", category: "Planning" },
  ],
  "11th grade": [
    { id: 1, task: "Take the SAT or ACT", category: "Testing" },
    { id: 2, task: "Build your college list (safety, match, reach)", category: "Research" },
    { id: 3, task: "Request letters of recommendation from teachers", category: "Applications" },
    { id: 4, task: "Start researching scholarships", category: "Financial Aid" },
    { id: 5, task: "Visit college campuses (virtual or in-person)", category: "Research" },
    { id: 6, task: "Create a Common App account", category: "Applications" },
    { id: 7, task: "Start drafting your personal statement", category: "Essays" },
    { id: 8, task: "Research FAFSA requirements", category: "Financial Aid" },
  ],
  "12th grade": [
    { id: 1, task: "Complete and submit FAFSA (opens Oct 1)", category: "Financial Aid" },
    { id: 2, task: "Finalize your college list", category: "Research" },
    { id: 3, task: "Submit early decision / early action applications", category: "Applications" },
    { id: 4, task: "Request official transcripts", category: "Applications" },
    { id: 5, task: "Follow up on letters of recommendation", category: "Applications" },
    { id: 6, task: "Submit regular decision applications", category: "Applications" },
    { id: 7, task: "Apply for scholarships every month", category: "Financial Aid" },
    { id: 8, task: "Compare financial aid award letters", category: "Financial Aid" },
    { id: 9, task: "Make your final college decision by May 1", category: "Planning" },
    { id: 10, task: "Send enrollment deposit to your chosen school", category: "Planning" },
  ],
}

const categoryStyle = {
  "Academic": "bg-blue-50 text-blue-700",
  "Testing": "bg-amber-50 text-amber-700",
  "Research": "bg-teal-50 text-teal-700",
  "Applications": "bg-indigo-50 text-indigo-700",
  "Essays": "bg-violet-50 text-violet-700",
  "Financial Aid": "bg-sky-50 text-sky-700",
  "Extracurriculars": "bg-rose-50 text-rose-700",
  "Planning": "bg-emerald-50 text-emerald-700",
}

const navItems = [
  { id: "checklist", label: "My Checklist" },
  { id: "resources", label: "Resources" },
  { id: "chat", label: "AI Advisor" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [checked, setChecked] = useState({})
  const [activeNav, setActiveNav] = useState("checklist")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI college advisor. Ask me anything about applications, essays, financial aid, or what to do next." }
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate("/login"); return }
      setUser(user)

      const { data: onboarding } = await supabase
        .from("onboarding_answers")
        .select("answers")
        .eq("user_id", user.id)
        .maybeSingle()
      if (onboarding) setAnswers(onboarding.answers)

      const { data: progress } = await supabase
        .from("checklist_progress")
        .select("checked_items")
        .eq("user_id", user.id)
        .maybeSingle()

      if (progress?.checked_items) {
        const checkedMap = {}
        progress.checked_items.forEach(id => { checkedMap[id] = true })
        setChecked(checkedMap)
      }

      setLoading(false)
    }
    load()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const sendMessage = async () => {
    const text = chatInput.trim()
    if (!text || chatLoading) return
    setChatInput("")
    setMessages(prev => [...prev, { role: "user", text }])
    setChatLoading(true)
    try {
      const { answer } = await sendChatMessage(text, grade)
      setMessages(prev => [...prev, { role: "assistant", text: answer }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }])
    }
    setChatLoading(false)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleCheck = async (id) => {
    const updated = { ...checked, [id]: !checked[id] }
    setChecked(updated)

    const checkedIds = Object.keys(updated).filter(k => updated[k]).map(Number)
    setSaving(true)
    await supabase
      .from("checklist_progress")
      .upsert(
        { user_id: user.id, grade: answers?.grade, checked_items: checkedIds, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      )
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      </div>
    )
  }

  const grade = answers?.grade || "12th grade"
  const checklist = checklistData[grade] || checklistData["12th grade"]
  const completedCount = checklist.filter(item => checked[item.id]).length
  const progressPct = Math.round((completedCount / checklist.length) * 100)
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Student"

  const statusLabel = progressPct === 0 ? "Not started"
    : progressPct < 40 ? "Getting started"
    : progressPct < 75 ? "On track"
    : "Ahead of schedule"

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="px-6 py-5 border-b border-gray-200">
          <span className="font-bold text-navy text-lg tracking-tight">Collegable</span>
        </div>

        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-navy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {firstName[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{firstName}</p>
              <p className="text-xs text-gray-500">{grade}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded transition-colors mb-0.5
                ${activeNav === item.id
                  ? "bg-navy text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-navy"}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-navy">{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-cb-blue h-1 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{completedCount} of {checklist.length} tasks complete</p>
          {saving && <p className="text-xs text-cb-blue mt-1">Saving...</p>}
        </div>

        <div className="px-5 py-4 border-t border-gray-200">
          <button onClick={logout} className="text-xs text-gray-400 hover:text-navy transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 min-h-screen">

        {/* Page header bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-base font-semibold text-navy">
            {activeNav === "checklist" && `${grade.charAt(0).toUpperCase() + grade.slice(1)} Checklist`}
            {activeNav === "resources" && "Resource Library"}
            {activeNav === "chat" && "AI College Advisor"}
          </h1>
        </div>

        <div className="px-8 py-8">

          {/* Checklist */}
          {activeNav === "checklist" && (
            <div className="max-w-3xl">
              {/* Progress summary */}
              <div className="bg-white border border-gray-200 rounded p-5 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy">{statusLabel}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {completedCount} of {checklist.length} tasks completed for {grade}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-navy">{progressPct}%</span>
                </div>
              </div>

              {/* Checklist table */}
              <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto] border-b border-gray-100 px-5 py-3 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-6" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</span>
                </div>
                {checklist.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 cursor-pointer transition-colors
                      ${idx !== checklist.length - 1 ? "border-b border-gray-100" : ""}
                      ${checked[item.id] ? "bg-gray-50" : "hover:bg-navy-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${checked[item.id] ? "bg-navy border-navy" : "border-gray-300"}`}
                    >
                      {checked[item.id] && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                          <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <p className={`text-sm ${checked[item.id] ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {item.task}
                    </p>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-sm whitespace-nowrap ${categoryStyle[item.category] || "bg-gray-100 text-gray-600"}`}>
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {activeNav === "resources" && (
            <div className="max-w-3xl">
              <p className="text-sm text-gray-500 mb-6">Curated guides for {grade} students.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "How to Fill Out the FAFSA", desc: "Step-by-step guide to financial aid applications.", link: "https://studentaid.gov/h/apply-for-aid/fafsa", tag: "Financial Aid" },
                  { title: "SAT Prep — Khan Academy", desc: "Free official SAT practice, personalized to your level.", link: "https://www.khanacademy.org/sat", tag: "Testing" },
                  { title: "Common App Guide", desc: "How to set up and complete your Common App profile.", link: "https://www.commonapp.org", tag: "Applications" },
                  { title: "College Essay Tips", desc: "How to write a personal statement that stands out.", link: "https://blog.collegevine.com/how-to-write-the-common-app-essays", tag: "Essays" },
                  { title: "Scholarship Search — Fastweb", desc: "Find scholarships matched to your profile.", link: "https://www.fastweb.com", tag: "Financial Aid" },
                  { title: "College Search — Niche", desc: "Find and compare colleges by fit, location, and major.", link: "https://www.niche.com", tag: "Research" },
                ].map((r, i) => (
                  <a
                    key={i}
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white border border-gray-200 p-5 rounded hover:border-navy transition-colors group block"
                  >
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-sm mb-3 inline-block ${categoryStyle[r.tag] || "bg-gray-100 text-gray-600"}`}>
                      {r.tag}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-navy transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          {activeNav === "chat" && (
            <div className="max-w-2xl flex flex-col" style={{ height: "calc(100vh - 9rem)" }}>
              <p className="text-sm text-gray-500 mb-5">
                Ask anything about college prep, applications, or financial aid.
              </p>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap rounded
                      ${msg.role === "user"
                        ? "bg-navy text-white"
                        : "bg-white border border-gray-200 text-gray-800"}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded text-gray-400 text-sm">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2 items-end">
                <textarea
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Ask your college question..."
                  rows={1}
                  className="flex-1 bg-white border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy resize-none transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || chatLoading}
                  className="bg-navy text-white px-5 py-3 rounded text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
