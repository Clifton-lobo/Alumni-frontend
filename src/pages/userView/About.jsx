import React, { useEffect, useRef, useState } from 'react'
import AiCOllegeIage from '../../assets/AiGeneratedCollegeImage.png'



const steps = [
  {
    number: "01",
    icon: "🏫",
    title: "Establishment of the Institution",
    description:
      "VPM’s Ramniklal Zaveribhai Shah College of Arts, Science & Commerce was established in 2003 with approval from the Government of Maharashtra to operate on a permanently unaided basis. The institution is managed by the Vidya Prasarak Mandal, a trust dedicated to providing quality education in Mulund and surrounding regions.",
    tag: "Foundation",
    side: "left",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
  },
  {
    number: "02",
    icon: "📍",
    title: "Strategic Location",
    description:
      "The college is located on Mithagar Road in Mulund East, Mumbai, within walking distance of Mulund Railway Station on the Central line. Its convenient location makes it easily accessible for students commuting from different parts of Mumbai.",
    tag: "Location",
    side: "right",
    image: "https://images.unsplash.com/photo-1562774053-701939374585"
  },
  {
    number: "03",
    icon: "🎓",
    title: "University Affiliation",
    description:
      "The college is affiliated with the prestigious University of Mumbai and follows the academic framework and curriculum established by the university, ensuring recognized and high-quality undergraduate education.",
    tag: "Affiliation",
    side: "left",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f"
  },
  {
    number: "04",
    icon: "📚",
    title: "Expansion of Academic Programs",
    description:
      "Initially offering B.Com and B.Sc. (Information Technology), the college expanded its academic offerings to include B.Sc. (Computer Science), B.Com (Banking & Insurance), B.Com (Accounting & Finance), Bachelor of Management Studies (BMS), and BAMMC (formerly BMM).",
    tag: "Programs",
    side: "right",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc"
  },
  {
    number: "05",
    icon: "🧠",
    title: "Internal Quality Assurance Cell",
    description:
      "The Internal Quality Assurance Cell (IQAC) plays a vital role in maintaining academic standards and continuous improvement. It oversees admissions, academic performance, infrastructure development, student counseling, and institutional development initiatives.",
    tag: "Quality",
    side: "left",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    number: "06",
    icon: "🌱",
    title: "Student Development & Activities",
    description:
      "The college emphasizes holistic development through cultural programs, sports activities, NSS initiatives, and inter-collegiate competitions. These activities encourage leadership, teamwork, and social responsibility among students.",
    tag: "Campus Life",
    side: "right",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
  }
]

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function TimelineStep({ step, index }) {
  const [ref, inView] = useInView(0.15)
  const isLeft = step.side === 'left'

  return (
    <div
      ref={ref}
      className={`flex relative mb-20 ${isLeft ? 'justify-start' : 'justify-end'}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'none'
          : isLeft
            ? 'translateX(-130px) rotate(-5deg) scale(0.82)'
            : 'translateX(130px) rotate(5deg) scale(0.82)',
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s,
                     transform 0.85s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      {/* Card */}
      <div className="w-5/12 bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden shadow-lg">
        {/* Corner glow */}
        <div
          className="absolute -top-12 w-36 h-36 rounded-full pointer-events-none"
          style={{
            [isLeft ? 'right' : 'left']: '-3rem',
            background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Step header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 text-xl leading-none">
            {step.icon}
          </span>
          <span className="text-indigo-600 font-mono text-xs font-bold tracking-widest uppercase">
            STEP {step.number}
          </span>
        </div>

        <h3 className="text-slate-900 text-2xl font-extrabold mb-3 leading-snug" style={{ fontFamily: "'Georgia', serif" }}>
          {step.title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed mb-5">
          {step.description}
        </p>

        {step.hasImage && (
          <div className="rounded-xl mb-5 h-36 flex items-center justify-center border border-slate-200 bg-gradient-to-br from-indigo-50 to-rose-50">
            <span className="text-slate-400 text-xs">[ Campus Photo ]</span>
          </div>
        )}

        <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full px-4 py-1 text-xs font-semibold">
          {step.tag}
        </span>
      </div>

      {/* Timeline dot */}
      <div
        className="absolute left-1/2 top-10 w-4 h-4 rounded-full bg-indigo-600 z-10"
        style={{
          transform: inView ? 'translateX(-50%) scale(1.35)' : 'translateX(-50%) scale(1)',
          boxShadow: inView
            ? '0 0 0 6px rgba(79,70,229,0.15), 0 0 20px rgba(79,70,229,0.35)'
            : '0 0 0 4px rgba(79,70,229,0.1)',
          transition: `transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.12 + 0.3}s,
                       box-shadow 0.6s ease ${index * 0.12 + 0.3}s`,
        }}
      />
    </div>
  )
}

function CounterStat({ value, label, delay }) {
  const [ref, inView] = useInView(0.3)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const num = parseInt(value)
    let start = 0
    const stepSize = Math.ceil(num / 50)
    const timer = setInterval(() => {
      start += stepSize
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(start)
    }, 28)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.8)',
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <div
        className="text-5xl font-black leading-none"
        style={{
          fontFamily: "'Georgia', serif",
          background: 'linear-gradient(135deg, #4f46e5, #e11d48)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {count}+
      </div>
      <div className="text-slate-500 text-xs tracking-widest uppercase mt-2 font-semibold">
        {label}
      </div>
    </div>
  )
}

const About = () => {
  const [titleRef, titleInView] = useInView(0.3)
  const [statsRef] = useInView(0.3)

  return (
    <div className="bg-slate-50 text-slate-900 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>

        <img
          src={AiCOllegeIage}
          alt="College Campus"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.42) saturate(0.85)' }}
        />

        {/* Overlays */}


        {/* Content — no scroll transitions */}
        <div className="relative text-center px-6">
          <div className="inline-block bg-white/20 border border-white/40 rounded-full px-6 py-2 text-white text-xs font-bold tracking-widest uppercase mb7 backdrop-blur-md">
            Est. 2003 · Excellence Redefined
          </div>

          <h1
            className="font-black leading-tight mb6 text-white"
            style={{
              fontSize: 'clamp(44px, 8vw, 75px)',
              fontFamily: "'Georgia', 'Times New Roman', serif",
              letterSpacing: '-2px',
              textShadow: '0 4px 24px rgba(0,0,0,0.35)',
            }}
          >
            VPM's R.Z. Shah
            College
          </h1>

          <p
            className="text-white/80 max-w-xl mx-auto mb10 leadingrelaxed"
            style={{
              fontSize: 'clamp(15px, 1.8vw, 19px)',
              textShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}
          >
            A legacy of academic brilliance, groundbreaking research,
            and leaders who've shaped the world across generations.
          </p>

        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/40 text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-9" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)' }} />
        </div> */}
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="py-20 px-20  bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-10">
          <CounterStat value="20" label="Years of Legacy" delay={0} />
          <CounterStat value="50000" label="Alumni Worldwide" delay={0.1} />
          <CounterStat value="60" label="Countries Reached" delay={0.2} />
        </div>
      </section>

      {/* ── SECTION HEADER ── */}
      <section className="pt-24 pb-14 px-10 text-center bg-slate-50">
        <div
          ref={titleRef}
          style={{
            opacity: titleInView ? 1 : 0,
            transform: titleInView ? 'translateY(0)' : 'translateY(60px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <p className="text-indigo-600 text-xs tracking-widest uppercase font-bold mb-4">
            Our Pillars
          </p>
          <h2
            className="font-black text-gray-800 mb-5"
            style={{
              fontSize: 'clamp(34px, 5vw, 60px)',
              fontFamily: "'Georgia', serif",
              letterSpacing: '-1px',
            }}
          >
            From Campus to Career
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-base leading-relaxed">
            Every element of our institution is crafted to transform students into the world's next generation of leaders and innovators.
          </p>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="px-10 pb-28 relative max-w-5xl mx-auto">
        {/* Center line */}
        <div
          className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2"
          style={{ background: 'linear-gradient(to bottom, transparent, #c7d2fe 10%, #fecdd3 90%, transparent)' }}
        />
        {steps.map((step, i) => (
          <TimelineStep key={step.number} step={step} index={i} />
        ))}
      </section>

      {/* ── CTA ── */}
      {/* ── ACADEMIC EXCELLENCE SECTION ── */}
      <section className="bg-white py-24 px-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>

            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Excellence in education across disciplines
            </h2>

            <p className="text-slate-600 leading-relaxed mb-6">
              VPM’s Ramniklal Zaveribhai Shah College of Arts, Science and Commerce
              provides students with a dynamic learning environment that combines
              academic knowledge with practical exposure. Established in 2003 and
              affiliated with the University of Mumbai, the institution offers
              undergraduate programs in Commerce, Science and Arts.
            </p>

            <p className="text-slate-600 leading-relaxed mb-8">
              The college offers programs such as B.Com, BAF, BBI, BMS, BAMMC,
              B.Sc. IT and B.Sc. Computer Science. With ICT-enabled classrooms,
              modern laboratories, and a strong academic support system, the
              institution encourages students to explore ideas, develop skills,
              and prepare for professional careers.
            </p>

            <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-8 py-4 rounded-md transition">
              Explore Academic Programs
            </button>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
              alt="Students learning"
              className="rounded-lg shadow-lg w-full object-cover"
            />

          </div>

        </div>
      </section>

    </div>
  )
}

export default About