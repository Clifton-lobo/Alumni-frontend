import { useState, useEffect, useRef } from "react";
import { Clock, Tag, ArrowRight, Users2, Users, Calendar, Award, MapPin, Instagram, Twitter, Linkedin, Youtube, ExternalLink } from "lucide-react";
import exploreOnMap from "../../../assets/exploreOnMap.png";
import { FloatingDockHelper } from "./FloatingDock";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredEvents } from "../../../store/user-view/UserEventSlice";


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
  { id: 1, src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800", title: "Alumni Meetup" },
  { id: 2, src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", title: "Campus Event" },
  { id: 3, src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800", title: "Networking Night" },
  { id: 4, src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800", title: "Guest Lecture" },
  { id: 5, src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800", title: "Annual Gathering" },
  { id: 6, src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop", title: "Workshop" },
];

const socialChannels = [
  {
    id: 1,
    platform: "Instagram",
    handle: "@alumniconnect",
    followers: "28.4K",
    description: "Behind-the-scenes moments, campus life, and alumni spotlights.",
    color: "from-[#E1306C] to-[#F77737]",
    bgLight: "bg-pink-50",
    accent: "text-[#E1306C]",
    border: "border-pink-200",
    icon: Instagram,
    href: "https://instagram.com",
    preview: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    platform: "LinkedIn",
    handle: "Alumni Network",
    followers: "41.2K",
    description: "Career news, job postings, and professional milestones.",
    color: "from-[#0077B5] to-[#00A0DC]",
    bgLight: "bg-blue-50",
    accent: "text-[#0077B5]",
    border: "border-blue-200",
    icon: Linkedin,
    href: "https://linkedin.com",
    preview: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    platform: "X / Twitter",
    handle: "@alumniconnect",
    followers: "15.8K",
    description: "Live event updates, announcements, and community threads.",
    color: "from-[#14171A] to-[#657786]",
    bgLight: "bg-slate-50",
    accent: "text-[#14171A]",
    border: "border-slate-200",
    icon: Twitter,
    href: "https://twitter.com",
    preview: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    platform: "YouTube",
    handle: "Alumni Channel",
    followers: "9.1K",
    description: "Event recaps, speaker sessions, and alumni success stories.",
    color: "from-[#FF0000] to-[#FF6B6B]",
    bgLight: "bg-red-50",
    accent: "text-[#FF0000]",
    border: "border-red-200",
    icon: Youtube,
    href: "https://youtube.com",
    preview: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&auto=format&fit=crop",
  },
];

const socials = [
  { icon: Instagram, color: "hover:bg-[#E4405F]" },
  { icon: Linkedin, color: "hover:bg-[#0A66C2]" },
  { icon: Youtube, color: "hover:bg-[#FF0000]" },
];


const useIntersection = (threshold = 0.12, rootMargin = "-15% 0px -10% 0px") => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // fire once, then stop watching
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
};

const Home = () => {
  // first thing visible so we want a quick, unobstructed trigger.
  const [heroRef, heroVisible] = useIntersection(0.1, "0px");

  // when the user has scrolled them meaningfully into view.
  const [eventsRef, eventsVisible] = useIntersection(0.12, "-10% 0px -5% 0px");
  const [newsRef, newsVisible] = useIntersection(0.12, "-10% 0px -5% 0px");
  const [donationRef, donationVisible] = useIntersection(0.12, "-10% 0px -5% 0px");
  const [careerRef, careerVisible] = useIntersection(0.12, "-10% 0px -5% 0px");
  const [socialRef, socialVisible] = useIntersection(0.12, "-10% 0px -5% 0px");
  const dispatch = useDispatch();

  const { eventList, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchFilteredEvents({ filter: "upcoming", page: 1, limit: 10 }));
  }, [dispatch]);

  const featuredEvent = eventList[0] || null;
  const sideEvents = eventList.slice(1, 3);


  const galleryRef = useRef(null);
  const [galleryVisible, setGalleryVisible] = useState(false);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGalleryVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "-10% 0px -5% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      {/* HERO SECTION */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-[#142A5D]"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 sm:-top-40 -right-32 sm:-right-40 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#EBAB09]/10 blur-3xl animate-pulse" />

          <div
            className="absolute bottom-10 sm:bottom-20 -left-16 sm:-left-20 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-white/5 blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />

          {/* Keep original sizes for md+, reduce only mobile */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] md:w-[800px] md:h-[800px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[600px] md:h-[600px] rounded-full border border-white/5" />
        </div>

        <div className="container mx-auto px-4 pt-24 md:pt-15 pb-16 md:pb-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            {/* Heading (ONLY mobile changed) */}
            <h1
              className={`font-serif text-3xl sm:text-4xl md:text-7xl lg:text-[75px] font-bold text-white mb-2 leading-tight transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 md:translate-y-8"
                }`}
            >
              Connect. Inspire. <br />
              <span className="text-yellow-400">Succeed Together.</span>
            </h1>

            {/* Paragraph */}
            <p
              className={`text-sm sm:text-base md:text-lg text-white/50 mb-8 md:mb-10 max-w-2xl mx-auto px-2 md:px-0 transition-all duration-700 delay-100 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 md:translate-y-8"
                }`}
            >
              Join our thriving community of graduates making an impact worldwide.
            </p>

            {/* Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 px-2 md:px-0 transition-all duration-700 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 md:translate-y-8"
                }`}
            >
              <Link
                to="/user/community"
                className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-xl bg-[#EBAB09] text-white font-semibold flex items-center gap-2 justify-center hover:opacity-90 transition"
              >
                Explore Alumni Network
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/user/about"
                className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-xl border border-[#EBAB09] text-[#EBAB09] font-semibold hover:bg-[#EBAB09] hover:text-white transition"
              >
                About Us
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-white/10 backdrop-blur p-4 md:p-2 rounded-2xl transition-all duration-500 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 md:translate-y-8"
                    }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-[#EBAB09] mx-auto mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave (only mobile height reduced) */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-16 md:h-auto"
          >
            <path
              d="M0 80L60 70C120 60 240 50 360 45C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V80H0Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" ref={eventsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`flex flex-col md:flex-row md:items-end md:justify-between mb-14 transition-all duration-700 ${eventsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <span className="text-[#EBAB09] font-semibold text-sm uppercase tracking-wider">Upcoming Events</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#142A5D] mt-2">Connect in Person</h2>
            </div>
            <Link to="/user/events" className="mt-4 md:mt-0 px-6 py-3 rounded-lg border border-[#142A5D] text-[#142A5D] font-medium hover:bg-[#142A5D] hover:text-white transition">
              View All Events
              <ArrowRight className="inline w-4 h-4 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400 text-lg">
              Loading events...
            </div>
          ) : eventList.length === 0 ? (
            <div className="flex items-center justify-center py-24 text-slate-400 text-lg">
              No upcoming events yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* FEATURED EVENT */}
              {featuredEvent && (
                <div
                  className={`lg:row-span-2 relative rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ease-out ${eventsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{ transitionDelay: '100ms' }}
                >
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#142A5D]/95 via-[#142A5D]/70 to-transparent" />
                  <div className="relative min-h-[520px] p-10 flex flex-col justify-end">
                    <span className="inline-block px-4 py-1 rounded-full bg-[#EBAB09] text-white text-sm font-semibold w-fit mb-4">
                      Featured Event
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-white mb-4">
                      {featuredEvent.title}
                    </h3>
                    <div className="flex flex-wrap gap-5 text-white/80 mb-6 text-sm">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredEvent.date).toDateString()}
                        {featuredEvent.time && `, ${featuredEvent.time}`}
                      </span>
                      {featuredEvent.category && (
                        <span className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          {featuredEvent.category}
                        </span>
                      )}
                      {featuredEvent.isVirtual !== undefined && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {featuredEvent.isVirtual ? "Virtual Event" : "In Person"}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/user/events?eventId=${featuredEvent._id}`}
                      className="w-fit px-8 py-4 rounded-xl bg-[#EBAB09] text-white font-semibold hover:opacity-90 transition"
                    >
                      Register Now
                    </Link>

                  </div>
                </div>
              )}

              {/* SIDE EVENTS */}
              {sideEvents.map((event, index) => (
                <div
                  key={event._id || event.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 ${eventsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                  style={{ transitionDelay: `${200 + index * 150}ms` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-40 h-40 overflow-hidden shrink-0">
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
                          {new Date(event.date).toDateString()}
                          {event.time && `, ${event.time}`}
                        </span>
                        {event.category && (
                          <span className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-[#EBAB09]" />
                            {event.category}
                          </span>
                        )}
                        {event.isVirtual !== undefined && (
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#EBAB09]" />
                            {event.isVirtual ? "Virtual Event" : "In Person"}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/user/events?eventId=${event._id}`}
                        hasCalledFindRef
                        className="inline-block px-4 py-2 rounded-lg border border-[#142A5D] text-[#142A5D] text-sm font-medium hover:bg-[#142A5D] hover:text-white transition"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </section>


      {/* CAREER SECTION */}
      <section ref={careerRef} className="py-16 mt5 bgwhite">
        <div
          className={`max-w-6xl mx-auto px-6 text-center mb-10 transition-all duration-700 ${careerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#142A5D]">
            Unlock Your Career Potential
          </h1>
          <p className="text-neutral-600 text-lg md:text-xl mt-2 leading-relaxed">
            From internships to full-time roles, discover opportunities designed for our alumni community.
            <br /> Take the next step toward shaping your future.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div
            className={`border border-neutral-300 rounded-lg p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-10 items-center transition-all duration-700 ${careerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '150ms' }}
          >
            {/* Left Image */}
            <div
              className={`w-full h-full transition-all duration-700 ${careerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: '250ms' }}
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=650&auto=format"
                alt="Career Opportunities"
                className="w-full h-[260px] md:h-[320px] object-cover rounded-md"
                loading="lazy"
              />
            </div>

            {/* Right Content */}
            <div
              className={`transition-all duration-700 ${careerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: '350ms' }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900">Career Opportunities</h2>
              <p className="text-neutral-600 mt-3 text-lg leading-relaxed">
                Explore job openings, internships, and mentorship resources to help you grow professionally
                and connect with alumni in top industries.
              </p>
              <Link to="/user/jobs" className="inline-block mt-6 text-yellow-500 font-semibold text-lg hover:underline">
                Explore job listings →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section ref={socialRef} className="py-28 bg-white relative overflow-hidden">

        {/* Big decorative background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="text-[20vw] font-black text-slate-100 leading-none tracking-tighter whitespace-nowrap"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            SOCIAL
          </span>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">

          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-[#EBAB09] font-semibold text-sm uppercase tracking-widest">Stay Connected</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#142A5D] mt-2">
              Follow Our Community
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-base md:text-lg">
              Join thousands of alumni across our social channels — share moments, celebrate wins, and never miss an update.
            </p>
          </div>

          {/* Grid */}
          <div className={`grid grid-cols-12 gap-4 transition-all duration-700 ${socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '200ms' }}
          >

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-12 md:col-span-5 group relative rounded-3xl overflow-hidden cursor-pointer"
              style={{ minHeight: '420px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop"
                alt="Instagram"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#F58529]/80 via-[#DD2A7B]/70 to-[#8134AF]/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="relative p-8 flex flex-col justify-between" style={{ minHeight: '420px' }}>
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">Instagram</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
                    <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                  </div>
                </div>

                <div>
                  <div className="text-5xl font-black text-white mb-1">28.4K</div>
                  <div className="text-white/80 text-sm">followers</div>
                  <div className="mt-4 text-white/90 text-sm leading-relaxed max-w-xs">
                    Campus life, alumni spotlights & behind-the-scenes moments.
                  </div>
                  <div className="mt-4 text-white/60 text-sm font-medium">@alumniconnect</div>
                </div>
              </div>
            </a>

            {/* Right column */}
            <div className="col-span-12 md:col-span-7 flex flex-col gap-4">

              {/* LINKEDIN */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-3xl overflow-hidden bg-[#0A66C2] p-7 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute right-0 top-0 w-48 h-full opacity-10">
                  <div className="w-full h-full bg-white" style={{ clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                    </div>
                    <div>
                      <p className="text-white font-bold">LinkedIn</p>
                      <p className="text-white/60 text-xs">Alumni Network</p>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm max-w-sm">Career news, job postings & professional milestones from our community.</p>
                </div>
                <div className="relative z-10 text-right ml-6 flex-shrink-0">
                  <div className="text-4xl font-black text-white">41.2K</div>
                  <div className="text-white/60 text-xs mt-1">followers</div>
                  <div className="mt-3 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/20 transition-colors ml-auto">
                    <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                  </div>
                </div>
              </a>

              {/* X and YouTube */}
              <div className="grid grid-cols-2 gap-4 flex-1">

                {/* X / TWITTER */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-3xl overflow-hidden bg-[#0F1419] p-6 flex flex-col hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }} />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.262 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                        </svg>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 -rotate-45 transition-colors" />
                    </div>
                    <div className="mt-8">
                      <div className="text-4xl font-black text-white">15.8K</div>
                      <div className="text-white/40 text-xs mt-1">followers</div>
                      <div className="text-white/50 text-xs mt-3">Live updates & community threads.</div>
                    </div>
                  </div>
                </a>

                {/* YOUTUBE */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-3xl overflow-hidden cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop"
                    alt="YouTube"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/65 group-hover:bg-black/50 transition-colors" />
                  <div className="relative z-10 p-6 flex flex-col h-full" style={{ minHeight: '180px' }}>
                    <div className="flex items-center justify-between">
                      <Youtube className="w-7 h-5 text-[#FF0000]" />
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/70 -rotate-45 transition-colors" />
                    </div>
                    <div className="mt-auto">
                      <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                        <svg className="w-4 h-4 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="text-3xl font-black text-white">9.1K</div>
                      <div className="text-white/50 text-xs mt-0.5">subscribers</div>
                    </div>
                  </div>
                </a>

              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className={`mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100 transition-all duration-700 ${socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <p className="text-slate-400 text-sm">
              Tag us with{' '}
              <span className="text-[#142A5D] font-bold">#AlumniConnect</span>
              {' '}to get featured
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, color }, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-slate-100 ${color} group flex items-center justify-center transition-colors cursor-pointer`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              ))}

              {/* X / Twitter */}
              <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-black group flex items-center justify-center transition-colors cursor-pointer">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.262 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;