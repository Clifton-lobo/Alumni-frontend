import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const aboutRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={aboutRef} className="bg-neutral-50 py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div
          className={`text-center mb-20 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900">
            About the College
          </h1>

          <p className="mt-6 text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            VPM’s Ramniklal Zaveribhai Shah College of Arts, Science and Commerce
            has been a center of academic excellence and student development,
            committed to empowering learners with knowledge, values, and
            opportunities for growth.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-neutral-300 ml-4">

          {/* Block 1 */}
          <div
            className={`mb-16 ml-8 transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="absolute -left-3 w-6 h-6 bg-neutral-900 rounded-full"></span>

            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
              Establishment
            </h3>

            <p className="text-neutral-700 leading-relaxed">
              The College was established in 2003 with approval from the State
              Government to operate on a <strong>permanently unaided basis</strong>.
              Affiliated with the University of Mumbai, the institution is
              conveniently located on Mithagar Road, Mulund (East), within
              walking distance of Mulund railway station on the Central line.
            </p>
          </div>

          {/* Block 2 */}
          <div
            className={`mb-16 ml-8 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="absolute -left-3 w-6 h-6 bg-neutral-900 rounded-full"></span>

            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
              Academic Growth
            </h3>

            <p className="text-neutral-700 leading-relaxed">
              Initially offering only <strong>B.Com.</strong> and{" "}
              <strong>B.Sc. (Information Technology)</strong>, the college
              expanded its academic portfolio to include programs such as
              <strong> B.Sc. (Computer Science)</strong>,
              <strong> B.Com. (Banking & Insurance)</strong>,
              <strong> B.Com. (Accounting & Finance)</strong>,
              <strong> Bachelor of Management Studies (BMS)</strong>, and
              <strong> BAMMC</strong> (formerly Bachelor of Mass Media).
            </p>
          </div>

          {/* Block 3 */}
          <div
            className={`mb-16 ml-8 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="absolute -left-3 w-6 h-6 bg-neutral-900 rounded-full"></span>

            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
              Expansion & Renaming
            </h3>

            <p className="text-neutral-700 leading-relaxed">
              In 2009, Kannada was introduced as a subject for the B.A. program.
              In the same year, the institution was renamed{" "}
              <strong>
                VPM’s Ramniklal Zaveribhai Shah College of Arts, Science and
                Commerce
              </strong>
              , reflecting its broader academic vision and commitment to
              multidisciplinary education.
            </p>
          </div>

          {/* Block 4 */}
          <div
            className={`mb-16 ml-8 transition-all duration-700 delay-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="absolute -left-3 w-6 h-6 bg-neutral-900 rounded-full"></span>

            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
              Quality & Governance
            </h3>

            <p className="text-neutral-700 leading-relaxed">
              The college operates through several committees that oversee
              academic and administrative functions. The{" "}
              <strong>Internal Quality Assurance Cell (IQAC)</strong> ensures
              continuous improvement across admissions, sports, cultural
              activities, academic results, infrastructure development,
              grievance redressal, and student counseling. The{" "}
              <strong>Local Managing Committee (LMC)</strong> supports the
              effective administration of the institution.
            </p>
          </div>

          {/* Block 5 */}
          <div
            className={`ml-8 transition-all duration-700 delay-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="absolute -left-3 w-6 h-6 bg-neutral-900 rounded-full"></span>

            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
              Scholarships & Student Support
            </h3>

            <p className="text-neutral-700 leading-relaxed">
              Since the academic year <strong>2008–09</strong>, the college has
              implemented Government of India Scholarships and Freeships for
              students belonging to SC, ST, NT, and OBC categories. From
              February 2009, the Social Welfare Department of the Government of
              Maharashtra has sanctioned additional scholarships and freeships,
              ensuring financial support reaches deserving students
              transparently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}