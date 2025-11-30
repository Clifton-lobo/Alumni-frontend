import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { Button } from "@/components/ui/button";
import { ArrowRight, Users2 } from "lucide-react";
import vpmimage from "../../../assets/GeminiVpmCollege.png";
import eventImage from "../../../assets/EventImage2.jpg";
import exploreOnMap from "../../../assets/exploreOnMap.png";
import { FloatingDockHelper } from "./FloatingDock";

const Home = () => {
  // AOS only for hero section
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
    });
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 brightness-110"
          style={{
            backgroundImage: `linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.4) 0%,
              rgba(0, 0, 0, 0.55) 100%
            ), url(${vpmimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-black/50 backdrop-brightness-75"></div>

        <div className="container relative z-10 px-4 md:px-6 py-20 mx-auto">
          <div
            className="max-w-4xl mx-auto text-center rounded-3xl p-10"
            data-aos="fade-up"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 bg-clip-text text-transparent animate-shine">
                AlumniAssociation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto font-light">
              Stay connected with your alma mater, network with fellow alumni,
              and contribute to the legacy of excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 text-white shadow-blue-800/40 shadow-lg hover:scale-[1.05] transition-all duration-300"
              >
                Join the Network
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="w-full bg-white py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-neutral-900">
          What’s Coming Up?
        </h1>

        <p className="text-lg md:text-xl text-center text-neutral-600 mt-3 mb-16">
          Don’t Miss These Alumni Moments
        </p>

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img
              src={eventImage}
              className="w-full h-[380px] md:h-[360px] object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-snug">
              Discover Our Alumni Events
            </h2>

            <p className="text-lg text-neutral-700 mt-4 leading-relaxed">
              Stay connected with the energy of our alumni community through a
              diverse lineup of events hosted throughout the year.
            </p>

            <Button className="mt-6 bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-6 py-3 text-base rounded-lg shadow hover:shadow-lg transition-all">
              Explore Events
            </Button>
          </div>
        </div>
      </section>

      {/* STORIES SECTION */}
      <section className="w-full mt-10 py-10">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-neutral-900">
            Stories
          </h2>

          <p className="text-lg md:text-xl text-center text-neutral-600 mt-3 mb-14">
            News, views, and perspectives from our alumni community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* CARD 1 */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all bg-white">
              <img
                src="https://images.unsplash.com/photo-1481437642641-2f0ae875f836"
                alt="Story"
                className="w-full h-50 object-cover transition-transform duration-500 ease-out hover:scale-110"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-neutral-900 leading-snug hover:underline cursor-pointer">
                  Alumni Leader Honored for Exceptional Contributions
                </h3>
                <p className="text-sm text-neutral-500 mt-1 italic">
                  from Alumni Affairs
                </p>
                <p className="text-neutral-700 mt-4 text-base leading-relaxed">
                  A distinguished member of our alumni community was recognized
                  for outstanding leadership.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all bg-white">
              <img
                src="https://images.unsplash.com/photo-1481437642641-2f0ae875f836"
                alt="Story 1"
                className="w-full h-50 object-cover transition-transform duration-500 ease-out hover:scale-110"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-neutral-900 leading-snug hover:underline cursor-pointer">
                  Alumni Leader Honored for Exceptional Contributions
                </h3>
                <p className="text-sm text-neutral-500 mt-1 italic">
                  from Alumni Affairs
                </p>
                <p className="text-neutral-700 mt-4 text-base leading-relaxed">
                  A distinguished member of our alumni community was recognized
                  for outstanding leadership.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all bg-white">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                alt="Story 3"
                className="w-full h-50 object-cover transition-transform duration-500 ease-out hover:scale-110"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-neutral-900 leading-snug hover:underline cursor-pointer">
                  Alumni Startup Achieves Milestone in Tech Innovation
                </h3>
                <p className="text-sm text-neutral-500 mt-1 italic">
                  from Entrepreneurship Desk
                </p>
                <p className="text-neutral-700 mt-4 text-base leading-relaxed">
                  A distinguished member of our alumni community was recognized
                  for outstanding leadership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER SECTION */}
      <section className="py-16 mt-5 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900">
            Unlock Your Career Potential
          </h1>
          <p className="text-neutral-600 text-lg md:text-xl mt-2 leading-relaxed">
            From internships to full-time roles, discover opportunities designed
            for our alumni community.
            <br /> Take the next step toward shaping your future.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="border border-neutral-300 rounded-lg p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Image */}
            <div className="w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=650&auto=format"
                alt="Career Opportunities"
                className="w-full h-[260px] md:h-[320px] object-cover rounded-md"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900">
                Career Opportunities
              </h2>

              <p className="text-neutral-600 mt-3 text-lg leading-relaxed">
                Explore job openings, internships, and mentorship resources to
                help you grow professionally and connect with alumni in top
                industries.
              </p>

              <a
                href="/jobs"
                className="inline-block mt-6 text-red-700 font-semibold text-lg hover:underline"
              >
                Explore job listings →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section className="w-full py-20 mt-5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
            Stay Connected With Us
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 mt-3 mb-12 leading-relaxed">
            Follow our official social media channels to stay updated with
            events, alumni stories, achievements, and campus highlights.
          </p>

          {/* Social Media Icons Component */}
          <div className="flex justify-center mt-10">
            <FloatingDockHelper />
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="mt-10">
        <img src={exploreOnMap} />
      </section>
    </div>
  );
};

export default Home;
