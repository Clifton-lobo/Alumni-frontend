import { Linkedin, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import vpmLogo from "../../assets/VpmLogo.png";

/* =========================
   Social Links
========================= */
const socials = [
  { icon: Instagram, href: "https://instagram.com" },
  { icon: Linkedin, href: "https://linkedin.com" },
  { icon: Youtube, href: "https://youtube.com" },
];

/* =========================
   Animation Config
========================= */
const container = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.4,   
      staggerChildren: 0.20,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const Footer = () => {
  return (
    <footer className="relative overflow-hidden text-white">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, #142A5D 0%, #1e3e8f 55%, #2f5ac7 100%)",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_40%)]" />

      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
      <div className="absolute bottom-0 left-10 w-56 h-56 rounded-full bg-white/[0.04]" />

      <div className="absolute inset-0 shadow-[inset_0_80px_120px_rgba(0,0,0,0.35)]" />

      {/* CONTENT */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-150px" }}
        className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          
          {/* BRAND */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img src={vpmLogo} className="w-28 h-28 object-contain" />

              <div>
                <p className="text-3xl lg:text-3xl font-semibold font-serif tracking-tight">
                  VPM's R.Z. SHAH COLLEGE 
                </p>
                <p className="text-xl lg:text-xl font-semibold font-serif tracking-tight">Alumni Association</p>

              </div>
            </div>

            {/* SOCIAL */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition"
                >
                  <Icon className="w-4 h-4 text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div variants={item} className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-white mb-1">
                Phone
              </p>
              <a className="text-white hover:underline">
                022-25637313
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white mb-1">
                Contact Us
              </p>
              <a className="text-white hover:underline">
                vpmdcol@yahoo.co.in
              </a>
            </div>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div variants={item} className="flex flex-col gap-3">
            <Link className="text-white/80 hover:text-[#EBAB09] underline">
              Staff Directory
            </Link>
            <Link className="text-white/80 hover:text-[#EBAB09] underline">
              FAQ
            </Link>
            <Link className="text-white/80 hover:text-[#EBAB09] underline">
              CAA Shop
            </Link>
          </motion.div>

          {/* MAP */}
          <motion.div variants={item} className="lg:col-span-2">
            <p className="text-xs uppercase tracking-wider text-white mb-3">
              Find Us
            </p>

            <div className="rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <iframe
                src="https://www.google.com/maps?q=VPM%20R.Z.%20Shah%20College&output=embed"
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
                className="w-full"
              ></iframe>
            </div>

            <a
              href="https://maps.app.goo.gl/W6s5kst64tB7RYiPA"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-sm text-[#EBAB09] hover:underline"
            >
              View on Google Maps →
            </a>
          </motion.div>

        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;