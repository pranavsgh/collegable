import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../lib/supabase"

const questions = [
  { id: "grade", category: "Identity & Background", question: "What grade are you in?", options: ["9th grade", "10th grade", "11th grade", "12th grade"] },
  { id: "first_gen", category: "Identity & Background", question: "Are you a first-generation college student?", options: ["Yes", "No", "Not sure"] },
  { id: "support", category: "Identity & Background", question: "How much support do you have at home?", options: ["A lot — family helps me navigate this", "Some — but they don't know the process well", "Very little — I'm mostly on my own", "None — fully figuring this out alone"] },
  { id: "gpa", category: "Academics", question: "What's your GPA range?", options: ["Below 2.5", "2.5 – 3.0", "3.0 – 3.5", "3.5+"] },
  { id: "classes", category: "Academics", question: "What kind of classes are you taking?", options: ["Regular classes", "Some AP / IB", "Mostly AP / IB", "Dual enrollment"] },
  { id: "grades_feel", category: "Academics", question: "How do you feel about your grades right now?", options: ["Proud of them", "They're okay", "Struggling a bit", "Need serious help"] },
  { id: "college_goal", category: "Goals & Direction", question: "What's your college goal?", options: ["4-year university", "Community college", "Trade / vocational school", "Not sure yet"] },
  { id: "school_size", category: "Goals & Direction", question: "What type of school are you drawn to?", options: ["Big university (20k+ students)", "Mid-size (5k – 20k)", "Small college (under 5k)", "No preference"] },
  { id: "major", category: "Goals & Direction", question: "What are you thinking of studying?", options: ["STEM", "Business", "Arts & Humanities", "Healthcare", "Undecided"] },
  { id: "dream_school", category: "Goals & Direction", question: "Do you have a dream school?", options: ["Yes — I know exactly", "I have a few in mind", "Not really", "No idea"] },
  { id: "stress", category: "Concerns & Stressors", question: "What stresses you most right now?", options: ["Getting into the right school", "Paying for college", "Writing essays", "Figuring out what I want"] },
  { id: "feel_overall", category: "Concerns & Stressors", question: "How do you feel about the college process overall?", options: ["Excited", "Nervous", "Overwhelmed", "Completely lost"] },
  { id: "research", category: "Concerns & Stressors", question: "Have you started researching colleges yet?", options: ["Yes — actively", "A little", "Not really", "Not at all"] },
  { id: "extracurriculars", category: "Extracurriculars & Life", question: "What do you do outside of school?", options: ["Sports", "Arts / music", "Clubs / volunteering", "Work or family responsibilities", "Nothing yet"] },
  { id: "student_word", category: "Extracurriculars & Life", question: "What's one word that describes you as a student?", options: ["Driven", "Curious", "Struggling", "Resilient"] }
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  const handleSelect = async (option) => {
    const updated = { ...answers, [q.id]: option }
    setAnswers(updated)

    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(current + 1), 300)
    } else {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      console.log("User:", user)
      if (user) {
        const { data, error } = await supabase
          .from("onboarding_answers")
          .upsert(
            { user_id: user.id, answers: updated, created_at: new Date().toISOString() },
            { onConflict: "user_id" }
          )
        console.log("Saved:", data)
        console.log("Error:", error)
      }
      setSaving(false)
      navigate("/dashboard")
    }
  }

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <div className="w-full px-8 pt-6 pb-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <span onClick={() => navigate("/")} className="font-display font-bold text-xl text-[#1a1a2e] cursor-pointer hover:text-[#6C63FF] transition-colors">Collegable</span>
        <span className="text-sm text-[#9a9ab0]">{current + 1} of {questions.length}</span>
      </div>
      <div className="w-full bg-[#f0f0f5] h-1">
        <div className="bg-[#6C63FF] h-1 transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <p className="text-xs font-semibold text-[#6C63FF] uppercase tracking-widest mb-4">{q.category}</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-[#1a1a2e] leading-snug mb-10">{q.question}</h2>
          <div className="flex flex-col gap-3">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-6 py-4 rounded-xl border text-sm font-medium transition-all duration-150
                  ${answers[q.id] === option
                    ? "bg-[#6C63FF] text-white border-[#6C63FF] shadow-sm"
                    : "bg-white text-[#1a1a2e] border-[#e0e0f0] hover:border-[#6C63FF] hover:bg-[#f5f4ff]"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
          {current > 0 && (
            <button onClick={handleBack} className="mt-8 text-sm text-[#9a9ab0] hover:text-[#6C63FF] transition-colors">← Back</button>
          )}
          {saving && <p className="mt-6 text-sm text-[#9a9ab0] text-center">Saving your answers...</p>}
        </div>
      </div>
      <div className="pb-8 flex items-center justify-center gap-1.5">
        {questions.map((_, i) => (
          <div key={i} className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-[#6C63FF]" : i < current ? "w-1.5 h-1.5 bg-[#6C63FF] opacity-40" : "w-1.5 h-1.5 bg-[#e0e0f0]"}`} />
        ))}
      </div>
    </div>
  )
}