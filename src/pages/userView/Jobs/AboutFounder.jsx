import React from "react";
import NBHKulkarniImage from "../../../assets/nbh_kulkarniNewImage.jpg";
import son1 from "../../../assets/shreRamKULKARNI.jpg";
import son2 from "../../../assets/shrikrishna.jpg";
import indoIsraelVD from "../../../assets/vid_flag.mp4";
import { useRef, useEffect } from "react";

const AboutFounder = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.3; // 0.5 = half speed
    }
  }, []);
  return (
    <div className="w-full bg-white">
      {/* ================= HERO / FOUNDER ================= */}
      <section className="relative min-h-[100vh] md:min-h-[90vh] overflow-hidden">
        {/* ── BACKGROUND VIDEO ── */}
        <video
          ref={videoRef}
         className="
  absolute top-0 left-0
  w-full h-full
  object-cover
"
          src={indoIsraelVD}
          autoPlay
          loop
          muted
          playsInline
        />
        {/* ── OVERLAYS ── */}
        {/* Mobile overlay */}
        <div className="absolute inset-0 bg-black/60 md:hidden" />

        {/* Desktop gradient overlay */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* ── CONTENT ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-0">
          <div className="flex flex-col md:grid md:grid-cols-2 md:items-center gap-8 md:gap-10">
            {/* ── RIGHT: Portrait image ── */}
            <div className="flex justify-center md:justify-end order-1 md:order-2 mt-15">
              <img
                src={NBHKulkarniImage}
                alt="NBH Kulkarni"
                className="
                  h-[200px]  sm:h-[260px] md:h-[380px] lg:h-[420px]
                  w-auto
                  object-contain
                  drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)]
                "
              />
            </div>

            {/* ── LEFT: Text ── */}
            <div className="text-white mt-15 space-y-4 md:space-y-6 order-2 md:order-1">
              <p className="uppercase tracking-widest text-xs sm:text-sm text-white-300">
                Founder & Visionary
              </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', 'Tenor Sans', 'Cinzel'" }} >
              Late. Shri N. B. H. Kulkarni </h1>

              {/* ── NEWS PREVIEW CARD ── */}
              <div className="bg-white text-gray-900 p-4 sm:p-5 rounded-xl max-w-md shadow-xl border border-gray-200 hover:shadow-2xl transition">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  Featured Article
                </p>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                  NBH Kulkarni: The Man Who Nurtured Indo-Israeli Ties from Its
                  Infancy
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                  A deep dive into the visionary contributions that helped shape
                  one of the most important international partnerships.
                </p>

                <a
                  href="https://www.csp.indica.in/nbh-kulkarni-the-man-who-nurtured-indo-israeli-ties-from-its-infancy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline transition"
                >
                  Read Full Article
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM FADE ── */}
        <div className="absolute bottom-0 w-full h-24 sm:h-32 md:h-40 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ================= SONS ================= */}
      <section className="pb-32 mt-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* HEADING */}
          <div className="text-center mb-20">
            <h2
              style={{ fontFamily: "serif" }}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
            >
              Carrying the Legacy Forward
            </h2>

            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
              The next generation continues to strengthen the foundation with
              innovation, leadership, and long-term vision.
            </p>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-14">
            {/* SON 1 */}
            <div className="group bg-white rounded-3xl p-12 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition duration-500">
              <div className="flex flex-col items-center text-center">
                <img
                  src={son1}
                  alt="SriRam Kulkarni"
                  className="w-44 h-44 rounded-full object-cover mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                />

                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-wide">
                  SriRam Kulkarni
                </h3>

                <p className="text-indigo-500 font-medium text-lg mt-2 tracking-wide">
                  Vice Chairman
                </p>

                <div className="w-10 h-[2px] bg-[#8B6B2E] my-4 opacity-60"></div>

                <p className="text-gray-600 mt-2 text-lg leading-relaxed max-w-md">
                  Driving strategic growth and digital transformation, bringing
                  a forward-thinking vision that expands the organization’s
                  reach while aligning with global advancements.
                </p>
              </div>
            </div>

            {/* SON 2 */}
            <div className="group bg-white rounded-3xl p-12 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition duration-500">
              <div className="flex flex-col items-center text-center">
                <img
                  src={son2}
                  alt="SriKrishna Kulkarni"
                  className="w-44 h-44 rounded-full object-cover object-top mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                />

                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-wide">
                  SriKrishna Kulkarni
                </h3>

                <p className="text-indigo-500 font-medium text-lg mt-2 tracking-wide">
                  Trustee
                </p>

                <div className="w-10 h-[2px] bg-[#8B6B2E] my-4 opacity-60"></div>

                <p className="text-gray-600 mt-2 text-lg leading-relaxed max-w-md">
                  Focused on operational excellence and sustainability, ensuring
                  that the organization continues to grow while preserving its
                  core values and long-standing legacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutFounder;
