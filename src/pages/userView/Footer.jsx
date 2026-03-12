import {
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react";

import vpmLogo from "../../assets/VpmLogo.png";
import vpmClassroom from "../../assets/vpm_classroom.webp";

const footerLinks = {
  platform: ["About Us", "Features", "Events", "News"],
  community: ["Alumni Directory", "Job Board", "Mentorship", "Giving"],
  support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"],
};

const socialIcons = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Instagram, label: "Instagram" },
];

const socials = [
  { icon: Instagram, color: "hover:bg-[#E4405F]" },
  { icon: Linkedin, color: "hover:bg-[#0A66C2]" },
  { icon: Youtube, color: "hover:bg-[#FF0000]" },
];


const Footer = () => {
  return (
    <footer className="relative text-[#FFF8E6] overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${vpmClassroom})` }}
      />

      {/* Stanford style bottom blur gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 via-100% to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20 min-h-[420px] sm:min-h-[550px] flex flex-col justify-end">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-4 mb-6">
              <img
                src={vpmLogo}
                alt="VPM Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />

              <div>
                <p className="text-lg font-semibold">
                  VPM Alumni Association
                </p>
                <p className="text-sm text-white/70">
                  R.Z. Shah College
                </p>
              </div>
            </div>

            <p className="text-white/70 max-w-sm mb-6">
              Connecting graduates of VPM's R.Z. Shah College. Build meaningful
              relationships, explore opportunities, and stay connected with your
              alumni community.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, color }, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full bg-white/10 ${color} group flex items-center justify-center transition-colors cursor-pointer`}
                >
                  <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              ))}

              {/* X / Twitter */}
              <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-black group flex items-center justify-center transition-colors cursor-pointer">
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.262 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold mb-4 capitalize">
                {section}
              </h4>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/70 hover:text-[#EBAB09] transition"
                    >
                      {link}
                    </a>
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