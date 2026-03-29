import React, { useEffect, useRef, useState } from 'react'
import AiCollegeImage from '../../assets/college_16_9_fixed.png'
import NBHKulkarniImage from '../../assets/Ai_NBH_KULKARNI.png'

/* ─── Google Fonts ─── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@300;400;600;700&family=Oswald:wght@300;400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])
  return null
}

/* ─── SVG Icons ─── */
const IconUniversity = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)
const IconBook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)
const IconGraduate = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
)
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IconQuote = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" opacity="0.3"/>
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
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

/* ─── Timeline accent color — single unified gold ─── */
const ACCENT = '#B8882E'
const ACCENT_LIGHT = '#C8963E'
const ACCENT_PALE = '#F5ECD7'

/* ─── Animated Counter — numeric Oswald font ─── */
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
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        textAlign: 'center',
        padding: '0 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: ACCENT_PALE,
        border: `1.5px solid ${ACCENT}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: ACCENT,
        marginBottom: 4,
      }}>
        <Icon />
      </div>
      {/* Number — Oswald for crisp numeric feel */}
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 900,
        fontSize: 'clamp(30px, 4vw, 50px)',
        lineHeight: 1,
        color: '#1A1410',
        letterSpacing: '-1.5px',
      }}>
        {count.toLocaleString()}<span style={{ color: ACCENT_LIGHT, fontSize: '0.7em' }}>{suffix}</span>
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 400,
        fontSize: 10.5,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#9A9080',
      }}>
        {label}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TIMELINE ENTRY — unified gold accent, alternating layout
═══════════════════════════════════════════════════════════ */
function TimelineEntry({ item, index }) {
  const [ref, inView] = useInView(0.08)
  const isMobile = useIsMobile()
  const isLeft = index % 2 === 0

  const imgBlock = (
    <div style={{
      flex: '0 0 42%',
      maxWidth: '42%',
      position: 'relative',
      borderRadius: 6,
      overflow: 'hidden',
      background: '#E8E0D5',
      aspectRatio: '16/10',
      boxShadow: `0 8px 40px rgba(0,0,0,0.14), 0 0 0 1px ${ACCENT}22`,
    }}>
      <img
        src={item.image}
        alt={item.title}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: item.imgPosition || 'center',
          display: 'block',
          transition: 'transform 0.7s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
      {/* Top accent bar — always gold */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ACCENT_LIGHT }} />
      {/* Year badge on image */}
      <div style={{
        position: 'absolute',
        bottom: 12, left: 12,
        background: 'rgba(18,12,4,0.72)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${ACCENT}55`,
        borderRadius: 4,
        padding: '4px 10px',
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 300,
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#E8C97E',
      }}>
        {item.year}
      </div>
    </div>
  )

  const textBlock = (
    <div style={{
      flex: '0 0 42%',
      maxWidth: '42%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: isLeft ? 'left' : 'right',
    }}>
      {/* Category label */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        marginBottom: 10,
      }}>
        <div style={{ width: 16, height: 1, background: ACCENT, opacity: 0.6 }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: 9.5,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: ACCENT,
        }}>
          {item.label}
        </span>
        <div style={{ width: 16, height: 1, background: ACCENT, opacity: 0.6 }} />
      </div>

      {/* Title — Cormorant for elegance */}
      <h3 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 600,
        fontSize: 'clamp(18px, 2.2vw, 26px)',
        lineHeight: 1.2,
        color: '#1A1410',
        letterSpacing: '-0.2px',
        marginBottom: 14,
      }}>
        {item.title}
      </h3>

      {/* Rule */}
      <div style={{
        height: 1, width: 36, background: ACCENT,
        marginBottom: 14,
        alignSelf: isLeft ? 'flex-start' : 'flex-end',
        opacity: 0.5,
      }} />

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        fontSize: 13.5,
        lineHeight: 1.85,
        color: '#6A6258',
        margin: 0,
      }}>
        {item.description}
      </p>
    </div>
  )

  if (isMobile) {
    return (
      <div ref={ref} style={{
        display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
      }}>
        <div style={{ width: '100%', borderRadius: 6, overflow: 'hidden', aspectRatio: '16/9', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ACCENT_LIGHT }} />
        </div>
        <div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, marginBottom: 6, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{item.year} · {item.label}</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 20, color: '#1A1410', marginBottom: 10 }}>{item.title}</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.85, color: '#6A6258', fontWeight: 300 }}>{item.description}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} style={{
      display: 'flex', alignItems: 'center', gap: 0, marginBottom: 72,
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(30px)',
      transition: `opacity 0.75s ease ${index * 0.1}s, transform 0.75s ease ${index * 0.1}s`,
    }}>
      {isLeft ? imgBlock : textBlock}

      {/* Center spine column */}
      <div style={{ flex: '0 0 16%', display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch', position: 'relative' }}>
        {/* Connector line */}
        <div style={{
          position: 'absolute', top: '50%',
          left: isLeft ? 0 : '50%', right: isLeft ? '50%' : 0, height: 1,
          background: `linear-gradient(${isLeft ? 'to right' : 'to left'}, transparent, ${ACCENT}55)`,
          transform: 'translateY(-50%)',
        }} />
        {/* Dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: ACCENT_LIGHT,
          boxShadow: inView ? `0 0 0 4px ${ACCENT}22, 0 0 14px ${ACCENT}55` : 'none',
          transition: `box-shadow 0.5s ease ${index * 0.1 + 0.3}s`,
          zIndex: 2,
        }} />
      </div>

      {isLeft ? textBlock : imgBlock}
    </div>
  )
}

/* ─── Timeline items ─── */
const timelineItems = [
  {
    year: 'Est. 2003',
    label: 'Foundation',
    title: 'Establishment of the Institution',
    description:
      "VPM's R.Z. Shah College was established in 2003 with Government of Maharashtra approval, operating on a permanently unaided basis under the Vidya Prasarak Mandal — a trust committed to spreading education across Maharashtra.",
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    year: 'Mulund East',
    label: 'Location',
    title: 'Strategic Location in Mumbai',
    description:
      "Situated on Mithagar Road, Mulund East — minutes from Mulund Railway Station on the Central line, making it one of Mumbai's most accessible colleges for students commuting from across the city.",
    image: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    year: 'Affiliated',
    label: 'Affiliation',
    title: 'University of Mumbai',
    description:
      "Proudly affiliated with the University of Mumbai — one of India's oldest and most prestigious universities — ensuring every degree carries national recognition, academic weight, and lifelong credibility.",
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    year: 'Programs',
    label: 'Academics',
    title: 'Expanding Academic Horizons',
    description:
      'From B.Com and B.Sc. IT at inception to a full suite — B.Sc. CS, BAF, BBI, BMS, BAMMC — the college has grown its academic portfolio to meet every career aspiration across commerce, science, and media.',
    image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

/* ═══════════════════════════════════════════════════════════
   FEATURED ENTRY — NBH Kulkarni
   Visually distinct card that anchors the top of the timeline
═══════════════════════════════════════════════════════════ */
function FeaturedEntry({ isMobile }) {
  const [ref, inView] = useInView(0.05)

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: isMobile ? 56 : 72,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(32px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}
    >
      {/* ── Card ── */}
      <div style={{
        width: '100%',
        background: '#16110A',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: `0 24px 80px rgba(0,0,0,0.28), 0 0 0 1px ${ACCENT}33`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: isMobile ? 'auto' : 340,
        position: 'relative',
      }}>

        {/* Gold top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${ACCENT}00 0%, ${ACCENT_LIGHT} 30%, #E8C97E 60%, ${ACCENT}00 100%)`,
        }} />

        {/* LEFT — Text panel */}
        <div style={{
          flex: isMobile ? 'none' : '0 0 52%',
          padding: isMobile ? '36px 28px 32px' : '48px 52px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}>

          {/* Section label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${ACCENT}18`, border: `1px solid ${ACCENT}44`,
            borderRadius: 100, padding: '5px 14px', marginBottom: 24,
            width: 'fit-content',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT_LIGHT }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 9.5,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C8A85E',
            }}>
              Founding Principal
            </span>
          </div>

          {/* Quote mark */}
          <div style={{ color: ACCENT, opacity: 0.25, marginBottom: 8 }}>
            <IconQuote />
          </div>

          {/* Name — elegant serif */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600,
            fontSize: isMobile ? 28 : 'clamp(28px, 3.2vw, 40px)',
            lineHeight: 1.1,
            color: '#F5ECD7',
            letterSpacing: '-0.5px',
            marginBottom: 6,
          }}>
            Shri N.B.H. Kulkarni
          </h2>

          {/* Thin ornamental rule */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
          }}>
            <div style={{ height: 1, width: 32, background: ACCENT_LIGHT, opacity: 0.7 }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 11,
              color: '#9A8060', letterSpacing: '0.1em',
            }}>
              Visionary Architect of Excellence
            </span>
          </div>

          {/* Description */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: isMobile ? 13.5 : 14,
            lineHeight: 1.85,
            color: 'rgba(245,236,215,0.62)',
            marginBottom: 28,
            maxWidth: 400,
          }}>
            Shri N.B.H. Kulkarni was the guiding force behind the institution's founding — a visionary educator whose unwavering belief in accessible, quality higher education gave birth to VPM's R.Z. Shah College in 2003. His principles continue to define the college's ethos today.
          </p>

          {/* Stat chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Est. 2003', 'VPM Trust', 'Mumbai University'].map(tag => (
              <span key={tag} style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 10.5,
                color: '#B89A62', letterSpacing: '0.08em',
                border: `1px solid ${ACCENT}33`,
                borderRadius: 100, padding: '5px 12px',
                background: 'rgba(200,150,62,0.07)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — Image panel */}
        <div style={{
          flex: isMobile ? 'none' : '1',
          position: 'relative',
          minHeight: isMobile ? 260 : 'auto',
          overflow: 'hidden',
        }}>
          {/* Dark overlay on left edge to blend into text panel */}
          <div style={{
            position: 'absolute', inset: 0,
            background: isMobile
              ? 'linear-gradient(to bottom, rgba(22,17,10,0.5) 0%, transparent 40%)'
              : 'linear-gradient(to right, rgba(22,17,10,0.7) 0%, rgba(22,17,10,0.2) 35%, transparent 65%)',
            zIndex: 1,
          }} />
          {/* Subtle gold vignette bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to top, rgba(22,17,10,0.5) 0%, transparent 100%)',
            zIndex: 1,
          }} />
          <img
            src={NBHKulkarniImage}
            alt="Shri N.B.H. Kulkarni"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
              minHeight: isMobile ? 260 : 340,
            }}
          />
          {/* Year watermark */}
          <div style={{
            position: 'absolute', bottom: 20, right: 20, zIndex: 2,
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(232,197,126,0.55)',
          }}>
            Est. 2003
          </div>
        </div>
      </div>

      {/* Spine connector dot below the card */}
      {!isMobile && (
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: ACCENT_LIGHT,
          boxShadow: inView ? `0 0 0 5px ${ACCENT}22, 0 0 14px ${ACCENT}55` : 'none',
          margin: '24px 0 0',
          transition: 'box-shadow 0.6s ease 0.4s',
          zIndex: 2, position: 'relative',
        }} />
      )}
    </div>
  )
}

/* ─── Main Component ─── */
const About = () => {
  const [titleRef, titleInView] = useInView(0.2)
  const [heroRef, heroInView] = useInView(0.05)
  const isMobile = useIsMobile()

  return (
    <div style={{ background: '#FAF7F2', color: '#1A1410', overflowX: 'hidden' }}>
      <FontLoader />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
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
              : { right: 0, padding: '0 64px 52px', maxWidth: 580, textAlign: 'left' }),
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(200,150,62,0.15)', border: '1px solid rgba(200,150,62,0.4)',
            borderRadius: 100, padding: '5px 14px 5px 8px', marginBottom: 18,
          }}>
            <span style={{
              background: '#C8963E', borderRadius: '50%', width: 6, height: 6,
              display: 'inline-block', animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8B96E',
            }}>
              Est. 2003 · Mulund, Mumbai
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900,
            fontSize: isMobile ? 'clamp(26px, 7vw, 38px)' : 'clamp(30px, 4.2vw, 56px)',
            lineHeight: 1.06, letterSpacing: '-1.3px', color: '#FFFDF9',
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

      {/* ══════════════════════════════════════
          STATS BAND — Oswald numeric font + SVG icons
      ══════════════════════════════════════ */}
      <section style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #EDE5D8',
        padding: isMobile ? '36px 20px' : '48px 0',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${ACCENT_LIGHT} 30%, #C8963E 70%, transparent 100%)`,
        }} />

        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
        }}>
          {[
            { value: '20', suffix: '+', label: 'Years of Legacy', icon: IconClock, delay: 0 },
            { value: '50000', suffix: '+', label: 'Alumni Worldwide', icon: IconUsers, delay: 0.1 },
            { value: '60', suffix: '+', label: 'Countries Reached', icon: IconGlobe, delay: 0.2 },
          ].map((s, i) => (
            <div key={s.label} style={{
              borderRight: i < 2 ? '1px solid #EDE5D8' : 'none',
              padding: '0 20px',
            }}>
              <CounterStat {...s} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION HEADER
      ══════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '48px 20px 32px' : '72px 40px 48px', textAlign: 'center' }}>
        <div
          ref={titleRef}
          style={{
            opacity: titleInView ? 1 : 0,
            transform: titleInView ? 'none' : 'translateY(28px)',
            transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ height: 1, width: 60, background: `linear-gradient(to right, transparent, ${ACCENT})` }} />
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 900,
              fontSize: isMobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(30px, 3.5vw, 48px)',
              lineHeight: 1.1, letterSpacing: '-1px', color: '#1A1410',
              margin: 0, whiteSpace: 'nowrap',
            }}>
              Legacy & Foundation
            </h2>
            <div style={{ height: 1, width: 60, background: `linear-gradient(to left, transparent, ${ACCENT})` }} />
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: isMobile ? 14 : 15, lineHeight: 1.8, color: '#7A7060',
            maxWidth: 480, margin: '0 auto',
          }}>
            Every element of our institution is crafted to transform students into the world's
            next generation of leaders and innovators.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        maxWidth: 1100,
        margin: '0 auto',
        padding: isMobile ? '0 20px 60px' : '0 40px 80px',
      }}>

        {/* ── Featured: NBH Kulkarni ── */}
        <FeaturedEntry isMobile={isMobile} />

        {/* ── Spine ── */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            top: 380, bottom: 0, left: '50%', width: 1,
            transform: 'translateX(-50%)',
            background: `linear-gradient(to bottom, ${ACCENT}55, ${ACCENT_LIGHT}88 40%, ${ACCENT}44 80%, transparent)`,
          }} />
        )}

        {/* ── Alternating cards ── */}
        <div style={{ marginTop: 0 }}>
          {timelineItems.map((item, i) => (
            <TimelineEntry key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.8); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}

export default About