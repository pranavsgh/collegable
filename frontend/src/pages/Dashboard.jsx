import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

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

const categoryColors = {
  "Academic": "bg-[#EEF0FF] text-[#6C63FF]",
  "Testing": "bg-[#FFF0F0] text-[#FF6B6B]",
  "Research": "bg-[#EDFBF4] text-[#3dd68c]",
  "Applications": "bg-[#FFF8E7] text-[#f5a623]",
  "Essays": "bg-[#F0F0FF] text-[#8b5cf6]",
  "Financial Aid": "bg-[#E7F9FF] text-[#0ea5e9]",
  "Extracurriculars": "bg-[#FFF0F8] text-[#ec4899]",
  "Planning": "bg-[#F0FFF4] text-[#22c55e]",
}

const navItems = [
  { id: "checklist", label: "My Checklist", icon: "✅" },
  { id: "resources", label: "Resources", icon: "📚" },
  { id: "chat", label: "AI Guide", icon: "🤖" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [checked, setChecked] = useState({})
  const [activeNav, setActiveNav] = useState("checklist")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate("/login"); return }
      setUser(user)

      // Load onboarding answers
      const { data: onboarding } = await supabase
        .from("onboarding_answers")
        .select("answers")
        .eq("user_id", user.id)
        .maybeSingle()
      if (onboarding) setAnswers(onboarding.answers)

      // Load checklist progress
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
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <p className="text-[#7a7a90] text-sm">Loading your dashboard...</p>
      </div>
    )
  }

  const grade = answers?.grade || "12th grade"
  const checklist = checklistData[grade] || checklistData["12th grade"]
  const completedCount = checklist.filter(item => checked[item.id]).length
  const progressPct = Math.round((completedCount / checklist.length) * 100)
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Student"

  const status = progressPct === 0 ? { label: "Not started", color: "text-[#9a9ab0]" }
    : progressPct < 40 ? { label: "Behind", color: "text-[#FF6B6B]" }
    : progressPct < 75 ? { label: "On track", color: "text-[#f5c542]" }
    : { label: "Ahead", color: "text-[#3dd68c]" }

  return (
    <div className="min-h-screen bg-[#0f0f13] flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#17171e] border-r border-[#2a2a35] flex flex-col fixed h-full">
        <div className="px-6 py-6 border-b border-[#2a2a35]">
          <span className="font-display font-bold text-xl text-white tracking-tight">Collegable</span>
          <p className="text-xs text-[#7a7a90] mt-1">Your college roadmap</p>
        </div>
        <div className="px-6 py-4 border-b border-[#2a2a35]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center text-white text-xs font-bold">
              {firstName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{firstName}</p>
              <p className="text-xs text-[#7a7a90]">{grade}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${activeNav === item.id ? "bg-[#6C63FF] text-white" : "text-[#7a7a90] hover:text-white hover:bg-[#2a2a35]"}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-[#2a2a35]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#7a7a90]">Overall progress</span>
            <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
          </div>
          <div className="w-full bg-[#2a2a35] rounded-full h-1.5">
            <div className="bg-[#6C63FF] h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
          </div>
          <p className="text-xs text-[#7a7a90] mt-2">{completedCount} of {checklist.length} tasks done</p>
          {saving && <p className="text-xs text-[#6C63FF] mt-1">Saving...</p>}
        </div>
        <div className="px-6 py-4 border-t border-[#2a2a35]">
          <button onClick={logout} className="text-xs text-[#7a7a90] hover:text-[#FF6B6B] transition-colors">→ Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">

        {activeNav === "checklist" && (
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1 className="font-display font-bold text-2xl text-white mb-1">Hey {firstName}, here's your roadmap 👋</h1>
              <p className="text-[#7a7a90] text-sm">These are your tasks for {grade}. Check them off as you go.</p>
            </div>
            <div className={`rounded-xl p-4 mb-6 flex items-center justify-between border ${
              progressPct === 0 ? "bg-[#17171e] border-[#2a2a35]"
              : progressPct < 40 ? "bg-[#FF6B6B10] border-[#FF6B6B30]"
              : progressPct < 75 ? "bg-[#f5c54210] border-[#f5c54230]"
              : "bg-[#3dd68c10] border-[#3dd68c30]"
            }`}>
              <div>
                <p className={`text-sm font-semibold ${status.color}`}>{status.label}</p>
                <p className="text-xs text-[#7a7a90] mt-0.5">
                  {progressPct === 0 ? "Start checking off tasks to track your progress"
                  : progressPct < 40 ? "You have some catching up to do — let's get moving"
                  : progressPct < 75 ? "Good progress — keep going"
                  : "You're crushing it — almost there"}
                </p>
              </div>
              <span className={`font-display font-bold text-2xl ${status.color}`}>{progressPct}%</span>
            </div>
            <div className="flex flex-col gap-3">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                    ${checked[item.id] ? "bg-[#17171e] border-[#2a2a35] opacity-60" : "bg-[#17171e] border-[#2a2a35] hover:border-[#6C63FF]"}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${checked[item.id] ? "bg-[#6C63FF] border-[#6C63FF]" : "border-[#4a4a6a]"}`}>
                    {checked[item.id] && <span className="text-white text-xs">✓</span>}
                  </div>
                  <p className={`text-sm flex-1 ${checked[item.id] ? "line-through text-[#4a4a6a]" : "text-[#e8e8f0]"}`}>
                    {item.task}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${categoryColors[item.category]}`}>
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "resources" && (
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1 className="font-display font-bold text-2xl text-white mb-1">Resource Library</h1>
              <p className="text-[#7a7a90] text-sm">Curated guides for {grade} students.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "How to Fill Out the FAFSA", desc: "Step-by-step guide to financial aid", link: "https://studentaid.gov/h/apply-for-aid/fafsa", tag: "Financial Aid" },
                { title: "SAT Prep — Khan Academy", desc: "Free official SAT practice", link: "https://www.khanacademy.org/sat", tag: "Testing" },
                { title: "Common App Guide", desc: "How to set up and complete your Common App", link: "https://www.commonapp.org", tag: "Applications" },
                { title: "College Essay Tips", desc: "How to write a personal statement that stands out", link: "https://blog.collegevine.com/how-to-write-the-common-app-essays", tag: "Essays" },
                { title: "Scholarship Search — Fastweb", desc: "Find scholarships you qualify for", link: "https://www.fastweb.com", tag: "Financial Aid" },
                { title: "College Search — Niche", desc: "Find and compare colleges by fit", link: "https://www.niche.com", tag: "Research" },
              ].map((r, i) => (
                <a key={i} href={r.link} target="_blank" rel="noreferrer"
                  className="bg-[#17171e] border border-[#2a2a35] rounded-xl p-5 hover:border-[#6C63FF] transition-colors group">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium mb-3 inline-block ${categoryColors[r.tag] || "bg-[#2a2a35] text-[#7a7a90]"}`}>{r.tag}</span>
                  <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[#6C63FF] transition-colors">{r.title}</h3>
                  <p className="text-xs text-[#7a7a90]">{r.desc}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {activeNav === "chat" && (
          <div className="max-w-2xl">
            <div className="mb-8">
              <h1 className="font-display font-bold text-2xl text-white mb-1">AI College Guide</h1>
              <p className="text-[#7a7a90] text-sm">Ask anything about college prep. Coming soon.</p>
            </div>
            <div className="bg-[#17171e] border border-[#2a2a35] rounded-2xl p-8 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#6C63FF20] flex items-center justify-center text-3xl">🤖</div>
              <h2 className="font-display font-bold text-lg text-white">Chat is coming soon</h2>
              <p className="text-sm text-[#7a7a90] max-w-sm">The AI guide will answer your college questions 24/7. Being built right now — check back soon.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}