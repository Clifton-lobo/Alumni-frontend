import React, { useEffect, useRef, useState } from 'react'
import AiCollegeImage from '../../assets/college_16_9_fixed.png'
import NBHKulkarniImage from '../../assets/Ai_NBH_KULKARNI.png'

/* ─── Google Fonts ─── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])
  return null
}

/* ─── SVG Icons ─── */
const IconUniversity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)
const IconBook = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)
const IconGraduate = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
)
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconGlobe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

/* ─── useInView ─── */
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ─── useIsMobile ─── */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

/* ─── Tokens ─── */
const NAVY  = '#142A5D'
const NAVY2 = '#1e3e8f'
const NAVY3 = '#2f5ac7'
const MUTED = '#6b7a99'
const BORDER = 'rgba(20,42,93,0.10)'
const BG = '#F5F8FF'

/* ─── Animated Counter ─── */
function CounterStat({ value, suffix = '+', label, delay, icon: Icon }) {
  const [ref, inView] = useInView(0.3)
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const num = parseInt(value)
    let start = 0
    const step = Math.ceil(num / 60)
    const t = setInterval(() => {
      start += step
      if (start >= num) { setCount(num); clearInterval(t) }
      else setCount(start)
    }, 22)
    return () => clearInterval(t)
  }, [inView, value])

  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(16px)',
      transition: `all 0.6s ease ${delay}s`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 1rem',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: `${NAVY}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: NAVY,
      }}>
        <Icon />
      </div>
      <div style={{
        fontFamily: "'Sora', sans-serif", fontWeight: 800,
        fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1, color: NAVY, letterSpacing: '-1px',
      }}>
        {count.toLocaleString()}<span style={{ color: NAVY3, fontSize: '0.65em' }}>{suffix}</span>
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED,
      }}>
        {label}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   NBH KULKARNI — Creative dark feature card
═══════════════════════════════════════════════ */
function FoundingPrincipalCard({ isMobile }) {
  const [ref, inView] = useInView(0.05)

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.85s ease, transform 0.85s cubic-bezier(0.22,1,0.36,1)',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#0f1e45',
        position: 'relative',
        marginBottom: 80,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: isMobile ? 'auto' : 320,
        boxShadow: '0 20px 64px rgba(20,42,93,0.30)',
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: 'absolute', top: -80, right: 200, width: 300, height: 300, borderRadius: '50%', background: 'rgba(47,90,199,0.14)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: 320, width: 220, height: 220, borderRadius: '50%', background: 'rgba(47,90,199,0.08)', pointerEvents: 'none' }} />

      {/* Top glow bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent 0%, #3b82f6 30%, #93c5fd 55%, transparent 100%)' }} />

      {/* ── LEFT: Text ── */}
      <div style={{
        flex: isMobile ? 'none' : '0 0 55%',
        padding: isMobile ? '44px 28px 36px' : '48px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', zIndex: 2,
      }}>
        {/* Giant decorative quote */}
        <div style={{
          fontSize: 112, lineHeight: 0.65,
          color: 'rgba(59,130,246,0.12)',
          fontFamily: 'Georgia, serif', fontWeight: 900,
          marginBottom: 20, userSelect: 'none', letterSpacing: '-6px',
        }}>"</div>

        {/* Pill badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(59,130,246,0.14)', border: '1px solid rgba(59,130,246,0.28)',
          borderRadius: 100, padding: '5px 14px', marginBottom: 22, width: 'fit-content',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#93c5fd' }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#93c5fd' }}>
            Founding Principal · Est. 2003
          </span>
        </div>

        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 800,
          fontSize: isMobile ? 26 : 'clamp(24px, 2.8vw, 36px)',
          lineHeight: 1.1, color: '#fff', letterSpacing: '-0.6px', marginBottom: 6,
        }}>
          Shri N.B.H. Kulkarni
        </h2>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, color: '#60a5fa', letterSpacing: '0.09em', marginBottom: 20 }}>
          Visionary Architect of Excellence
        </p>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: isMobile ? 13.5 : 14, lineHeight: 1.82, color: 'rgba(255,255,255,0.58)', maxWidth: 390, marginBottom: 32 }}>
          The guiding force behind the institution's founding — a visionary educator whose unwavering belief in accessible, quality higher education gave birth to VPM's R.Z. Shah College. His principles continue to define the college's ethos today.
        </p>

        {/* Inline stats */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[
            { v: '20', s: '+', l: 'Years Legacy' },
            { v: '7', s: '+', l: 'Programs' },
            { v: 'MU', s: '', l: 'Affiliated' },
          ].map((stat, i) => (
            <React.Fragment key={stat.l}>
              <div style={{ textAlign: 'center', padding: '0 22px 0 0' }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: i === 2 ? 16 : 22, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
                  {stat.v}{stat.s && <span style={{ color: '#3b82f6', fontSize: '0.62em' }}>{stat.s}</span>}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  {stat.l}
                </div>
              </div>
              {i < 2 && <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.1)', marginRight: 22 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Image ── */}
      <div style={{ flex: isMobile ? 'none' : '1', position: 'relative', minHeight: isMobile ? 260 : 'auto', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: isMobile
            ? 'linear-gradient(to bottom, rgba(15,30,69,0.65) 0%, transparent 45%)'
            : 'linear-gradient(to right, rgba(15,30,69,0.90) 0%, rgba(15,30,69,0.30) 42%, transparent 72%)',
        }} />
        <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 2, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(147,197,253,0.28)' }}>
          Est. 2003
        </div>
        <img
          src={NBHKulkarniImage}
          alt="Shri N.B.H. Kulkarni"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', minHeight: isMobile ? 260 : 320 }}
        />
      </div>
    </div>
  )
}

/* ─── Timeline data ─── */
const timelineItems = [
  {
    year: 'Est. 2003',
    label: 'Foundation',
    title: 'Establishment of the Institution',
    description: "VPM's R.Z. Shah College was established in 2003 with Government of Maharashtra approval, operating on a permanently unaided basis under the Vidya Prasarak Mandal — a trust committed to spreading education across Maharashtra.",
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=900',
    accent: NAVY,
    accentAlpha: 'rgba(20,42,93,',
  },
  {
    year: 'Mulund East',
    label: 'Location',
    title: 'Strategic Location in Mumbai',
    description: "Situated on Mithagar Road, Mulund East — minutes from Mulund Railway Station on the Central line, making it one of Mumbai's most accessible colleges for students commuting from across the city.",
    image: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=900',
    accent: '#1a6b5a',
    accentAlpha: 'rgba(26,107,90,',
  },
  {
    year: 'Affiliated',
    label: 'University',
    title: 'University of Mumbai',
    description: "Proudly affiliated with the University of Mumbai — one of India's oldest and most prestigious universities — ensuring every degree carries national recognition, academic weight, and lifelong credibility.",
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=900',
    accent: '#6c4fa0',
    accentAlpha: 'rgba(108,79,160,',
  },
  {
    year: '7+ Programs',
    label: 'Academics',
    title: 'Expanding Academic Horizons',
    description: "From B.Com and B.Sc. IT at inception to a full suite — B.Sc. CS, BAF, BBI, BMS, BAMMC — the college has grown its academic portfolio to meet every career aspiration across commerce, science, and media.",
    image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=900',
    accent: '#b5451b',
    accentAlpha: 'rgba(181,69,27,',
  },
]

/* ═══════════════════════════════════════════════
   TIMELINE ENTRY — enhanced alternating left/right
═══════════════════════════════════════════════ */
function TimelineEntry({ item, index }) {
  const [ref, inView] = useInView(0.08)
  const isMobile = useIsMobile()
  const isLeft = index % 2 === 0   // even = image left, text right

  /* slide direction: image comes from its side, text from the other */
  const imgSlide  = isLeft  ? 'translateX(-28px)' : 'translateX(28px)'
  const textSlide = isLeft  ? 'translateX(28px)'  : 'translateX(-28px)'

  /* ── IMAGE BLOCK ── */
  const imgBlock = (
    <div style={{
      flex: '0 0 46%', maxWidth: '46%',
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
      aspectRatio: '16/10',
      boxShadow: `0 12px 48px rgba(0,0,0,0.16), 0 0 0 1px ${item.accentAlpha}0.18)`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : imgSlide,
      transition: `opacity 0.75s ease ${index * 0.08}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${index * 0.08}s`,
    }}>
      <img
        src={item.image}
        alt={item.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Subtle color overlay on image matching accent */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${item.accentAlpha}0.22) 0%, transparent 60%)`,
      }} />

      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: item.accent }} />

      {/* Year / label chip */}
      <div style={{
        position: 'absolute', bottom: 14, left: 14,
        background: 'rgba(10,10,20,0.68)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 100,
        padding: '5px 13px',
        display: 'flex', alignItems: 'center', gap: 7,
        border: `1px solid ${item.accentAlpha}0.35)`,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.accent, flexShrink: 0 }} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
          {item.year}
        </span>
      </div>
    </div>
  )

  /* ── TEXT BLOCK ── */
  const textBlock = (
    <div style={{
      flex: '0 0 46%', maxWidth: '46%',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      textAlign: isLeft ? 'left' : 'right',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : textSlide,
      transition: `opacity 0.75s ease ${index * 0.08 + 0.1}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${index * 0.08 + 0.1}s`,
    }}>

      {/* Category label row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        marginBottom: 14,
      }}>
        {!isLeft && <div style={{ height: 1, width: 28, background: item.accent, opacity: 0.5 }} />}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${item.accentAlpha}0.08)`,
          border: `1px solid ${item.accentAlpha}0.22)`,
          borderRadius: 100, padding: '4px 12px',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.accent, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: item.accent }}>
            {item.label}
          </span>
        </div>
        {isLeft && <div style={{ height: 1, width: 28, background: item.accent, opacity: 0.5 }} />}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Sora', sans-serif", fontWeight: 700,
        fontSize: 'clamp(17px, 1.9vw, 22px)',
        lineHeight: 1.22, color: '#1a2540',
        letterSpacing: '-0.3px', marginBottom: 16,
      }}>
        {item.title}
      </h3>

      {/* Short accent rule */}
      <div style={{
        height: 2, width: 32, borderRadius: 2,
        background: item.accent, opacity: 0.4,
        marginBottom: 16,
        alignSelf: isLeft ? 'flex-start' : 'flex-end',
      }} />

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 14, lineHeight: 1.85, color: MUTED, margin: 0,
      }}>
        {item.description}
      </p>
    </div>
  )

  /* ── CENTER DOT + CONNECTORS ── */
  const centerSpine = (
    <div style={{
      flex: '0 0 8%', maxWidth: '8%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', alignSelf: 'stretch',
    }}>
      {/* Horizontal connector line from image side */}
      <div style={{
        position: 'absolute', top: '50%',
        left: isLeft ? 0 : '50%',
        right: isLeft ? '50%' : 0,
        height: 1,
        background: `linear-gradient(${isLeft ? 'to right' : 'to left'}, transparent, ${item.accentAlpha}0.35))`,
        transform: 'translateY(-50%)',
      }} />
      {/* Horizontal connector from text side */}
      <div style={{
        position: 'absolute', top: '50%',
        left: isLeft ? '50%' : 0,
        right: isLeft ? 0 : '50%',
        height: 1,
        background: `linear-gradient(${isLeft ? 'to left' : 'to right'}, transparent, ${item.accentAlpha}0.20))`,
        transform: 'translateY(-50%)',
      }} />
      {/* Central dot */}
      <div style={{
        width: 12, height: 12, borderRadius: '50%',
        background: '#fff',
        border: `2.5px solid ${item.accent}`,
        boxShadow: inView ? `0 0 0 4px ${item.accentAlpha}0.15), 0 0 16px ${item.accentAlpha}0.25)` : 'none',
        transition: `box-shadow 0.5s ease ${index * 0.08 + 0.35}s`,
        position: 'relative', zIndex: 2,
        flexShrink: 0,
      }} />
    </div>
  )

  /* ── MOBILE ── */
  if (isMobile) {
    return (
      <div ref={ref} style={{
        marginBottom: 52,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(24px)',
        transition: `opacity 0.65s ease ${index * 0.08}s, transform 0.65s ease ${index * 0.08}s`,
      }}>
        <div style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '16/9', position: 'relative', marginBottom: 18, boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }}>
          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: item.accent }} />
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            background: 'rgba(10,10,20,0.65)', backdropFilter: 'blur(8px)',
            borderRadius: 100, padding: '4px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            border: `1px solid ${item.accentAlpha}0.3)`,
          }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: item.accent }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>{item.year}</span>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${item.accentAlpha}0.08)`, border: `1px solid ${item.accentAlpha}0.2)`,
          borderRadius: 100, padding: '4px 12px', marginBottom: 10,
        }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: item.accent }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: item.accent }}>{item.label}</span>
        </div>
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, lineHeight: 1.25, color: '#1a2540', marginBottom: 10 }}>{item.title}</h3>
        <div style={{ height: 2, width: 28, borderRadius: 2, background: item.accent, opacity: 0.35, marginBottom: 12 }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 14, lineHeight: 1.82, color: MUTED, margin: 0 }}>{item.description}</p>
      </div>
    )
  }

  /* ── DESKTOP: alternating ── */
  return (
    <div ref={ref} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      marginBottom: 72,
    }}>
      {isLeft ? imgBlock  : textBlock}
      {centerSpine}
      {isLeft ? textBlock : imgBlock}
    </div>
  )
}

/* ─── Main Component ─── */
const About = () => {
  const [titleRef, titleInView] = useInView(0.2)
  const [heroRef, heroInView]   = useInView(0.05)
  const isMobile = useIsMobile()

  return (
    <div style={{ background: BG, color: '#1a2540', overflowX: 'hidden', fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
      <FontLoader />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.8); }
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* ══════════════════════
          HERO — dimensions unchanged
      ══════════════════════ */}
       <section
        className="relative w-screen ml-[calc(-50vw+50%)] bg-[#0D0A06] overflow-hidden"
        style={{
          height: isMobile ? '60vh' : '620px',
          minHeight: isMobile ? 420 : undefined,
          maxHeight: isMobile ? 620 : undefined,
        }}
      >
        <img
          src={AiCollegeImage}
          alt="VPM's R.Z. Shah College Campus"
          className="absolute bottom-0 left-0 w-full h-full z-[2]"
          style={{ objectPosition: 'center', backgroundColor: '#0D0A06' }}
        />
        <div className="absolute inset-0 z-[3] bg-gradient-to-b from-[#05030133] via-[#0503011A] to-[#050301F0]" />
        {!isMobile && (
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-transparent via-transparent to-[#050301CC]" />
        )}
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_120%_90%_at_50%_50%,transparent_50%,rgba(5,3,1,0.45)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-transparent via-[#C8963E] to-transparent" />

        <div
          ref={heroRef}
          style={{
            position: 'absolute', bottom: 0, zIndex: 10,
            ...(isMobile
              ? { left: 0, right: 0, padding: '0 20px 28px', textAlign: 'center' }
              : { right: 0, padding: '0 64px 52px', maxWidth: 720, textAlign: 'left' }),
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(47,90,199,0.22)', border: '1px solid rgba(47,90,199,0.45)',
            borderRadius: 100, padding: '5px 14px 5px 8px', marginBottom: 16,
          }}>
            <span style={{ background: '#3b82f6', borderRadius: '50%', width: 6, height: 6, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#93c5fd' }}>
              Est. 2003 · Mulund, Mumbai
            </span>
          </div> */}


          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900,
            fontSize: isMobile ? 'clamp(26px, 7vw, 38px)' : 'clamp(30px, 4.2vw, 56px)',
            lineHeight: 1.12, letterSpacing: '-1.3px', color: '#FFFDF9',
            marginBottom: 16, textShadow: '0 6px 40px rgba(0,0,0,0.7)',
          }}>
            VPM's Ramniklal<br />Zaveribhai Shah<br />College
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: isMobile ? 12.5 : 'clamp(13px, 1.3vw, 15px)',
            lineHeight: 1.7, color: 'rgba(255,253,249,0.72)', marginBottom: 24,
            maxWidth: isMobile ? '100%' : 420,
            textShadow: '0 2px 14px rgba(0,0,0,0.55)',
          }}>
            A legacy of academic brilliance, transformative research, and leaders who shape
            the world — rooted in Mulund, reaching everywhere.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            {[
              { icon: IconUniversity, text: 'University of Mumbai' },
              { icon: IconBook, text: '7+ UG Programs' },
              { icon: IconGraduate, text: 'Arts · Science · Commerce' },
            ].map(c => (
              <span key={c.text} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,253,249,0.10)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,253,249,0.18)', borderRadius: 100,
                padding: '6px 14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                fontSize: isMobile ? 10 : 11, color: 'rgba(255,253,249,0.9)', letterSpacing: '0.03em',
              }}>
                <c.icon />
                {c.text}
              </span>
            ))}
          </div>
        </div>

        {!isMobile && (
          <div className="absolute bottom-[24px] left-[48px] z-10 flex flex-col items-center gap-[6px]">
            <div className="w-[1px] h-[32px] bg-gradient-to-b from-[rgba(200,150,62,0.7)] to-transparent" />
            <span className="text-[9px] tracking-[0.25em] uppercase text-[rgba(200,150,62,0.6)]">Scroll</span>
          </div>
        )}
      </section>


      {/* ══════════════════════
          STATS BAND
      ══════════════════════ */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: isMobile ? '36px 20px' : '52px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right:40, height: 2, background: `linear-gradient(90deg, transparent, ${NAVY2} 30%, ${NAVY3} 70%, transparent)` }} />
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { value: '20', suffix: '+', label: 'Years of Legacy', icon: IconClock, delay: 0 },
            { value: '50000', suffix: '+', label: 'Alumni Worldwide', icon: IconUsers, delay: 0.1 },
            { value: '60', suffix: '+', label: 'Countries Reached', icon: IconGlobe, delay: 0.2 },
          ].map((s, i) => (
            <div key={s.label} style={{ borderRight: i < 2 ? `1px solid ${BORDER}` : 'none', padding: '0 16px' }}>
              <CounterStat {...s} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════
          SECTION HEADER
      ══════════════════════ */}
      <section style={{ padding: isMobile ? '48px 20px 28px' : '72px 40px 52px', textAlign: 'center' }}>
        <div ref={titleRef} style={{
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'none' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${NAVY}0D`, border: `1px solid ${NAVY}1E`,
            borderRadius: 100, padding: '5px 16px', marginBottom: 18,
          }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: NAVY2 }}>Our Story</span>
          </div>
          <h2 style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800,
            fontSize: isMobile ? 'clamp(24px, 7vw, 32px)' : 'clamp(28px, 3vw, 42px)',
            lineHeight: 1.1, letterSpacing: '-0.8px', color: NAVY, margin: '0 0 14px',
          }}>
            Legacy & Foundation
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: isMobile ? 14 : 15, lineHeight: 1.75, color: MUTED, maxWidth: 460, margin: '0 auto' }}>
            Every element of our institution is crafted to transform students into the world's
            next generation of leaders and innovators.
          </p>
        </div>
      </section>

      {/* ══════════════════════
          NBH + TIMELINE
      ══════════════════════ */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 18px 64px' : '0 40px 96px' }}>

        <FoundingPrincipalCard isMobile={isMobile} />

        {/* Divider label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: isMobile ? 36 : 64 }}>
          <div style={{ height: 1, flex: 1, background: `${NAVY}16` }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${NAVY}50` }}>
            Our Journey
          </span>
          <div style={{ height: 1, flex: 1, background: `${NAVY}16` }} />
        </div>

        {/* Alternating timeline */}
        <div style={{ position: 'relative' }}>
          {/* Center spine line — desktop only */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              left: '50%', top: 20, bottom: 20,
              width: 1,
              transform: 'translateX(-50%)',
              background: `linear-gradient(to bottom, ${NAVY}44, ${NAVY3}66 50%, ${NAVY}22)`,
            }} />
          )}

          {timelineItems.map((item, i) => (
            <TimelineEntry key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default About