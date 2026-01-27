import {
  GraduationCap,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
} from "lucide-react";

const footerLinks = {
  platform: ["About Us", "Features", "Events", "News"],
  community: ["Alumni Directory", "Job Board", "Mentorship", "Giving"],
  support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"],
};

const socialIcons = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Instagram, label: "Instagram" },
];

const Footer = () => {
  return (
    <footer className="bg-[#142A5D] text-[#FFF8E6] w-full">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#EBAB09] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold">AlumniHub</span>
            </div>

            <p className="text-[#FFF8E6]/80 max-w-sm mb-6">
              Connecting graduates worldwide. Build meaningful relationships,
              advance your career, and give back to your alma mater.
            </p>

            <div className="flex gap-4">
              {socialIcons.map(({ Icon, label }) => (
                <a
                  key={label}
                  aria-label={label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#EBAB09] transition"
                >
                  <Icon className="w-5 h-5 text-[#EBAB09] hover:text-black" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold mb-4 capitalize">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#FFF8E6]/70 hover:text-[#EBAB09] transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div>
            <h4 className="font-semibold mb-1">Stay Updated</h4>
            <p className="text-sm text-[#FFF8E6]/70">
              Get the latest news and events delivered to your inbox.
            </p>
          </div>

          <form className="flex gap-2 w-full md:w-auto max-w-md">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#EBAB09]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#EBAB09] text-black font-semibold hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          © 2024 AlumniHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
