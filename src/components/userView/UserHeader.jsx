import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, UserRound, Bell, MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { UserNavItems } from "../../config";
import { logoutUser } from "../../store/authSlice/authSlice";
import { clearUserProfile } from "../../store/user-view/UserInfoSlice";
import FetchConnection from "../../pages/userView/Directory/FetchConnection";
import {
  fetchIncomingRequests,
  openRequestsDialog,
  closeRequestsDialog,
} from "../../store/user-view/ConnectionSlice";
import { disconnectSocket } from "../../../socket/socket";
import vpmLogo from "../../assets/VpmLogo.png";
import naacLogo from "../../assets/naac_logo.webp";

const BRAND_GOLD = "#F2A20A";

/* ─── Icon button with optional badge ─── */
const IconButton = ({ icon: Icon, count, onClick, label }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="relative cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-all text-[#142A5D] bg-gray-100 hover:bg-gray-200"
  >
    <Icon className="w-5 h-5" />
    {count > 0 && (
      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#F2A20A] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
        {count > 9 ? "9+" : count}
      </span>
    )}
  </button>
);

/* ─── User Avatar Dropdown ─── */
const UserAvatar = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    disconnectSocket();
    dispatch(clearUserProfile());
    dispatch(logoutUser());
    setDropdownOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <button className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center font-bold bg-[#142A5D] text-white text-sm hover:opacity-90 transition-all">
        {user?.username?.[0]?.toUpperCase() || "U"}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-xl min-w-[200px] overflow-hidden z-100"
          >
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-900">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                navigate("/user/profile");
                setDropdownOpen(false);
              }}
              className="flex items-center cursor-pointer w-full px-4 py-3 text-sm text-gray-700 hover:bg-[#F2A20A] hover:text-white transition"
            >
              <UserRound className="w-4 h-4 mr-2" /> Account
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer w-full px-4 py-3 text-sm text-gray-700 hover:bg-[#F2A20A] hover:text-white transition"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main Navbar ─── */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [winWidth, setWinWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 375,
  );

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isRequestsDialogOpen, incomingRequests } = useSelector(
    (state) => state.connections,
  );
  const pendingCount = incomingRequests.length;

  const conversations = useSelector((state) =>
    Array.isArray(state.messages?.conversations)
      ? state.messages.conversations
      : [],
  );
  const unreadMessages = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchIncomingRequests());
  }, [isAuthenticated, dispatch]);

  /*
    Logo dimensions driven by JS so we get pixel-perfect control for
    every device without relying on Tailwind's JIT generating arbitrary values.
    Desktop (≥768px) is always 140×140 — never scrolled-compact.
  */
  const isDesktop = winWidth >= 768;
  const logoW = isDesktop
    ? 140
    : winWidth >= 640
      ? 82
      : winWidth >= 375
        ? 58
        : 48;
  const logoH = isDesktop
    ? 140
    : winWidth >= 640
      ? 86
      : winWidth >= 375
        ? 62
        : 52;
  /*
    College name font size — clamp(min, preferred-vw, max)
    Scales fluidly with viewport so it never overflows even at 360px.
  */
const nameFontSize = isDesktop
  ? undefined
  : winWidth >= 640
  ? `clamp(12px, 2.2vw, 16px)`
  : `clamp(9px, 2.5vw, 13px)`;

const alumniFontSize = isDesktop
  ? undefined
  : winWidth >= 640
  ? `clamp(18px, 3.5vw, 22px)`
  : `clamp(14px, 4vw, 18px)`;

  return (
    <>
      {/* ── TOP BAR ──
          Desktop : static, scrolls away naturally
          Mobile/Tablet : sticky + shrinks on scroll
      ── */}
      <div
        className={`bg-white border-b border-gray-100 w-full
          md:static
          sticky top-0 z-50 transition-all duration-300
          ${scrolled ? "shadow-md" : ""}
        `}
      >
        <div
          className={`
            max-w-screen-xl mx-auto flex items-center justify-between
            transition-all duration-300 px-3 sm:px-4 md:px-6
            md:h-[145px] py-3 sm:h-[100px] md:h-[145px]          `}
        >
          {/* ── LEFT: Logo + Name ── */}
          <Link
            to="/user/home"
            className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink min-w-0"
            style={{ maxWidth: "calc(100% - 120px)" }}
          >
            {/* Logo */}
            <img
              src={vpmLogo}
              alt="VPM Logo"
              className="object-contain shrink-0 transition-all duration-300"
              style={{ width: logoW, height: logoH }}
            />

            {/* ── College name: Mobile + Tablet (< md) ── */}
            <div className="flex flex-col leading-tight md:hidden min-w-0 overflow-hidden">
              <span
                className="font-semibold text-[#142A5D] uppercase leading-snug tracking-wide transition-all duration-300"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: nameFontSize,
                }}
              >
                VPM'S R. Z. SHAH COLLEGE
                <br />
                OF ARTS, SCIENCE & COMMERCE
              </span>
              <span
                className="text-[#F2A20A] transition-all duration-300"
                style={{
                  fontFamily: "serif",
                  letterSpacing: "1px",
                  fontSize: alumniFontSize,
                }}
              >
                Alumni
              </span>
            </div>

            {/* ── College name: Desktop (≥ md) ── */}
            <div className="hidden md:flex items-center gap-4 whitespace-nowrap">
              <span
                className="text-[22px] lg:text-[30px] font-semibold text-[#142A5D] leading-tight uppercase tracking-wide"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                VPM'S R. Z. SHAH COLLEGE <br />
                OF ARTS, SCIENCE & COMMERCE
              </span>
              <span className="text-gray-300 text-3xl font-light">|</span>
              <span
                className="text-[30px] lg:text-[38px] text-[#F2A20A]"
                style={{
                  fontFamily: "serif",
                  letterSpacing: "1px",
                  transform: "translateY(-2px)",
                }}
              >
                Alumni
              </span>
            </div>
          </Link>

          {/* ── RIGHT: icons + hamburger ── */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-4">
                {/* Bell */}
                <button
                  onClick={() => dispatch(openRequestsDialog())}
                  aria-label="Connection requests"
                  className={`relative cursor-pointer rounded-full flex items-center justify-center
                    transition-all duration-300 text-[#142A5D] bg-gray-100 hover:bg-gray-200
                    ${
                      scrolled
                        ? "w-7 h-7"
                        : "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                    }
                  `}
                >
                  <Bell
                    className={`transition-all duration-300
                      ${scrolled ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"}
                    `}
                  />
                  {pendingCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] bg-[#F2A20A] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </button>

                {/* Messages */}
                <button
                  onClick={() => navigate("/user/messages")}
                  aria-label="Messages"
                  className={`relative cursor-pointer rounded-full flex items-center justify-center
                    transition-all duration-300 text-[#142A5D] bg-gray-100 hover:bg-gray-200
                    ${
                      scrolled
                        ? "w-7 h-7"
                        : "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                    }
                  `}
                >
                  <MessageSquare
                    className={`transition-all duration-300
                      ${scrolled ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"}
                    `}
                  />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] bg-[#F2A20A] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </button>

                {/* Avatar — desktop only */}
                <div className="hidden md:block relative group">
                  <button className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center font-bold bg-[#142A5D] text-white hover:opacity-90 transition-all text-sm">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </button>
                  <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-[100]">
                    <div className="bg-white rounded-md shadow-xl min-w-[200px] overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => navigate("/user/profile")}
                        className="flex items-center cursor-pointer w-full px-4 py-3 text-sm text-gray-700 hover:bg-[#F2A20A] hover:text-white transition"
                      >
                        <UserRound className="w-4 h-4 mr-2" /> Account
                      </button>
                      <button
                        onClick={() => {
                          disconnectSocket();
                          dispatch(clearUserProfile());
                          dispatch(logoutUser());
                        }}
                        className="flex items-center cursor-pointer w-full px-4 py-3 text-sm text-gray-700 hover:bg-[#F2A20A] hover:text-white transition"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="relative hidden md:flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white text-sm"
                style={{ backgroundColor: "#F2A20A" }}
              >
                <span className="absolute inset-0 rounded-xl bg-[#F2A20A] animate-ping opacity-40" />
                <span className="relative">Sign In</span>
              </Link>
            )}

            {/* Hamburger — mobile & tablet only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`md:hidden text-[#142A5D] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition ml-0.5
               w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                `}
            >
              {mobileOpen ? (
                <X size={scrolled ? 15 : 18} />
              ) : (
                <Menu size={scrolled ? 15 : 18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── NAV BAR ──
          Desktop : sticky (top-0), sits below the top bar after it scrolls away
          Mobile/Tablet : NOT sticky (top bar above is already sticky)
      ── */}
      <div className="w-full border-b bg-white border-gray-200 md:sticky md:top-0 md:z-40 shadow-lg">
        {/* Desktop nav — md+ */}
        <nav className="hidden md:flex max-w-screen-xl mx-auto bg-white px-6 items-center justify-center h-[52px] gap-0">
          {UserNavItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {index !== 0 && (
                <span className="w-0.5 h-4 bg-gray-300 mx-1 shrink-0" />
              )}
              <Link
                to={item.path}
                className={`relative px-7 py-1.5 rounded-md text-lg font-semibold font-sans transition-colors whitespace-nowrap ${
                  location.pathname === item.path
                    ? "text-[#142A5D]"
                    : "text-black hover:bg-gray-100 hover:text-[#142A5D]"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-[#EBAB09] rounded-full" />
                )}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        {/* Mobile / Tablet nav dropdown (< md) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                {!isAuthenticated && (
                  <div className="pb-3 border-b border-gray-100">
                    <Link
                      to="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="relative w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white overflow-hidden"
                      style={{ backgroundColor: "#F2A20A" }}
                    >
                      <span className="absolute inset-0 bg-[#F2A20A] animate-ping opacity-30 rounded-xl" />
                      <span className="relative">Sign In to Your Account</span>
                    </Link>
                  </div>
                )}

                {/*
                  Nav items grid:
                  - phones (< sm / 640px): 2 columns — fits SE, S8+, iPhone 12 Pro
                  - tablets (≥ sm / 640px): 3 columns — fits iPad Mini, iPad Air, Surface Pro
                  truncate prevents any label from stretching the cell
                */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {UserNavItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-2 py-2.5 rounded-md text-center text-sm font-medium transition-colors truncate ${
                        location.pathname === item.path
                          ? "bg-gray-100 text-[#142A5D] font-semibold"
                          : "text-slate-600 hover:bg-gray-100 hover:text-[#142A5D]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {isAuthenticated && (
                  <div className="pt-3 flex flex-row gap-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/user/profile");
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-[#142A5D] border border-gray-200 bg-gray-50 hover:bg-gray-100 transition text-sm"
                    >
                      Account
                    </button>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        disconnectSocket();
                        dispatch(clearUserProfile());
                        dispatch(logoutUser());
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white text-sm"
                      style={{ backgroundColor: BRAND_GOLD }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONNECTION REQUESTS DIALOG */}
      <FetchConnection
        open={isRequestsDialogOpen}
        onClose={() => dispatch(closeRequestsDialog())}
      />
    </>
  );
};

export default Navbar;
