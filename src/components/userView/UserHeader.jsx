import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, UserRound, Bell, MessageSquare } from "lucide-react";
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

const BRAND_BLUE = "#142A5D";
const BRAND_GOLD = "#F2A20A";

/* ─── Icon button with optional badge ─── */
const IconButton = ({ icon: Icon, count, onClick, isBlue, label }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`relative cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-all
      ${isBlue
        ? "bg-white/10 text-white hover:bg-white/20"
        : "bg-blue-950/10 text-[#142A5D] hover:bg-slate-100"
      }`}
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
const UserAvatar = ({ user, isScrolled }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUserProfile());
    dispatch(logoutUser());
    setDropdownOpen(false);
  };

  return (
    <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
      <button
        className={`w-10 h-10 cursor-pointer rounded-full flex items-center justify-center font-bold transition-all
          ${isScrolled ? "bg-[#142A5D] text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
      >
        {user?.username?.[0]?.toUpperCase() || "U"}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 bg-white rounded-md shadow-xl min-w-[200px] overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => { navigate("/user/profile"); setDropdownOpen(false); }}
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isRequestsDialogOpen, incomingRequests } = useSelector((state) => state.connections);
  const pendingCount = incomingRequests.length;

  // Total unread messages count from message slice
  const conversations = useSelector((state) => state.messages?.conversations || []);
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchIncomingRequests());
  }, [isAuthenticated, dispatch]);

  const isBlue = !isScrolled;
  const headerBg = isBlue ? "bg-[#142A5D]" : "bg-white shadow-md";
  const baseText = isBlue ? "text-white/90" : "text-slate-800";

  const handleChatClick = () => navigate("/user/messages");

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className={`transition-all duration-300 ${headerBg}`}>
          <div className="max-w-7xl mx-auto h-[72px] px-4 flex items-center">

            {/* LOGO */}
            <div className="flex flex-1 items-center">
              <Link to="/user/home" className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBlue ? "bg-white/10" : "bg-[#142A5D]"}`}>
                  <span className="text-white font-bold text-lg">🎓</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl md:text-xl font-serif font-semibold tracking-wide ${isBlue ? "text-white" : "text-[#142A5D]"}`}>
                    VPM's
                  </span>
                  <span className={`text-xl md:text-xl font-serif font-semibold tracking-wide ${isBlue ? "text-white/85" : "text-[#142A5D]/85"}`}>
                    R.Z. Shah College
                  </span>
                </div>
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
              {UserNavItems.map((item) =>
                item.type === "link" ? (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`relative font-medium transition-colors ${baseText} hover:text-[#EBAB09]`}
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
                    <button className={`flex items-center gap-1 font-medium ${baseText} hover:text-[#EBAB09]`}>
                      {item.label} <ChevronDown className="h-4 w-4" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-3 bg-white rounded-md shadow-xl min-w-[190px] overflow-hidden z-50"
                        >
                          {item.items.map((child, idx) => (
                            <Link
                              key={idx}
                              to={child.path}
                              className="block px-4 py-3 text-sm hover:bg-[#F2A20A] hover:text-white transition"
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
            </nav>

            {/* RIGHT — Bell + Chat + Avatar */}
            <div className="hidden md:flex flex-1 items-center justify-end gap-2">
              {isAuthenticated && (
                <>
                  {/* 🔔 Connection requests bell */}
                  <IconButton
                    icon={Bell}
                    count={pendingCount}
                    onClick={() => dispatch(openRequestsDialog())}
                    isBlue={isBlue}
                    label="Connection requests"
                  />

                  {/* 💬 Messages icon */}
                  <IconButton
                    icon={MessageSquare}
                    count={unreadMessages}
                    onClick={handleChatClick}
                    isBlue={isBlue}
                    label="Messages"
                  />

                  {/* Avatar */}
                  <UserAvatar user={user} isScrolled={!isBlue} />
                </>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`md:hidden ${isBlue ? "text-white" : "text-slate-900"}`}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-[#142A5D]"
            >
              <div className="px-6 py-6 space-y-4">
                {isAuthenticated && (
                  <div className="pb-4 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user?.username}</p>
                          <p className="text-white/60 text-sm">{user?.email}</p>
                        </div>
                      </div>

                      {/* Mobile icons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setMobileOpen(false); dispatch(openRequestsDialog()); }}
                          className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
                        >
                          <Bell className="w-4 h-4" />
                          {pendingCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-[#F2A20A] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                              {pendingCount > 9 ? "9+" : pendingCount}
                            </span>
                          )}
                        </button>

                        {/* 💬 Mobile chat icon */}
                        <button
                          onClick={() => { setMobileOpen(false); navigate("/user/messages"); }}
                          className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {unreadMessages > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-[#F2A20A] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                              {unreadMessages > 9 ? "9+" : unreadMessages}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {UserNavItems.map((item) =>
                  item.type === "link" ? (
                    <Link key={item.id} to={item.path} onClick={() => setMobileOpen(false)}
                      className="block text-lg text-white hover:text-[#EBAB09]">
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.id}>
                      <p className="text-white font-semibold mb-2">{item.label}</p>
                      {item.items.map((child, idx) => (
                        <Link key={idx} to={child.path} onClick={() => setMobileOpen(false)}
                          className="block ml-3 py-1 text-white/80 hover:text-[#EBAB09]">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )
                )}

                {isAuthenticated && (
                  <>
                    <button onClick={() => { setMobileOpen(false); navigate("/user/profile"); }}
                      className="w-full mt-4 px-6 py-3 rounded-xl font-semibold text-white border border-white/40 hover:bg-white/10">
                      Account
                    </button>
                    <button onClick={() => { setMobileOpen(false); dispatch(clearUserProfile()); dispatch(logoutUser()); }}
                      className="w-full px-6 py-3 rounded-xl font-semibold text-black"
                      style={{ backgroundColor: BRAND_GOLD }}>
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* CONNECTION REQUESTS DIALOG */}
      <FetchConnection
        open={isRequestsDialogOpen}
        onClose={() => dispatch(closeRequestsDialog())}
      />
    </>
  );
};

export default Navbar;  