import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitFeedback,
  fetchMyFeedback,
  resetSubmitSuccess,
  selectMyFeedbacks,
  selectSubmitting,
  selectSubmitSuccess,
  selectFeedbackLoading,
  selectFeedbackError,
} from "../../store/user-view/UserFeedbackSlice.js";

import feedbackIllustration from "../../assets/feedback.svg";
import feedbackIllustrationNavbar from "../../assets/Customer_feedback.svg";

const TABS = [
  { value: "feature_request", label: "✦ Feature Request" },
  { value: "bug_report", label: "🐞 Bug Report" },
  { value: "user_experience", label: "✦ UX Feedback" },
  { value: "other", label: "✦ Other" },
];

const TYPE_COLORS = {
  feature_request: { bg: "bg-[#142A5D]", border: "border-[#142A5D]", text: "text-[#142A5D]", badge: "bg-[#142A5D1A] text-[#142A5D]", left: "border-l-[#142A5D]" },
  bug_report: { bg: "bg-[#c0392b]", border: "border-[#c0392b]", text: "text-[#c0392b]", badge: "bg-[#c0392b1A] text-[#c0392b]", left: "border-l-[#c0392b]" },
  user_experience: { bg: "bg-[#1a6b5a]", border: "border-[#1a6b5a]", text: "text-[#1a6b5a]", badge: "bg-[#1a6b5a1A] text-[#1a6b5a]", left: "border-l-[#1a6b5a]" },
  other: { bg: "bg-[#6c4fa0]", border: "border-[#6c4fa0]", text: "text-[#6c4fa0]", badge: "bg-[#6c4fa01A] text-[#6c4fa0]", left: "border-l-[#6c4fa0]" },
};

export default function Feedback() {
  const dispatch = useDispatch();

  const feedbacks = useSelector(selectMyFeedbacks);
  const submitting = useSelector(selectSubmitting);
  const submitSuccess = useSelector(selectSubmitSuccess);
  const loading = useSelector(selectFeedbackLoading);
  const error = useSelector(selectFeedbackError);

  const [activeTab, setActiveTab] = useState("feature_request");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [view, setView] = useState("form");
  const [formError, setFormError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { dispatch(fetchMyFeedback()); }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
      setTitle(""); setDescription(""); setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      dispatch(resetSubmitSuccess());
    }
  }, [submitSuccess, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return setFormError("Please add a title to continue.");
    if (!description.trim()) return setFormError("Please describe your feedback.");
    setFormError("");
    dispatch(submitFeedback({ type: activeTab, title, description }));
  };

  return (
    <div className=" feedback-page min-h-screen bg-gradient-to-br from-indigo-50 via-[#F5F8FF] to-blue-50 font-[Sora,DM_Sans,sans-serif] relative overflow-hidden">

      {/* Google Fonts */}
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  .feedback-page { font-family: 'Sora', 'DM Sans', sans-serif; }
  .feedback-page .tab-pill:hover:not(.tab-active) { background: #dde5f5 !important; color: #142A5D !important; }
  .feedback-page .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(20,42,93,0.35) !important; }
  .feedback-page .submit-btn:active { transform: translateY(0); }
  .feedback-page .feedback-card:hover { box-shadow: 0 8px 28px rgba(20,42,93,0.1) !important; transform: translateY(-2px); }
  .feedback-page .input-field:focus { border-color: #142A5D !important; background: #f7f9ff !important; }
  .feedback-page .success-toast { animation: slideDown 0.4s ease forwards; }
  @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
`}</style>


      {/* BG Orbs */}
      <div className="absolute -top-44 -left-44 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(20,42,93,0.08), transparent 70%)" }} />
      <div className="absolute -bottom-44 -right-44 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(66,109,200,0.09), transparent 70%)" }} />

      <div className="max-w-[1100px] mx-auto px-6 pt-12 pb-16">

        {/* ── HERO BANNER ── */}
        <div className="relative overflow-hidden rounded-3xl mb-10 px-8 py-10 md:px-12 flex items-center justify-between gap-6 flex-wrap"
          style={{ background: "linear-gradient(120deg, #142A5D 0%, #1e3e8f 60%, #2f5ac7 100%)", boxShadow: "0 12px 48px rgba(20,42,93,0.25)" }}>

          {/* decorative circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-20 -bottom-20 w-48 h-48 rounded-full bg-white/[0.04] pointer-events-none" />

          {/* Text */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/[0.12] rounded-full px-4 py-1 mb-4">
              <span className="text-blue-300 text-[11px] font-semibold tracking-widest uppercase">Your Voice Matters</span>
            </div>
            <h1 className="text-[clamp(22px,4vw,34px)] font-extrabold text-white leading-tight tracking-tight m-0">
              Share your feedback<br />
              <span className="text-blue-300 font-medium">and help us improve.</span>
            </h1>
            <p className="text-white/60 text-sm mt-2.5 mb-0">
              Every suggestion shapes the product you use every day.
            </p>
          </div>

          {/* Hero image — hidden on mobile */}
          <img
            src={feedbackIllustrationNavbar}
            alt="feedback"
            className="hidden md:block relative z-10 w-[clamp(80px,18vw,160px)]"
            style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))" }}
          />
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-7 items-start">

          {/* LEFT — Form card */}
          <div className="bg-white rounded-3xl p-7 shadow-[0_4px_32px_rgba(20,42,93,0.09)] border border-[rgba(20,42,93,0.07)]">

            {/* View toggle */}
            <div className="flex bg-indigo-50 rounded-2xl p-1 mb-6 gap-1">
              {["form", "history"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-all duration-200 font-[inherit]
                    ${view === v ? "bg-[#142A5D] text-white" : "bg-transparent text-[#6b7a99] hover:text-[#142A5D] hover:bg-indigo-100"}`}
                >
                  {v === "form" ? "Submit Feedback" : `My History (${feedbacks.length})`}
                </button>
              ))}
            </div>

            {/* ── FORM VIEW ── */}
            {view === "form" && (
              <div>
                {/* Category label */}
                <p className="text-[11px] font-bold text-[#9ba8c5] tracking-[1.1px] uppercase mb-2.5">Category</p>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {TABS.map((tab) => {
                    const c = TYPE_COLORS[tab.value];
                    const active = activeTab === tab.value;
                    return (
                      <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`tab-pill px-4 py-1.5 rounded-full text-[12px] font-semibold border-2 transition-all duration-200 font-[inherit] cursor-pointer
                          ${active ? `${c.bg} ${c.border} text-white` : "border-[#e8edf7] bg-[#f5f7ff] text-[#6b7a99]"}`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Success toast */}
                {showSuccess && (
                  <div className="success-toast flex items-center gap-2.5 bg-gradient-to-r from-emerald-100 to-green-50 border border-emerald-300 rounded-xl px-4 py-3 mb-4">
                    <span className="text-base">✅</span>
                    <p className="text-[13px] text-emerald-800 font-semibold m-0">Feedback submitted — thank you!</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-[#9ba8c5] tracking-[1.1px] uppercase mb-2">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your feedback a short title..."
                      className="input-field w-full px-4 py-3 rounded-xl border-[1.5px] border-[#e8edf7] text-[14px] text-[#1a2540] bg-[#fafbff] outline-none font-[inherit] box-border transition-all duration-200"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-5">
                    <label className="block text-[11px] font-bold text-[#9ba8c5] tracking-[1.1px] uppercase mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Describe your feedback in detail..."
                      className="input-field w-full px-4 py-3 rounded-xl border-[1.5px] border-[#e8edf7] text-[14px] text-[#1a2540] bg-[#fafbff] outline-none resize-none font-[inherit] box-border transition-all duration-200 leading-relaxed"
                    />
                  </div>

                  {/* Error */}
                  {(formError || error) && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-300 rounded-xl px-3.5 py-2.5 mb-4">
                      <span className="text-sm">⚠️</span>
                      <p className="text-[13px] text-red-700 font-medium m-0">{formError || error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="submit-btn w-full py-3.5 rounded-2xl text-white text-[15px] font-bold border-none font-[inherit] tracking-wide transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                    style={{
                      background: submitting ? "#8fa3cc" : "linear-gradient(135deg, #142A5D, #1e4baa)",
                      boxShadow: "0 4px 16px rgba(20,42,93,0.25)",
                    }}
                  >
                    {submitting ? "Submitting…" : "Submit Feedback →"}
                  </button>
                </form>
              </div>
            )}

            {/* ── HISTORY VIEW ── */}
            {view === "history" && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-[13px] text-[#9ba8c5]">Loading your feedback…</p>
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-center py-10 bg-[#f5f7ff] rounded-2xl">
                    <div className="text-4xl mb-2.5">📭</div>
                    <p className="text-[14px] text-[#9ba8c5] font-medium">No feedback submitted yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {feedbacks.map((fb) => {
                      const c = TYPE_COLORS[fb.type] || TYPE_COLORS.feature_request;
                      return (
                        <div
                          key={fb._id}
                          className={`feedback-card bg-[#fafbff] border-[1.5px] border-[#e8edf7] border-l-4 ${c.left} rounded-2xl p-4 shadow-[0_2px_10px_rgba(20,42,93,0.05)] transition-all duration-200`}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <p className="text-[14px] font-bold text-[#1a2540] m-0">{fb.title}</p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${c.badge} px-2.5 py-0.5 rounded-full whitespace-nowrap`}>
                              {fb.type?.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-[13px] text-[#6b7a99] mt-2 mb-0 leading-relaxed">{fb.description}</p>
                          <p className="text-[11px] text-[#b8c2d9] mt-2 mb-0 font-medium">
                            {new Date(fb.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — hidden on mobile, visible on lg+ */}
          <div className="hidden lg:flex flex-col gap-5">

            {/* Illustration card */}
            <div className="bg-gradient-to-br from-[#f0f5ff] to-[#e8efff] rounded-3xl p-8 text-center border border-[rgba(20,42,93,0.08)] shadow-[0_4px_24px_rgba(20,42,93,0.07)]">
              <img
                src={feedbackIllustration}
                alt="feedback"
                className="w-[clamp(140px,30vw,240px)] mb-4 mx-auto"
                style={{ filter: "drop-shadow(0 12px 28px rgba(20,42,93,0.15))" }}
              />
              <h3 className="text-[16px] font-bold text-[#142A5D] m-0 mb-1.5">We read everything.</h3>
              <p className="text-[13px] text-[#6b7a99] m-0 leading-relaxed">
                Our team reviews each submission and uses your input to prioritise what gets built next.
              </p>
            </div>

            {/* Tips card */}
            <div className="bg-white rounded-2xl p-5 border-[1.5px] border-[#e8edf7] shadow-[0_2px_12px_rgba(20,42,93,0.06)]">
              <p className="text-[11px] font-bold text-[#9ba8c5] tracking-[1.1px] uppercase m-0 mb-3">
                Tips for great feedback
              </p>
              {[
                "Be specific about what happened",
                "Describe the expected vs actual outcome",
                "Include steps to reproduce bugs",
              ].map((tip, i) => (
                <div key={i} className={`flex items-start gap-2.5 ${i < 2 ? "mb-2.5" : ""}`}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg, #142A5D, #1e4baa)" }}>
                    {i + 1}
                  </div>
                  <p className="text-[13px] text-[#4a5578] m-0 leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}