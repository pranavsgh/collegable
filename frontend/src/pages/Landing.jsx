import { useNavigate } from "react-router-dom"

const testimonials = [
  {
    quote: "I'm the first in my family to apply to college. I had no idea where to start. Collegable gave me a checklist that actually made sense for where I am right now.",
    name: "Destiny R.",
    grade: "Junior, Chicago IL",
  },
  {
    quote: "My school counselor handles 400 students. I can't exactly walk in every week. Having something that answers my questions at 11pm before a deadline is huge.",
    name: "Marcus T.",
    grade: "Senior, Atlanta GA",
  },
  {
    quote: "I kept seeing advice online that assumed I already knew everything. Collegable starts from zero. No judgment, just steps.",
    name: "Priya N.",
    grade: "Sophomore, Houston TX",
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="font-bold text-xl text-navy tracking-tight">Collegable</span>
            <nav className="hidden md:flex items-center gap-7">
              <span className="text-sm text-gray-600 hover:text-navy cursor-pointer transition-colors">Features</span>
              <span className="text-sm text-gray-600 hover:text-navy cursor-pointer transition-colors">About</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-navy px-4 py-2 hover:bg-gray-50 rounded transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm font-semibold bg-navy text-white px-5 py-2 rounded hover:bg-navy-light transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="text-cb-blue text-sm font-semibold uppercase tracking-widest mb-5">
            Free for every student — always
          </p>
          <h1 className="text-4xl md:text-[3.25rem] font-extrabold leading-tight mb-6 max-w-2xl">
            Your college roadmap,<br />built for you.
          </h1>
          <p className="text-lg text-gray-300 max-w-xl leading-relaxed mb-10">
            Answer 5 questions. Get a personalized checklist, curated resources, and an AI advisor — built for students navigating the college process on their own.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/signup")}
              className="bg-cb-blue text-white font-semibold text-sm px-8 py-3 rounded hover:bg-cb-blue-dark transition-colors"
            >
              Build My Roadmap
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-white font-medium text-sm px-8 py-3 rounded border border-white/30 hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-10 flex items-center justify-center gap-16 flex-wrap">
          <div className="text-center">
            <div className="text-2xl font-bold text-navy">4 min</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">avg. onboarding time</div>
          </div>
          <div className="w-px h-10 bg-gray-300 hidden md:block" />
          <div className="text-center">
            <div className="text-2xl font-bold text-navy">100%</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">free, no hidden fees</div>
          </div>
          <div className="w-px h-10 bg-gray-300 hidden md:block" />
          <div className="text-center">
            <div className="text-2xl font-bold text-navy">Grades 9–12</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">all levels and backgrounds</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cb-blue text-xs font-semibold uppercase tracking-widest mb-3">What you get</p>
            <h2 className="text-3xl font-bold text-navy">Three tools. One place. Zero confusion.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
            <div className="bg-white p-10">
              <div className="w-9 h-9 bg-navy text-white flex items-center justify-center text-xs font-bold mb-6">
                01
              </div>
              <h3 className="font-bold text-navy text-lg mb-3">Personal Checklist</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                A grade-by-grade checklist built around your goals, GPA, and situation. Check tasks off as you complete them.
              </p>
              <p className="text-xs font-semibold text-cb-blue uppercase tracking-wide">40+ tasks across all 4 years</p>
            </div>
            <div className="bg-white p-10">
              <div className="w-9 h-9 bg-navy text-white flex items-center justify-center text-xs font-bold mb-6">
                02
              </div>
              <h3 className="font-bold text-navy text-lg mb-3">Resource Library</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Handpicked guides on FAFSA, SAT prep, essay writing, and scholarships — filtered to what's relevant for your grade.
              </p>
              <p className="text-xs font-semibold text-cb-blue uppercase tracking-wide">Updated every semester</p>
            </div>
            <div className="bg-white p-10">
              <div className="w-9 h-9 bg-navy text-white flex items-center justify-center text-xs font-bold mb-6">
                03
              </div>
              <h3 className="font-bold text-navy text-lg mb-3">AI College Advisor</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Ask anything — deadlines, essay tips, financial aid, school comparisons. Available 24/7, trained on real college prep resources.
              </p>
              <p className="text-xs font-semibold text-cb-blue uppercase tracking-wide">Answers in seconds, any time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 border-t border-b border-gray-200 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cb-blue text-xs font-semibold uppercase tracking-widest mb-3">Student voices</p>
            <h2 className="text-3xl font-bold text-navy">Built for students who are doing this alone</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-200 p-8">
                <p className="text-gray-700 text-sm leading-relaxed mb-8">"{t.quote}"</p>
                <div className="border-t border-gray-100 pt-5">
                  <div className="font-semibold text-navy text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{t.grade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-4">Ready to build your roadmap?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Takes 4 minutes. Free forever. Built for students who are figuring this out on their own.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-navy text-white font-semibold px-10 py-3.5 rounded hover:bg-navy-light transition-colors"
          >
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t border-navy-dark">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4">
          <span className="font-bold text-white text-sm">Collegable</span>
          <p className="text-gray-400 text-xs">Free for every student. We never sell your data.</p>
        </div>
      </footer>

    </div>
  )
}
