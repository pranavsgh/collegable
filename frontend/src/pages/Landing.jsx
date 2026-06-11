import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animFrameId
    let t = 0
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      const g1 = ctx.createRadialGradient(w*(0.2+0.35*Math.sin(t*0.7)),h*(0.2+0.3*Math.cos(t*0.5)),0,w*(0.2+0.35*Math.sin(t*0.7)),h*(0.2+0.3*Math.cos(t*0.5)),w*0.6)
      g1.addColorStop(0,"rgba(108,99,255,0.2)"); g1.addColorStop(0.5,"rgba(108,99,255,0.06)"); g1.addColorStop(1,"rgba(255,255,255,0)")
      ctx.fillStyle = g1; ctx.fillRect(0,0,w,h)
      const g2 = ctx.createRadialGradient(w*(0.8+0.18*Math.cos(t*0.6)),h*(0.75+0.22*Math.sin(t*0.45)),0,w*(0.8+0.18*Math.cos(t*0.6)),h*(0.75+0.22*Math.sin(t*0.45)),w*0.55)
      g2.addColorStop(0,"rgba(255,107,107,0.18)"); g2.addColorStop(0.5,"rgba(255,107,107,0.05)"); g2.addColorStop(1,"rgba(255,255,255,0)")
      ctx.fillStyle = g2; ctx.fillRect(0,0,w,h)
      const g3 = ctx.createRadialGradient(w*(0.5+0.25*Math.sin(t*0.55)),h*(0.85+0.12*Math.cos(t*0.7)),0,w*(0.5+0.25*Math.sin(t*0.55)),h*(0.85+0.12*Math.cos(t*0.7)),w*0.45)
      g3.addColorStop(0,"rgba(255,180,80,0.15)"); g3.addColorStop(0.5,"rgba(255,180,80,0.04)"); g3.addColorStop(1,"rgba(255,255,255,0)")
      ctx.fillStyle = g3; ctx.fillRect(0,0,w,h)
      t += 0.018
      animFrameId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animFrameId); window.removeEventListener("resize", resize) }
  }, [])

  const testimonials = [
    { quote: "I'm the first in my family to apply to college. I had no idea where to start. Collegable gave me a checklist that actually made sense for where I am right now.", name: "Destiny R.", grade: "Junior, Chicago IL", initials: "DR", color: "#6C63FF" },
    { quote: "My school counselor handles 400 students. I can't exactly walk in every week. Having something that answers my questions at 11pm before a deadline is huge.", name: "Marcus T.", grade: "Senior, Atlanta GA", initials: "MT", color: "#FF6B6B" },
    { quote: "I kept seeing advice online that assumed I already knew everything. Collegable starts from zero. No judgment, just steps.", name: "Priya N.", grade: "Sophomore, Houston TX", initials: "PN", color: "#3dd68c" },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF7] relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-6 max-w-7xl mx-auto">
        <span className="font-display font-bold text-2xl text-[#1a1a2e] tracking-tight">Collegable</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/login")} className="text-sm font-medium text-[#4a4a6a] hover:text-[#6C63FF] transition-colors">Log In</button>
          <button onClick={() => navigate("/signup")} className="text-sm font-semibold bg-[#FF6B6B] text-white px-5 py-2.5 rounded-full hover:bg-[#e85d5d] transition-colors">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-12 pt-20 pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 text-[#6C63FF] text-xs font-semibold px-4 py-2 rounded-full mb-10 uppercase border border-[#e0e0f0]">
          <span className="w-1.5 h-1.5 bg-[#6C63FF] rounded-full"></span>
          Free for every student, always
        </div>
        <h1 className="font-display font-bold text-[2.4rem] md:text-[3.2rem] text-[#1a1a2e] leading-[1.3] tracking-tight max-w-3xl mb-6">
          No counselor?<br />
          <span className="text-[#6C63FF]">No problem.</span><br />
          We've got your roadmap.
        </h1>
        <p className="text-lg text-[#6b6b8a] max-w-lg leading-relaxed mb-4">
          Answer 5 questions. Get a personalized college prep checklist, curated resources, and an AI guide — built specifically for students figuring this out on their own.
        </p>
        <p className="text-sm text-[#9a9ab0] mb-10">No credit card. No sign-up wall. Just your roadmap.</p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button onClick={() => navigate("/signup")} className="bg-[#FF6B6B] text-white font-semibold text-base px-9 py-4 rounded-full hover:bg-[#e85d5d] transition-colors shadow-sm">Build My Roadmap →</button>
          <button onClick={() => navigate("/login")} className="text-[#4a4a6a] font-medium text-base px-9 py-4 rounded-full border border-[#d4d4e8] hover:border-[#6C63FF] transition-colors bg-white/60">Already have an account</button>
        </div>
        <div className="mt-14 flex items-center gap-10 flex-wrap justify-center">
          <div className="text-center">
            <div className="font-display font-bold text-2xl text-[#1a1a2e]">4 min</div>
            <div className="text-xs text-[#9a9ab0] mt-1">avg. onboarding time</div>
          </div>
          <div className="w-px h-8 bg-[#e0e0e8]"></div>
          <div className="text-center">
            <div className="font-display font-bold text-2xl text-[#1a1a2e]">100%</div>
            <div className="text-xs text-[#9a9ab0] mt-1">free, no hidden fees</div>
          </div>
          <div className="w-px h-8 bg-[#e0e0e8]"></div>
          <div className="text-center">
            <div className="font-display font-bold text-2xl text-[#1a1a2e]">9th–12th</div>
            <div className="text-xs text-[#9a9ab0] mt-1">grade, all levels</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-12 pb-24">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-[#9a9ab0] uppercase tracking-widest mb-3">Everything you need</p>
          <h2 className="font-display font-bold text-[2rem] text-[#1a1a2e] max-w-xl mx-auto leading-snug">Three tools. One place. Zero confusion.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#f0f0f5] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF0FF] flex items-center justify-center text-2xl">✅</div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-2">Your Personal Checklist</h3>
              <p className="text-sm text-[#6b6b8a] leading-relaxed">A grade-by-grade checklist built around your goals, GPA, and interests. Check things off as you go — no more wondering what comes next.</p>
            </div>
            <div className="mt-auto pt-4 border-t border-[#f0f0f5]">
              <span className="text-xs font-semibold text-[#6C63FF]">40+ tasks across all 4 years</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#f0f0f5] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F0] flex items-center justify-center text-2xl">📚</div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-2">Curated Resource Library</h3>
              <p className="text-sm text-[#6b6b8a] leading-relaxed">Handpicked guides on FAFSA, SAT prep, essay writing, scholarships, and more — filtered to what's actually relevant for your grade year.</p>
            </div>
            <div className="mt-auto pt-4 border-t border-[#f0f0f5]">
              <span className="text-xs font-semibold text-[#FF6B6B]">Updated every semester</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#f0f0f5] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EDFBF4] flex items-center justify-center text-2xl">🤖</div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-2">AI College Guide</h3>
              <p className="text-sm text-[#6b6b8a] leading-relaxed">Ask anything — deadlines, essay tips, financial aid questions, school comparisons. Trained on real college prep resources, available 24/7.</p>
            </div>
            <div className="mt-auto pt-4 border-t border-[#f0f0f5]">
              <span className="text-xs font-semibold text-[#3dd68c]">Answers in seconds, any time of night</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 bg-white/60 backdrop-blur-sm border-t border-[#ebebf0] py-20 px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold text-[#9a9ab0] uppercase tracking-widest mb-12">What students are saying</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-[#f0f0f5] flex flex-col gap-5">
                <p className="text-[#3a3a5a] text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: t.color }}>{t.initials}</div>
                  <div>
                    <div className="text-sm font-semibold text-[#1a1a2e]">{t.name}</div>
                    <div className="text-xs text-[#9a9ab0]">{t.grade}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-20 px-12 flex flex-col items-center text-center">
        <h2 className="font-display font-bold text-[2rem] text-[#1a1a2e] mb-4">Ready to start your roadmap?</h2>
        <p className="text-[#6b6b8a] text-base max-w-md mb-8">Takes 4 minutes. Free forever. Built for students who are doing this on their own.</p>
        <button onClick={() => navigate("/signup")} className="bg-[#6C63FF] text-white font-semibold text-base px-10 py-4 rounded-full hover:bg-[#5a52e0] transition-colors shadow-sm">Get My Free Roadmap →</button>
      </section>

    </div>
  )
}