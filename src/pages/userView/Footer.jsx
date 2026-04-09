import {
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";

import { Link } from "react-router-dom";

import vpmLogo from "../../assets/VpmLogo.png";
import vpmClassroom from "../../assets/vpm_classroom.webp";

/* =========================
   Footer Links (Internal)
========================= */
const footerLinks = {
  platform: [
    { label: "About Us", to: "/user/about" },
    { label: "profile", to: "/user/profile" },
    { label: "Events", to: "/user/events" },
    { label: "News", to: "/user/news" },
  ],
  // community: [
  //   { label: "Alumni Directory", to: "/user/community" },
  //   { label: "Job Board", to: "/user/jobs" },
  //   { label: "Mentorship", to: "/mentorship" },
  //   { label: "Giving", to: "/user/donate" }, 
  // ],
  support: [
    { label: "Help Center", to: "/user/help" },
    { label: "Contact Us", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ],
};

/* =========================
   Social Links (External)
========================= */
const socials = [
  {
    icon: Instagram,
    href: "https://instagram.com",
    color: "hover:bg-[#E4405F]",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com",
    color: "hover:bg-[#0A66C2]",
  },
  {
    icon: Youtube,
    href: "https://youtube.com",
    color: "hover:bg-[#FF0000]",
  },
];

const Footer = () => {
  return (
    <footer className="relative text-[#FFF8E6] overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${vpmClassroom})` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20 min-h-[420px] sm:min-h-[550px] flex flex-col justify-end">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12">

          {/* Brand Section */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-4 mb-6">
              <img
                src={vpmLogo}
                alt="VPM Logo"
                className="w-12 h-12 object-contain"
              />

              <div>
                <p className="text-2xl font-serif font-semibold">
                  VPM's Alumni Association
                </p>
                <p className="text-lg font-serif text-white/70">
                  R.Z. Shah College
                </p>
              </div>
            </div>

            <p className="text-white/70 max-w-sm mb-6">
              Connecting graduates of VPM's R.Z. Shah College. Build meaningful
              relationships, explore opportunities, and stay connected with your
              alumni community.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, color, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-full bg-white/10 ${color} group flex items-center justify-center transition`}
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
                </a>
              ))}

              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-black group flex items-center justify-center transition"
              >
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-white fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.262 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Sections */}
         {/* Link Sections */}
{Object.entries(footerLinks).map(([section, links]) => (
  <div key={section} className="min-w-[180px] snap-start">

    <h4 className="font-semibold mb-4 text-xl capitalize">
      {section}
    </h4>

    <ul className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-1 gap-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            className="text-white/70 text-lg hover:text-[#EBAB09] transition"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>

  </div>
))}

        </div>
      </div>
    </footer>
  );
};

export default Footer;