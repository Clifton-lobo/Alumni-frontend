import React from "react";
import NBHKulkarniImage from "../../../assets/Ai_NBH_KULKARNI.png";

 
const AboutFounder = () => {
  return (
    <div className="w-full">

      {/* ===== HERO SECTION (FOUNDER) ===== */}
      <section className="relative w-full min-h-[85vh] flex items-center bg-[#020617] overflow-hidden">

        {/* NAVY GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#0f172a]/90 to-[#1e3a8a]/40 z-10"></div>

        {/* CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto w-full grid md:grid-cols-2 items-center px-6">

          {/* LEFT TEXT */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Leadership Rooted <br />
              In Vision & Legacy
            </h1>

            <p className="text-lg text-gray-300 max-w-md leading-relaxed">
              A lifetime dedicated to building strong foundations, empowering
              generations, and shaping a legacy defined by discipline,
              innovation, and long-term impact.
            </p>

            <a
              href="https://www.csp.indica.in/nbh-kulkarni-the-man-who-nurtured-indo-israeli-ties-from-its-infancy/"
              className="inline-block bg-[#1e3a8a] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#1e40af] transition"
            >
              View News
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center md:justify-end mt-10 md:mt-0">
            <img
              src={NBHKulkarniImage}
              alt="Founder"
              className="h-[520px] object-contain relative z-20 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* BOTTOM FADE */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent z-20"></div>
      </section>

      {/* ===== SONS SECTION ===== */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">
            Carrying the Legacy Forward
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Building upon a strong foundation, the next generation continues to
            drive innovation, leadership, and sustainable growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">

          {/* SON 1 */}
          <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-xl transition duration-300">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-32 h-32 rounded-full mx-auto mb-5 object-cover ring-4 ring-[#1e3a8a]/20"
              alt="Son 1"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              Son 1
            </h3>
            <p className="text-gray-600 mt-3 leading-relaxed">
              Spearheading strategic initiatives and digital transformation,
              bringing a forward-thinking approach to modernize operations and
              expand the organization’s reach.
            </p>
          </div>

          {/* SON 2 */}
          <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-xl transition duration-300">
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              className="w-32 h-32 rounded-full mx-auto mb-5 object-cover ring-4 ring-[#1e3a8a]/20"
              alt="Son 2"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              Son 2
            </h3>
            <p className="text-gray-600 mt-3 leading-relaxed">
              Focused on operational excellence and long-term sustainability,
              ensuring that the organization continues to grow while maintaining
              its core values and standards.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutFounder;