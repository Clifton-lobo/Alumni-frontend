import React from "react";
import NBHKulkarniImage from "../../../assets/nbh_kulkarniNewImage.jpg";
import son1 from "../../../assets/shreRamKULKARNI.jpg";
import son2 from "../../../assets/shrikrishna.jpg";
import indoIsraelBg from "../../../assets/handshakeIndoandIsrael.jpg";

const AboutFounder = () => {
  return (
    <div className="w-full bg-white">
      {/* ================= HERO / FOUNDER ================= */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* BACKGROUND IMAGE (MAIN VISUAL) */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-90"
          style={{
            backgroundImage: `url(${indoIsraelBg})`,
          }}
        />

        {/* SOFT DARK OVERLAY (NOT BLUE) */}

        {/* LIGHT GRADIENT FOR TEXT READABILITY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        <div className="relative z-10 max-w-8xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10">
          {/* LEFT CONTENT */}
          <div className="text-white space-y-6 order-2 md:order-1">
            {" "}
            <p className="uppercase tracking-widest text-sm text-gray-300">
              Founder & Visionary
            </p>
            <h1 className="text-5xl md:text-5xl font-bold leading-tight">
              Late.Shri N. B. H. Kulkarni
            </h1>
            <p className="text-xl text-gray-200 font-medium">
              The Man Who Nurtured Indo–Israeli Ties
            </p>
            <p className="text-gray-300 leading-relaxed max-w-lg">
              A pioneering force in building early diplomatic and industrial
              bridges between India and Israel, shaping collaborations that
              continue to influence innovation, agriculture, and technology
              partnerships today.
            </p>
            {/* NEWS PREVIEW CARD */}
            <div className="bg-white text-gray-900 p-5 rounded-xl max-w-md shadow-xl border border-gray-200 hover:shadow-2xl transition">
              <p className="text-sm text-gray-500 mb-1">Featured Article</p>
              <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                {" "}
                NBH Kulkarni: The Man Who Nurtured Indo-Israeli Ties from Its
                Infancy
              </h3>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {" "}
                A deep dive into the visionary contributions that helped shape
                one of the most important international partnerships.
              </p>

              <a
                href="https://www.csp.indica.in/nbh-kulkarni-the-man-who-nurtured-indo-israeli-ties-from-its-infancy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-black font-semibold hover:underline"
              >
                Read Full Article →
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            {" "}
            <img
              src={NBHKulkarniImage}
              alt="NBH Kulkarni"
              className="h-[350px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>

        {/* BOTTOM FADE */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ================= SONS (TIMELINE STYLE) ================= */}
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
            {/* ===== SON 1 ===== */}
            <div className="group bg-white rounded-3xl p-12 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition duration-500">
              <div className="flex flex-col items-center text-center">
                <img
                  src={son1}
                  alt="SriRam Kulkarni"
                  className="w-44 h-44 rounded-full object-cover mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                />

                <h3
                  style={{ fontFamily: "serif" }}
                  className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-wide"
                >
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

            {/* ===== SON 2 ===== */}
            <div className="group bg-white rounded-3xl p-12 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition duration-500">
              <div className="flex flex-col items-center text-center">
                <img
                  src={son2} // ✅ FIXED (use imported image)
                  alt="SriKrishna Kulkarni"
                  className="w-44 h-44 rounded-full object-cover object-top mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                />

                <h3
                  style={{ fontFamily: "serif" }}
                  className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-wide"
                >
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
