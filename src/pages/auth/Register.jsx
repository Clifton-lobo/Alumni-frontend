import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/authSlice/authSlice.js";
import { toast } from "sonner";
import { User, AtSign, GraduationCap, BookOpen, Phone, Mail, Lock, ArrowRight, Eye, EyeOff, ChevronDown } from "lucide-react";
import vpmLogo from "../../assets/VpmLogo.png";


const NAVY = "#142A5D";
const GOLD = "#EBAB09";
const STREAMS = ["CSE", "MECH", "EEE", "ECE", "CIVIL", "IT", "CHEM", "AERO", "BIOTECH", "MBA"];

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      )}
      {children}
    </div>
  </div>
);

const inputCls = (hasIcon = true) =>
  `w-full ${hasIcon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border border-gray-200 bg-gray-200 text-sm
   text-gray-900 placeholder-gray-400 outline-none transition
   focus:border-gray-400 focus:ring-2 focus:ring-gray-400`;

const Register = () => {
  const initialState = { fullname: "", username: "", batch: "", stream: "", phoneno: "", email: "", password: "" };
  const [registerData, setRegisterData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((s) => s.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const validate = () => {
    const { fullname, username, batch, stream, phoneno, email, password } = registerData;
    if (!fullname.trim()) { toast.error("Full name is required."); return false; }
    if (!username.trim()) { toast.error("Username is required."); return false; }
    if (username.trim().length < 3) { toast.error("Username must be at least 3 characters."); return false; }
    const batchNum = Number(batch);
    if (!batch || isNaN(batchNum) || batchNum < 1900 || batchNum > 2100) { toast.error("Please enter a valid graduation year (1900–2100)."); return false; }
    if (!stream || !STREAMS.includes(stream)) { toast.error("Please select your stream."); return false; }
    if (!phoneno.trim() || !/^\d{10}$/.test(phoneno.trim())) { toast.error("Phone number must be exactly 10 digits."); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { toast.error("Please enter a valid email address."); return false; }
    if (!password || password.length < 6) { toast.error("Password must be at least 6 characters."); return false; }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(registerUser(registerData))
      .unwrap()
      .then((data) => { toast.success(data.message || "Registration successful!"); navigate("/auth/login"); })
      .catch((err) => { toast.error(err || "Registration failed. Please try again."); });
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-[47%] flex-col p-12 relative overflow-hidden flex-shrink-0"
        style={{ background: NAVY }}
      >
        {/* Decorative rings */}
        <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full opacity-10"
          style={{ border: `80px solid ${GOLD}` }} />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.07]"
          style={{ border: `50px solid ${GOLD}` }} />
        <div className="absolute top-0 right-0 w-[3px] h-full" style={{ background: GOLD, opacity: 0.25 }} />

        {/* Wordmark */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center">
            <img src={vpmLogo} alt="VPM Logo" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm md:text-xl text-amber-300 tracking-widest font-semibold uppercase">
              VPM's R.Z. Shah College
            </span>
            <span className="font-serif font-bold text-white text-4xl md:text-4xl tracking-wide">
              Alumni Association
            </span>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10 mt-15">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: GOLD }}>
            Join the network
          </p>
          <h1 className="font-serif text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-6">
            Your journey<br />starts here.
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Create your alumni profile and become part of a thriving community of graduates making a difference.
          </p>

          {/* Steps */}
          <div className="mt-10 space-y-4">
            {[
              { n: "01", title: "Create your profile", desc: "Tell us about your batch and stream" },
              { n: "02", title: "Connect with alumni", desc: "Find classmates and build your network" },
              { n: "03", title: "Explore opportunities", desc: "Jobs, events, and spotlights" },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-4">
                <span className="font-serif font-black text-sm mt-0.5" style={{ color: GOLD }}>{n}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (scrollable form) ── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile hero header */}
        <div
          className="lg:hidden relative overflow-hidden px-6 pt-14 pb-10"
          style={{ background: NAVY }}
        >
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10"
            style={{ border: `50px solid ${GOLD}` }} />
          <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full opacity-[0.07]"
            style={{ border: `35px solid ${GOLD}` }} />
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: GOLD, opacity: 0.3 }} />

          <div className="relative z-10 flex items-center gap-3 mb-8">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={vpmLogo} alt="VPM Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif font-bold text-white text-xl tracking-wide">
                Alumni Association
              </span>
              <span className="text-[11px] text-amber-300 tracking-wider uppercase">
                VPM's R.Z. Shah College
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: GOLD }}>
              Join the network
            </p>
            <h1 className="font-serif text-3xl font-black text-white leading-tight mb-2">
              Your journey<br />starts here.
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Create your profile and join a thriving community of graduates making a difference.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6 mt-7 pt-5 border-t border-white/10">
            {[{ n: "01", label: "Profile" }, { n: "02", label: "Connect" }, { n: "03", label: "Explore" }].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-2">
                <span className="font-serif font-black text-sm" style={{ color: GOLD }}>{n}</span>
                <span className="text-[11px] text-white/60 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 lg:px-16 xl:px-20 py-6">
          <div className="w-full lg:mx-0">

            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: GOLD }}>
                Get started
              </p>
              <h2 className="font-serif text-3xl font-black mb-1" style={{ color: NAVY }}>
                Create your account
              </h2>
            </div>

            {/* Mobile heading */}
            <div className="lg:hidden mb-5 mt-1">
              <h2 className="font-serif text-2xl font-black" style={{ color: NAVY }}>Create account</h2>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Already have an account?{" "}
              <Link to="/auth/login"
                className="font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
                style={{ color: NAVY }}>
                Sign in here
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Row 1 — Full name + Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" icon={User}>
                  <input type="text" name="fullname" value={registerData.fullname}
                    onChange={handleChange} placeholder="Jane Smith"
                    className={inputCls()} />
                </Field>
                <Field label="Username" icon={AtSign}>
                  <input type="text" name="username" value={registerData.username}
                    onChange={handleChange} placeholder="janesmith"
                    className={inputCls()} />
                </Field>
              </div>

              {/* Row 2 — Batch + Stream */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Graduation Year" icon={GraduationCap}>
                  <input type="number" name="batch" value={registerData.batch}
                    onChange={handleChange} min="1900" max="2100" placeholder="2022"
                    className={inputCls()} />
                </Field>
                <Field label="Stream" icon={BookOpen}>
                  <select name="stream" value={registerData.stream} onChange={handleChange}
                    className={`${inputCls()} appearance-none pr-9 ${!registerData.stream ? "text-gray-400" : "text-gray-900"}`}>
                    <option value="" disabled className="text-gray-400">Select stream</option>
                    {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </Field>
              </div>

              {/* Row 3 — Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone Number" icon={Phone}>
                  <input type="text" name="phoneno" value={registerData.phoneno}
                    onChange={handleChange} placeholder="10-digit number" maxLength={10}
                    className={inputCls()} />
                </Field>
                <Field label="Email Address" icon={Mail}>
                  <input type="email" name="email" value={registerData.email}
                    onChange={handleChange} placeholder="you@example.com"
                    className={inputCls()} />
                </Field>
              </div>

              {/* Password */}
              <Field label="Password" icon={Lock}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={registerData.password}
                  onChange={handleChange} placeholder="Minimum 6 characters"
                  className={`${inputCls()} pr-10`} />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold
                transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-2
                disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: NAVY, color: "white" }}>
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>Create account <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 mt-6 mb-5">
              <div className="h-px flex-1 bg-gray-100" />
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              By registering you agree to our{" "}
              <span className="underline underline-offset-2 cursor-pointer hover:text-gray-600 transition-colors">Terms of Service</span>
              {" "}and{" "}
              <span className="underline underline-offset-2 cursor-pointer hover:text-gray-600 transition-colors">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;