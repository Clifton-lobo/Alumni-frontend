import React, { useEffect, useRef, useState } from 'react'
import AiCollegeImage from '../../assets/college_16_9_fixed.png'
import NBHKulkarniImage from '../../assets/NBH_Kulkarni_resized.png'

/* ─── Google Fonts injection (Playfair Display + DM Sans) ─── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])
  return null
}

const steps = [
  {
    number: "01",
    label: "Foundation",
    title: "Establishment of the Institution",
    description: "VPM's R.Z. Shah College was established in 2003 with Government of Maharashtra approval, operating on a permanently unaided basis under the Vidya Prasarak Mandal.",
    detail: "Founded with a singular vision — making quality higher education accessible and impactful for the youth of Mulund and beyond. The trust's decades-long legacy of academic stewardship shaped every brick of this institution.",
    accent: "#C8963E",
    image: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800",
    side: "left",
  },
  {
    number: "02",
    label: "Location",
    title: "Strategic Location in Mumbai",
    description: "Situated on Mithagar Road, Mulund East — minutes from Mulund Railway Station on the Central line, making it one of Mumbai's most accessible colleges.",
    detail: "The campus sits within a thriving academic neighbourhood, offering students not just connectivity but a community. Easy commute from every corner of the city means more time learning, less time travelling.",
    accent: "#4A7C9E",
    image: "https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=800",
    side: "right",
  },
  {
    number: "03",
    label: "Affiliation",
    title: "University of Mumbai",
    description: "Proudly affiliated with the University of Mumbai — one of India's oldest and most prestigious universities — ensuring every degree carries national recognition and academic weight.",
    detail: "The affiliation guarantees a curriculum built on decades of academic excellence, equipping students with knowledge that stands up to the most rigorous professional and academic standards in the country.",
    accent: "#7B5EA7",
    image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800",
    side: "left",
  },
  {
    number: "04",
    label: "Programs",
    title: "Expanding Academic Horizons",
    description: "From B.Com and B.Sc. IT at inception to a full suite — B.Sc. CS, BAF, BBI, BMS, BAMMC — the college has grown its academic portfolio to meet every career aspiration.",
    detail: "Each program is designed not just for marks but for mastery. ICT-enabled classrooms, modern laboratories, and an industry-aligned curriculum prepare students for careers that matter.",
    accent: "#3D8A6E",
    image: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800",
    side: "right",
  },
]

/* ─── useInView ─── */
function useInView(threshold = 0.12) {
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

/* ─── Animated Counter ─── */
function CounterStat({ value, suffix = '+', label, icon, delay, accent }) {
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
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        textAlign: 'center',
        padding: '0 0.5rem',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 2 }}>{icon}</div>
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 900,
        fontSize: 'clamp(24px, 5vw, 52px)',
        lineHeight: 1,
        color: accent,
        letterSpacing: '-1px',
        marginBottom: 6,
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        fontSize: 'clamp(8px, 2vw, 11px)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#8A8070',
      }}>
        {label}
      </div>
    </div>
  )
}

/* ─── Timeline Card ─── */
function TimelineCard({ step, index }) {
  const [ref, inView] = useInView(0.08)
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: isMobile ? 'center' : (step.side === 'left' ? 'flex-start' : 'flex-end'),
        position: 'relative',
        marginBottom: isMobile ? 20 : 40,
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'none'
          : isMobile
            ? 'translateY(30px) scale(0.97)'
            : `translateX(${step.side === 'left' ? -60 : 60}px) scale(0.95)`,
        transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s,
                     transform 0.75s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
      }}
    >
      {/* Card — FIX: full width on mobile so cards aren't cramped at 46% */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: isMobile ? '100%' : '46%',
          background: '#FFFFFF',
          borderRadius: 20,
          overflow: 'hidden',
          border: `1px solid ${hovered ? step.accent + '55' : '#E8E0D5'}`,
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.12), 0 0 0 2px ${step.accent}22`
            : '0 4px 24px rgba(0,0,0,0.07)',
          transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div style={{ position: 'relative', height: isMobile ? 160 : 200, overflow: 'hidden' }}>
          <img
            src={step.image}
            alt={step.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to top, ${step.accent}DD 0%, ${step.accent}44 45%, transparent 100%)`,
          }} />
          <div style={{
            position: 'absolute', bottom: 14, left: 18,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900, fontSize: isMobile ? 40 : 56,
            lineHeight: 1, color: 'rgba(255,255,255,0.18)',
            letterSpacing: '-2px', userSelect: 'none',
          }}>
            {step.number}
          </div>
          <div style={{
            position: 'absolute', bottom: 16, right: 16,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: 100,
            padding: '4px 12px', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 10, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#fff',
          }}>
            {step.label}
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: step.accent }} />
        </div>

        <div style={{ padding: isMobile ? '16px 18px 20px' : '22px 24px 24px' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: isMobile ? 16 : 18,
            lineHeight: 1.3, color: '#1A1410', marginBottom: 10, letterSpacing: '-0.3px',
          }}>
            {step.title}
          </h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 13.5, lineHeight: 1.7, color: '#5A5248', marginBottom: 14,
          }}>
            {step.description}
          </p>
          <div style={{ height: 1, background: `linear-gradient(to right, ${step.accent}44, transparent)`, marginBottom: 14 }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 12, lineHeight: 1.75, color: '#8A8070',
          }}>
            {step.detail}
          </p>
        </div>
      </div>

      {/* Timeline dot — desktop only */}
      {!isMobile && (
        <div style={{
          position: 'absolute', left: '50%', top: 28,
          width: 14, height: 14, borderRadius: '50%',
          background: step.accent,
          transform: inView ? 'translateX(-50%) scale(1.4)' : 'translateX(-50%) scale(1)',
          boxShadow: inView ? `0 0 0 5px ${step.accent}25, 0 0 16px ${step.accent}50` : 'none',
          transition: `all 0.5s ease ${index * 0.1 + 0.3}s`,
          zIndex: 10,
        }} />
      )}
    </div>
  )
}

/* ─── Main Component ─── */
const About = () => {
  const [titleRef, titleInView] = useInView(0.2)
  const [heroRef, heroInView] = useInView(0.05)
  const [bottomRef, bottomInView] = useInView(0.1)
  const isMobile = useIsMobile()

  return (
    <div style={{ background: '#FAF7F2', color: '#1A1410', overflowX: 'hidden' }}>
      <FontLoader />

      {/* ══════════════════════════════════════
          HERO
          FIX: drop aspect-ratio on mobile — use minHeight instead
          so content is never clipped off-screen
      ══════════════════════════════════════ */}

      <section
        className="relative w-screen ml-[calc(-50vw+50%)] bg-[#0D0A06] overflow-hidden"
        style={{
          height: isMobile ? '60vh' : '620px', // ✅ mobile logic injected
          minHeight: isMobile ? 420 : undefined,
          maxHeight: isMobile ? 620 : undefined,
        }}
      >

        {/* IMAGE */}
        <img
          src={AiCollegeImage}
          alt="VPM's R.Z. Shah College Campus"
          className="absolute bottom-0 left-0 w-full h-full z-[2]"
          style={{
            objectPosition: 'center',
            backgroundColor: '#0D0A06',
          }}
        />
        {/* OVERLAYS */}
        <div className="absolute inset-0 z-[3] bg-gradient-to-b from-[#05030133] via-[#0503011A] to-[#050301F0]" />

        {!isMobile && (
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-transparent via-transparent to-[#050301CC]" />
        )}

        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_120%_90%_at_50%_50%,transparent_50%,rgba(5,3,1,0.45)_100%)]" />

        {/* GOLD LINE */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-transparent via-[#C8963E] to-transparent" />

        {/* CONTENT */}
        <div
          ref={heroRef}
          style={{
            position: 'absolute',
            bottom: 0,
            zIndex: 10,

            ...(isMobile
              ? {
                left: 0,
                right: 0,
                padding: '0 20px 28px',
                textAlign: 'center',
              }
              : {
                right: 0,
                padding: '0 64px 52px',
                maxWidth: 580,
                textAlign: 'left',
              }),

            opacity: heroInView ? 1 : 0,
            transform: heroInView ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(200,150,62,0.15)',
            border: '1px solid rgba(200,150,62,0.4)',
            borderRadius: 100,
            padding: '5px 14px 5px 8px',
            marginBottom: 18,
          }}>
            <span style={{
              background: '#C8963E',
              borderRadius: '50%',
              width: 6,
              height: 6,
              display: 'inline-block',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#E8B96E',
            }}>
              Est. 2003 · Mulund, Mumbai
            </span>
          </div>

          {/* TITLE */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            fontSize: isMobile
              ? 'clamp(26px, 7vw, 38px)'
              : 'clamp(30px, 4.2vw, 56px)',
            lineHeight: 1.06,
            letterSpacing: '-1.3px',
            color: '#FFFDF9',
            marginBottom: 16,
            textShadow: '0 6px 40px rgba(0,0,0,0.7)',
          }}>
            VPM's Ramniklal<br />
            Zaveribhai Shah<br />
            College
          </h1>

          {/* TAGLINE */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: isMobile ? 12.5 : 'clamp(13px, 1.3vw, 15px)',
            lineHeight: 1.7,
            color: 'rgba(255,253,249,0.72)',
            marginBottom: 24,
            maxWidth: isMobile ? '100%' : 420,
            textShadow: '0 2px 14px rgba(0,0,0,0.55)',
          }}>
            A legacy of academic brilliance, transformative research, and
            leaders who shape the world — rooted in Mulund, reaching everywhere.
          </p>

          {/* CHIPS */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: isMobile ? 'center' : 'flex-start',
          }}>
            {[
              { icon: '🏛️', text: 'University of Mumbai' },
              { icon: '📖', text: '7+ UG Programs' },
              { icon: '🎓', text: 'Arts · Science · Commerce' },
            ].map(c => (
              <span
                key={c.text}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,253,249,0.10)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,253,249,0.18)',
                  borderRadius: 100,
                  padding: '6px 14px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: isMobile ? 10 : 11,
                  color: 'rgba(255,253,249,0.9)',
                  letterSpacing: '0.03em',
                }}
              >
                <span style={{ fontSize: 13 }}>{c.icon}</span>
                {c.text}
              </span>
            ))}
          </div>
        </div>

        {/* SCROLL (desktop only) */}
        {!isMobile && (
          <div className="absolute bottom-[24px] left-[48px] z-10 flex flex-col items-center gap-[6px]">
            <div className="w-[1px] h-[32px] bg-gradient-to-b from-[rgba(200,150,62,0.7)] to-transparent" />
            <span className="text-[9px] tracking-[0.25em] uppercase text-[rgba(200,150,62,0.6)]">
              Scroll
            </span>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════ */}
      <section style={{
        background: '#FFFFFF', borderBottom: '1px solid #EDE5D8',
        padding: isMobile ? '24px 0' : '36px 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #C8963E22, #C8963E, #7B5EA722, #7B5EA7, #3D8A6E22)',
        }} />
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: isMobile ? '0 8px' : '0 40px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
        }}>
          <div style={{ borderRight: '1px solid #EDE5D8' }}>
            <CounterStat value="20" suffix="+" label="Years of Legacy" icon="🏆" delay={0} accent="#C8963E" />
          </div>
          <div style={{ borderRight: '1px solid #EDE5D8' }}>
            <CounterStat value="50000" suffix="+" label="Alumni Worldwide" icon="🌍" delay={0.1} accent="#4A7C9E" />
          </div>
          <div>
            <CounterStat value="60" suffix="+" label="Countries Reached" icon="✈️" delay={0.2} accent="#3D8A6E" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION HEADER
      ══════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '48px 20px 28px' : '64px 40px 40px', textAlign: 'center' }}>
        <div
          ref={titleRef}
          style={{
            opacity: titleInView ? 1 : 0,
            transform: titleInView ? 'none' : 'translateY(36px)',
            transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ height: 1, width: 48, background: 'linear-gradient(to right, transparent, #C8963E)' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C8963E' }}>About Us</span>
            <div style={{ height: 1, width: 48, background: 'linear-gradient(to left, transparent, #C8963E)' }} />
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900,
            fontSize: isMobile ? 'clamp(26px, 7vw, 38px)' : 'clamp(30px, 4.5vw, 52px)',
            lineHeight: 1.1, letterSpacing: '-1px', color: '#1A1410', marginBottom: 16,
          }}>
            From Campus to Career
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: isMobile ? 14 : 15, lineHeight: 1.8, color: '#7A7060',
            maxWidth: 520, margin: '0 auto',
          }}>
            Every element of our institution is crafted to transform students into the world's next generation of leaders and innovators.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════ */}
      <section style={{
        position: 'relative', maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '0 16px 48px' : '0 40px 72px',
      }}>
        {/* Centre spine — desktop only */}
        {!isMobile && (
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to bottom, transparent, #C8963E44 8%, #E8C97E88 50%, #7B5EA744 92%, transparent)',
          }} />
        )}
        {steps.map((step, i) => (
          <TimelineCard key={step.number} step={step} index={i} />
        ))}
      </section>

      {/* ══════════════════════════════════════
          NBH KULKARNI SECTION
          FIX 1: cards go full-width, no more 46% cramping
          FIX 2: on mobile, image appears FIRST (order:1),
                 text content SECOND (order:2) via CSS grid order
      ══════════════════════════════════════ */}
      <section
        ref={bottomRef}
        style={{
          background: '#FFFFFF', borderTop: '1px solid #EDE5D8',
          padding: isMobile ? '40px 20px 48px' : '64px 40px',
        }}
      >
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 32 : 64,
          alignItems: 'center',
          opacity: bottomInView ? 1 : 0,
          transform: bottomInView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
        }}>

          {/* TEXT — order:2 on mobile so image shows above it */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 2, background: '#C8963E', borderRadius: 2 }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 10,
                letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C8963E',
              }}>Leadership</span>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
              fontSize: isMobile ? 'clamp(22px, 6vw, 32px)' : 'clamp(24px, 3vw, 38px)',
              lineHeight: 1.2, letterSpacing: '-0.5px', color: '#1A1410', marginBottom: 16,
            }}>
              Visionary Leadership<br />guiding excellence
            </h2>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              lineHeight: 1.85, color: '#5A5248', marginBottom: 24,
            }}>
              Shri N.B.H. Kulkarni played a pivotal role in founding the college, laying its academic foundation and shaping it into a center of excellence through visionary leadership and unwavering commitment to quality education.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {['Founder', 'Vision', 'Leadership', 'Excellence'].map(p => (
                <span key={p} style={{
                  fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                  color: '#7B5EA7', background: 'rgba(123,94,167,0.06)',
                  border: '1px solid rgba(123,94,167,0.18)',
                  borderRadius: 100, padding: '4px 12px', letterSpacing: '0.04em',
                }}>
                  {p}
                </span>
              ))}
            </div>

            <button
              style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                background: '#EBAB09', color: '#FAF7F2', borderRadius: 8,
                padding: '12px 28px', border: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: isMobile ? '100%' : 'auto',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d49a00'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#EBAB09'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Explore His Legacy →
            </button>
          </div>

          {/* IMAGE — order:1 on mobile so it appears above the text */}
          <div style={{
            order: isMobile ? 1 : 2,
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-end',
          }}>
            <div style={{
              position: 'relative',
              width: isMobile ? '80%' : '100%',
              maxWidth: isMobile ? 300 : 460,
              borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
              <img
                src={NBHKulkarniImage}
                alt="Shri N.B.H. Kulkarni"
                style={{
                  width: '100%',
                  height: isMobile ? 260 : 330,
                  objectFit: 'cover', objectPosition: 'top', display: 'block',
                }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '12px 16px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>N.B.H. Kulkarni</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>Founder & Visionary</div>
              </div>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(to right, #C8963E, #7B5EA7)',
              }} />
            </div>
          </div>

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