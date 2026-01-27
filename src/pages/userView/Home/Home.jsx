import { useState, useEffect, useRef } from "react";
import { Clock, Tag, ArrowRight, Users2, Users, Calendar, Award, MapPin } from "lucide-react";
import exploreOnMap from "../../../assets/exploreOnMap.png";
import { FloatingDockHelper } from "./FloatingDock";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "50K+", label: "Alumni Worldwide" },
  { icon: Calendar, value: "200+", label: "Events Yearly" },
  { icon: Award, value: "95%", label: "Career Success" },
];

const events = [
  {
    id: 1,
    title: "Annual Alumni Gala 2024",
    date: "March 15, 2024",
    location: "Grand Ballroom, NYC",
    attendees: 500,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Tech Industry Meetup",
    date: "February 20, 2024",
    location: "Silicon Valley, CA",
    attendees: 150,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "Career Development Workshop",
    date: "January 28, 2024",
    location: "Virtual Event",
    attendees: 300,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop",
    featured: false,
  },
];

const news = [
  {
    id: 1,
    title: "Alumni Association Launches New Mentorship Program",
    excerpt: "Connect with industry leaders for personalized career guidance and professional development.",
    category: "Programs",
    date: "Jan 15, 2024",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Record-Breaking Fundraiser Raises $5M for Scholarships",
    excerpt: "Thanks to generous alumni contributions, more students than ever will receive financial support.",
    category: "Giving",
    date: "Jan 10, 2024",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Class of 2013 Celebrates 10-Year Reunion",
    excerpt: "Over 300 alumni returned to campus for a memorable weekend of reconnection and celebration.",
    category: "Reunions",
    date: "Jan 5, 2024",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop",
  },
];

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
    title: "Alumni Meetup",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    title: "Campus Event",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800",
    title: "Networking Night",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    title: "Guest Lecture",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
    title: "Annual Gathering",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop",
    title: "Workshop",
  },
];


// Lightweight intersection observer hook
const useIntersection = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

const Home = () => {
  const [heroRef, heroVisible] = useIntersection(0.1);
  const [eventsRef, eventsVisible] = useIntersection(0.1);
  const [newsRef, newsVisible] = useIntersection(0.1);
  const [donationRef, donationVisible] = useIntersection(0.1);

  const galleryRef = useRef(null);
  const [galleryVisible, setGalleryVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setGalleryVisible(true),
      { threshold: 0.2 }
    );

    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-[#142A5D]"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#EBAB09]/10 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        </div>

        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Heading */}
            <h1
              className={`font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              Connect. Inspire.{" "}
              <span className="text-[#EBAB09]">Succeed Together.</span>
            </h1>

            {/* Description */}
            <p
              className={`text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              Join our thriving community of graduates making an impact worldwide.
              Network, share opportunities, and grow your career with fellow alumni.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <button className="px-8 py-4 rounded-xl bg-[#EBAB09] text-black font-semibold flex items-center gap-2 justify-center hover:opacity-90 transition">
                Explore Alumni
                <ArrowRight className="w-5 h-5" />
              </button>

              <button className="px-8 py-4 rounded-xl border border-[#EBAB09] text-[#EBAB09] font-semibold hover:bg-[#EBAB09] hover:text-black transition">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-white/10 backdrop-blur p-6 rounded-2xl transition-all duration-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <stat.icon className="w-8 h-8 text-[#EBAB09] mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" ref={eventsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div
            className={`flex flex-col md:flex-row md:items-end md:justify-between mb-14 transition-all duration-700 ${eventsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <div>
              <span className="text-[#EBAB09] font-semibold text-sm uppercase tracking-wider">
                Upcoming Events
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#142A5D] mt-2">
                Connect in Person
              </h2>
            </div>

            <button className="mt-4 md:mt-0 px-6 py-3 rounded-lg border border-[#142A5D] text-[#142A5D] font-medium hover:bg-[#142A5D] hover:text-white transition">
              View All Events
              <ArrowRight className="inline w-4 h-4 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Event */}
            <div
              className={`lg:row-span-2 relative rounded-3xl overflow-hidden shadow-xl transition-all duration-700 delay-100 ${eventsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
            >
              <img
                src={events[0].image}
                alt={events[0].title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#142A5D]/95 via-[#142A5D]/70 to-transparent" />

              <div className="relative min-h-[520px] p-10 flex flex-col justify-end">
                <span className="inline-block px-4 py-1 rounded-full bg-[#EBAB09] text-black text-sm font-semibold w-fit mb-4">
                  Featured Event
                </span>

                <h3 className="font-serif text-3xl font-bold text-white mb-4">
                  {events[0].title}
                </h3>

                <div className="flex flex-wrap gap-5 text-white/80 mb-6 text-sm">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {events[0].date}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {events[0].location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {events[0].attendees} attending
                  </span>
                </div>

                <button className="w-fit px-8 py-4 rounded-xl bg-[#EBAB09] text-black font-semibold hover:opacity-90 transition">
                  Register Now
                </button>
              </div>
            </div>

            {/* Other Events */}
            {events.slice(1).map((event, index) => (
              <div
                key={event.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 ${eventsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 h-40 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <h3 className="font-serif text-lg font-bold text-[#142A5D] mb-3">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-slate-600 text-sm mb-4">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#EBAB09]" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#EBAB09]" />
                        {event.location}
                      </span>
                    </div>

                    <button className="px-4 py-2 rounded-lg border border-[#142A5D] text-[#142A5D] text-sm font-medium hover:bg-[#142A5D] hover:text-white transition">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORIES / NEWS SECTION */}
      <section id="news" ref={newsRef} className="py-24 bg-[#F4F6FA]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div
            className={`flex flex-col md:flex-row md:items-end md:justify-between mb-14 transition-all duration-1000 ${newsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <div>
              <span className="text-[#EBAB09] font-semibold text-sm uppercase tracking-wider">
                Latest Updates
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#142A5D] mt-2">
                News & Stories
              </h2>
            </div>

            <button className="mt-4 md:mt-0 px-6 py-3 rounded-lg border border-[#142A5D] text-[#142A5D] font-medium hover:bg-[#142A5D] hover:text-white transition">
              All News
              <ArrowRight className="inline w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <article
                key={article.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-700 cursor-pointer ${newsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${100 + index * 100}ms` }}
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <span className="flex items-center gap-1 text-[#EBAB09] font-medium">
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {article.date}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#142A5D] mb-2 group-hover:text-[#EBAB09] transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>

                  <span className="inline-flex items-center text-[#EBAB09] font-medium text-sm group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </article>
            ))}
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
                loading="lazy"
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

      {/* DONATION / GIVING BACK SECTION */}
      <section
        id="donation"
        ref={donationRef}
        className="relative py-28 bg-[#142A5D] overflow-hidden"
      >
        {/* Background accents */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#EBAB09]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div
              className={`transition-all duration-700 ${donationVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
            >
              <span className="inline-block mb-4 text-[#EBAB09] font-semibold uppercase tracking-wider text-sm">
                Giving Back
              </span>

              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                Support the Next <br /> Generation of Alumni
              </h2>

              <p className="text-white/80 text-lg max-w-xl mb-10">
                Your contribution helps fund scholarships, mentorship programs,
                campus initiatives, and student opportunities that shape future
                leaders of our institution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 rounded-xl bg-[#EBAB09] text-black font-semibold text-lg hover:opacity-90 transition">
                  Donate Now
                </button>

                <button className="px-8 py-4 rounded-xl border border-white/40 text-white font-semibold text-lg hover:border-[#EBAB09] hover:text-[#EBAB09] transition">
                  Learn How Funds Are Used
                </button>
              </div>
            </div>

            {/* RIGHT STATS / IMPACT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { value: "₹2.4Cr+", label: "Funds Raised" },
                { value: "1,200+", label: "Students Supported" },
                { value: "350+", label: "Active Donors" },
                { value: "25+", label: "Annual Initiatives" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 transition-all duration-700 ${donationVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                  style={{ transitionDelay: `${100 + idx * 100}ms` }}
                >
                  <div className="text-3xl font-bold text-[#EBAB09] mb-2">
                    {item.value}
                  </div>
                  <div className="text-white/80 text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section
        id="gallery"
        ref={galleryRef}
        className="py-24 bg-[#F4F6FA]"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div
            className={`mb-14 transition-all duration-1000 ${galleryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <span className="text-[#EBAB09] font-semibold text-sm uppercase tracking-wider">
              Memories
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#142A5D] mt-2">
              Alumni Gallery
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, index) => (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-1000 ${galleryVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <span className="text-white font-semibold p-4">
                    {img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
<section className="w-full mt10">
  <img
    src={exploreOnMap}
    alt="Explore on Map"
    loading="lazy"
    className="w-full h-auto block"
  />
</section>

    </div>
  );
};

export default Home;