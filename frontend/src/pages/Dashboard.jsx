import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { sendChatMessage } from "../lib/api"
import ReactMarkdown from "react-markdown"

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
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID())
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
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

      const { data: sessionData } = await supabase
        .from("chat_history")
        .select("session_id, message, created_at")
        .eq("user_id", user.id)
        .eq("role", "user")
        .order("created_at", { ascending: false })

      if (sessionData) {
        const seen = new Set()
        const uniqueSessions = sessionData.filter(s => {
          if (seen.has(s.session_id)) return false
          seen.add(s.session_id)
          return true
        })
        setSessions(uniqueSessions)

        if (uniqueSessions.length > 0) {
          const latestSession = uniqueSessions[0].session_id
          setSessionId(latestSession)
          setActiveSession(latestSession)
          const { data: chatData } = await supabase
            .from("chat_history")
            .select("role, message")
            .eq("user_id", user.id)
            .eq("session_id", latestSession)
            .order("created_at", { ascending: true })
          if (chatData) setMessages(chatData.map(m => ({ role: m.role, text: m.message })))
        }
      }

      setLoading(false)
    }
    load()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const grade = answers?.grade || "12th grade"
  const checklist = checklistData[grade] || checklistData["12th grade"]
  const completedCount = checklist ? checklist.filter(item => checked[item.id]).length : 0
  const progressPct = checklist ? Math.round((completedCount / checklist.length) * 100) : 0
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Student"
  const statusLabel = progressPct === 0 ? "Not started"
    : progressPct < 40 ? "Getting started"
    : progressPct < 75 ? "On track"
    : "Ahead of schedule"

  const sendMessage = async () => {
    const text = chatInput.trim()
    if (!text || chatLoading) return
    setChatInput("")
    setMessages(prev => [...prev, { role: "user", text }])
    setChatLoading(true)
    try {
      const { answer } = await sendChatMessage(text, grade, user.id, sessionId)
      setMessages(prev => [...prev, { role: "assistant", text: answer }])
      const { data: sessionData } = await supabase
        .from("chat_history")
        .select("session_id, message, created_at")
        .eq("user_id", user.id)
        .eq("role", "user")
        .order("created_at", { ascending: false })
      if (sessionData) {
        const seen = new Set()
        const uniqueSessions = sessionData.filter(s => {
          if (seen.has(s.session_id)) return false
          seen.add(s.session_id)
          return true
        })
        setSessions(uniqueSessions)
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }])
    }
    setChatLoading(false)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const startNewSession = () => {
    const newId = crypto.randomUUID()
    setSessionId(newId)
    setActiveSession(newId)
    setMessages([])
  }

  const loadSession = async (sid) => {
    setSessionId(sid)
    setActiveSession(sid)
    const { data } = await supabase
      .from("chat_history")
      .select("role, message")
      .eq("user_id", user.id)
      .eq("session_id", sid)
      .order("created_at", { ascending: true })
    if (data) setMessages(data.map(m => ({ role: m.role, text: m.message })))
  }

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

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="px-6 py-5 border-b border-gray-200">
          <span className="font-bold text-lg tracking-tight">Collegable</span>
        </div>
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
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
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-indigo-600">{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-indigo-600 h-1 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{completedCount} of {checklist.length} tasks complete</p>
          {saving && <p className="text-xs text-indigo-600 mt-1">Saving...</p>}
        </div>
        <div className="px-5 py-4 border-t border-gray-200">
          <button onClick={logout} className="text-xs text-gray-400 hover:text-indigo-600 transition-colors">Sign out</button>
        </div>
      </aside>

      <main className="ml-60 flex-1 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-base font-semibold text-gray-900">
            {activeNav === "checklist" && `${grade.charAt(0).toUpperCase() + grade.slice(1)} Checklist`}
            {activeNav === "resources" && "Resource Library"}
            {activeNav === "chat" && "Cali — AI College Guide"}
          </h1>
        </div>

        <div className="px-8 py-8">

          {activeNav === "checklist" && (
            <div className="max-w-3xl">
              <div className="bg-white border border-gray-200 rounded p-5 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{statusLabel}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{completedCount} of {checklist.length} tasks completed for {grade}</p>
                </div>
                <span className="text-3xl font-bold text-indigo-600">{progressPct}%</span>
              </div>
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
                      ${checked[item.id] ? "bg-gray-50" : "hover:bg-indigo-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${checked[item.id] ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                      {checked[item.id] && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                          <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <p className={`text-sm ${checked[item.id] ? "line-through text-gray-400" : "text-gray-800"}`}>{item.task}</p>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-sm whitespace-nowrap ${categoryStyle[item.category] || "bg-gray-100 text-gray-600"}`}>
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  <a key={i} href={r.link} target="_blank" rel="noreferrer"
                    className="bg-white border border-gray-200 p-5 rounded hover:border-indigo-600 transition-colors group block">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-sm mb-3 inline-block ${categoryStyle[r.tag] || "bg-gray-100 text-gray-600"}`}>{r.tag}</span>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{r.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeNav === "chat" && (
            <div className="flex gap-6" style={{ height: "calc(100vh - 9rem)" }}>
              <div className="w-44 flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={startNewSession}
                  className="w-full bg-indigo-600 text-white text-xs font-semibold px-3 py-2.5 rounded hover:bg-indigo-700 transition-colors"
                >
                  + New Chat
                </button>
                <div className="flex flex-col gap-1 overflow-y-auto">
                  {sessions.map((s, i) => (
                    <button
                      key={s.session_id}
                      onClick={() => loadSession(s.session_id)}
                      className={`text-left px-3 py-2 rounded text-xs transition-colors truncate ${
                        activeSession === s.session_id
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {s.message?.slice(0, 28) || `Chat ${i + 1}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">🎓</div>
                      <p className="text-gray-500 text-sm max-w-xs">Hey {firstName}! I'm Cali. Ask me anything about college prep — essays, FAFSA, SAT, deadlines, or what to do next.</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed rounded
                        ${msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-200 text-gray-800"}`}>
                        {msg.role === "assistant" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded text-gray-400 text-sm">Thinking...</div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2 items-end">
                  <textarea
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    placeholder="Ask Cali anything..."
                    rows={1}
                    className="flex-1 bg-white border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-600 resize-none transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!chatInput.trim() || chatLoading}
                    className="bg-indigo-600 text-white px-5 py-3 rounded text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}