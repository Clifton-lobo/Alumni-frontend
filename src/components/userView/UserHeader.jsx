import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { UserNavItems } from "../../config";

const BRAND_BLUE = "#142A5D";
const BRAND_GOLD = "#F2A20A";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseText = isScrolled
    ? "text-slate-700"
    : "text-white/90";

  const hoverText = "hover:text-[#EBAB09]";

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* BACKGROUND */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-slate-200/80 backdrop-blur-xl shadow-md"
            : "bg-[#142A5D]/70 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto h-[72px] px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/user/home" className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isScrolled ? "bg-[#142A5D]" : "bg-white/10"
              }`}
            >
              <span className="text-white font-bold text-lg">🎓</span>
            </div>
            <span
              className={`text-xl font-bold transition-colors ${
                isScrolled ? "text-[#142A5D]" : "text-white"
              }`}
            >
              Vpm R.Z. shah college
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 relative">
            {UserNavItems.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`relative font-medium transition-colors ${baseText} ${hoverText}`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#EBAB09]" />
                  )}
                </Link>
              ) : (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 font-medium transition-colors ${baseText} ${hoverText}`}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* hover buffer */}
                  <div className="absolute top-full left-0 h-4 w-full" />

                  {/* dropdown */}
                  <AnimatePresence>
                    {openDropdown === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-3 bg-white rounded-md shadow-xl min-w-[190px] overflow-hidden"
                      >
                        {item.items.map((child, idx) => (
                          <Link
                            key={idx}
                            to={child.path}
                            className="block px-4 py-3 text-sm  hover:bg-[#F2A20A] hover:text-white transition"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}

            {/* AUTH */}
            <button
              onClick={() => navigate("/auth")}
              className={`px-5 py-2 rounded-full font-medium transition ${
                isScrolled
                  ? "border border-slate-400 text-slate-800"
                  : "border border-white/40 text-white"
              } hover:border-[#EBAB09] hover:text-[#EBAB09]`}
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="px-6 py-2 rounded-full font-semibold text-black transition hover:opacity-90"
              style={{ backgroundColor: BRAND_GOLD }}
            >
              Join Now
            </button>
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden transition ${
              isScrolled ? "text-slate-900" : "text-white"
            }`}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        <div className="h-px bg-black/5" />
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#142A5D]/95 backdrop-blur-xl"
          >
            <div className="px-6 py-6 space-y-4">
              {UserNavItems.map((item) =>
                item.type === "link" ? (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="block text-lg text-white hover:text-[#EBAB09]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div key={item.id}>
                    <p className="text-white font-semibold mb-2">
                      {item.label}
                    </p>
                    {item.items.map((child, idx) => (
                      <Link
                        key={idx}
                        to={child.path}
                        onClick={() => setMobileOpen(false)}
                        className="block ml-3 py-1 text-white/80 hover:text-[#EBAB09]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )
              )}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/auth");
                }}
                className="w-full mt-4 px-6 py-3 rounded-xl font-semibold text-black"
                style={{ backgroundColor: BRAND_GOLD }}
              >
                Join Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
