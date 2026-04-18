import React, { useState, useEffect, useRef } from "react";
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

  // Sticky nav triggers when top bar scrolls out of view

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchIncomingRequests());
  }, [isAuthenticated, dispatch]);

  return (
    <>
      {/* ── TOP BAR — scrolls away ── */}
      <div className="bg-white borderb  border-gray-100 w-full">
        <div
          className="max-w-screen-xl mx-auto px-4 md:px-6 flex items-center justify-between gap-3
                  h-[64px] sm:h-[90px] md:h-[125px]"
        >
          {/* ── LEFT: Logo + Name ── */}
          <Link
            to="/user/home"
            className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 min-w-0"
          >
            {/* Logo */}
            <img
              src={vpmLogo}
              alt="VPM Logo"
              className="object-contain shrink-0
                   w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24"
            />

            {/* Mobile text (< sm) */}
            <div className="flex flex-col leading-tight sm:hidden">
              <span
                className="text-[12px] font-bold text-[#142A5D] uppercase leading-snug"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                VPM'S R. Z. SHAH COLLEGE
              </span>
              <span
                className="text-[17px] text-[#F2A20A]"
                style={{
                  fontFamily: "'Satisfy', cursive",
                  letterSpacing: "1px",
                }}
              >
                Alumni
              </span>
            </div>

            {/* Tablet text (sm → md) */}
            <div className="hidden sm:flex md:hidden flex-col leading-tight">
              <span
                className="text-[15px] font-bold text-[#142A5D] uppercase leading-snug"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                VPM'S R. Z. SHAH COLLEGE <br />
                OF ARTS, SCIENCE & COMMERCE
              </span>
              <span
                className="text-[16px] text-[#F2A20A]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                }}
              >
                Alumni
              </span>
            </div>

            {/* Desktop text (md+) */}
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

          {/* ── RIGHT: NAAC logo + icons + hamburger ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* NAAC logo — tablet and desktop only */}
            {/* <img
              src={naacLogo}
              alt="NAAC A Grade"
              className="hidden sm:block object-contain
                   sm:h-14 sm:w-14 md:h-24 md:w-24"
            /> */}

            {/* Auth icons — all screens */}
            {/* In the desktop right section, replace the isAuthenticated block with: */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-4">
                {/* Bell */}
                <button
                  onClick={() => dispatch(openRequestsDialog())}
                  aria-label="Connection requests"
                  className="relative cursor-pointer rounded-full flex items-center justify-center
                       transition-all text-[#142A5D] bg-gray-100 hover:bg-gray-200
                       w-8 h-8 sm:w-12 sm:h-12"
                >
                  <Bell className="w-4 h-4 sm:w-10 sm:h-7" />
                  {pendingCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-[#F2A20A]
                               text-white text-[9px] font-bold rounded-full flex items-center
                               justify-center px-0.5 leading-none"
                    >
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </button>

                {/* Messages */}
                <button
                  onClick={() => navigate("/user/messages")}
                  aria-label="Messages"
                  className="relative cursor-pointer rounded-full flex items-center justify-center
                       transition-all text-[#142A5D] bg-gray-100 hover:bg-gray-200
                       w-8 h-8 sm:w-12 sm:h-12"
                >
                  <MessageSquare className="w-4 h-4 sm:w-10 sm:h-7" />
                  {unreadMessages > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-[#F2A20A]
                               text-white text-[9px] font-bold rounded-full flex items-center
                               justify-center px-0.5 leading-none"
                    >
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </button>

                {/* Avatar — desktop only */}
                <div className="hidden md:block relative group">
                  <button
                    className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center
                     font-bold bg-[#142A5D] text-white hover:opacity-90 transition-all text-sm"
                  >
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </button>

                  {/* pt-2 acts as invisible bridge — keeps hover alive across the gap */}
                  <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-[100]">
                    <div className="bg-white rounded-md shadow-xl min-w-[200px] overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {/* Account */}
                      <button
                        onClick={() => navigate("/user/profile")}
                        className="flex items-center cursor-pointer w-full px-4 py-3 text-sm
                   text-gray-700 hover:bg-[#F2A20A] hover:text-white transition"
                      >
                        <UserRound className="w-4 h-4 mr-2" /> Account
                      </button>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          disconnectSocket();
                          dispatch(clearUserProfile());
                          dispatch(logoutUser());
                        }}
                        className="flex items-center cursor-pointer w-full px-4 py-3 text-sm
                   text-gray-700 hover:bg-[#F2A20A] hover:text-white transition"
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
                {/* Pulsing ring */}
                <span className="absolute inset-0 rounded-xl bg-[#F2A20A] animate-ping opacity-40" />
                <span className="relative">Sign In</span>
              </Link>
            )}
            {/* Hamburger — mobile & tablet only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden text-[#142A5D] w-8 h-8 flex items-center justify-center
                   rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── NAV BAR — sticky after top bar scrolls out ── */}
      <div className="w-full border-b bg-white border-gray-200 z-40 sticky top-0 shadow-lg ">
        {/* Desktop nav */}
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

        {/* Mobile nav menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-6 py-5 space-y-1">
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-gray-100 mt-2">
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

                {UserNavItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? "bg-gray-100 text-[#142A5D]"
                        : "text-slate-600 hover:bg-gray-100 hover:text-[#142A5D]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {isAuthenticated && (
                  <div className="pt-4 space-y-2 border-t border-gray-100 mt-2">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/user/profile");
                      }}
                      className="w-full px-6 py-3 rounded-xl font-semibold text-[#142A5D] border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
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
                      className="w-full px-6 py-3 rounded-xl font-semibold text-white"
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
