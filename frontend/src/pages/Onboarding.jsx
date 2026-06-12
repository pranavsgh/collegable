// Onboarding page — walks new users through a 15-question quiz to personalize their dashboard
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../lib/supabase"

// All 15 questions in order; each has a unique id that becomes the key in the saved answers object
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

  // Index of the question currently on screen
  const [current, setCurrent] = useState(0)

  // Accumulates the user's answers as they progress through the quiz
  const [answers, setAnswers] = useState({})

  // True while the final upsert to Supabase is in flight
  const [saving, setSaving] = useState(false)

  const q = questions[current]

  // Progress bar width — based on how many questions have been answered, not including the current one
  const progress = ((current) / questions.length) * 100

  const handleSelect = async (option) => {
    const updated = { ...answers, [q.id]: option }
    setAnswers(updated)

    if (current < questions.length - 1) {
      // Brief delay before advancing so the selected button's highlight is visible
      setTimeout(() => setCurrent(current + 1), 200)
    } else {
      // Last question — save all answers to Supabase and navigate to the dashboard
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // upsert so re-running onboarding overwrites the previous answers instead of erroring
        await supabase
          .from("onboarding_answers")
          .upsert(
            { user_id: user.id, answers: updated, created_at: new Date().toISOString() },
            { onConflict: "user_id" }
          )
      }
      setSaving(false)
      navigate("/dashboard")
    }
  }

  // Allow the user to step back and change a previous answer
  const handleBack = () => {
    if (current > 0) setCurrent(current - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

      {/* Header — shows the current question number out of total */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <span
            onClick={() => navigate("/")}
            className="font-bold text-navy text-lg tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            Collegable
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {current + 1} of {questions.length}
          </span>
        </div>
      </header>

      {/* Thin progress bar that fills as the user advances through the quiz */}
      <div className="w-full bg-gray-200 h-0.5">
        <div
          className="bg-navy h-0.5 transition-all duration-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card — centered vertically on the remaining screen height */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14">
        <div className="w-full max-w-lg">
          {/* Category label above the question text */}
          <p className="text-xs font-semibold text-cb-blue uppercase tracking-widest mb-4">
            {q.category}
          </p>
          <h2 className="font-bold text-2xl text-navy leading-snug mb-8">
            {q.question}
          </h2>

          {/* Answer options — clicking one immediately selects and advances */}
          <div className="flex flex-col gap-2.5">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-5 py-3.5 rounded border text-sm font-medium transition-all duration-100
                  ${answers[q.id] === option
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-gray-700 border-gray-200 hover:border-navy hover:text-navy"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Back button only shown after the first question */}
          {current > 0 && (
            <button
              onClick={handleBack}
              className="mt-8 text-sm text-gray-400 hover:text-navy transition-colors"
            >
              ← Back
            </button>
          )}

          {/* Shown while the final save is in flight on the last question */}
          {saving && (
            <p className="mt-6 text-sm text-gray-400 text-center">Saving your answers...</p>
          )}
        </div>
      </div>

      {/* Step dot indicators at the bottom — the active dot is wider to stand out */}
      <div className="pb-8 flex items-center justify-center gap-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 h-1.5 bg-navy"          // current: pill shape
                : i < current
                ? "w-1.5 h-1.5 bg-navy opacity-30" // completed: dim dot
                : "w-1.5 h-1.5 bg-gray-300"        // upcoming: grey dot
            }`}
          />
        ))}
      </div>

    </div>
  )
}
