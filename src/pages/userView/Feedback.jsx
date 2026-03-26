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
  { value: "feature_request", label: "✦ Feature Request", icon: "💡" },
  { value: "bug_report", label: "🐞 Bug Report", icon: "🐞" },
  { value: "user_experience", label: "✦ UX Feedback", icon: "🎨" },
  { value: "other", label: "✦ Other", icon: "💬" },
];

const TYPE_COLORS = {
  feature_request: "#142A5D",
  bug_report: "#c0392b",
  user_experience: "#1a6b5a",
  other: "#6c4fa0",
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

  useEffect(() => {
    dispatch(fetchMyFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
      setTitle("");
      setDescription("");
      setShowSuccess(true);
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EEF2FF 0%, #F5F8FF 50%, #EBF4FF 100%)",
        fontFamily: "'Sora', 'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .tab-pill {
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          outline: none;
        }
        .tab-pill:hover:not(.tab-active) {
          background: #dde5f5 !important;
          color: #142A5D !important;
        }
        .view-toggle:hover:not(.view-active) {
          color: #142A5D !important;
          background: #eef2ff !important;
        }
        .submit-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(20,42,93,0.35) !important;
        }
        .submit-btn:active { transform: translateY(0); }
        .feedback-card {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .feedback-card:hover {
          box-shadow: 0 8px 28px rgba(20,42,93,0.1) !important;
          transform: translateY(-2px);
        }
        .input-field:focus {
          border-color: #142A5D !important;
          background: #f7f9ff !important;
        }
        .success-toast {
          animation: slideDown 0.4s ease forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dot-pulse::after {
          content: '';
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {/* BG Orbs */}
      <div style={{
        position: "absolute", top: -180, left: -180,
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(20,42,93,0.08), transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -180, right: -180,
        width: 480, height: 480,
        background: "radial-gradient(circle, rgba(66,109,200,0.09), transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 64px" }}>

        {/* ── HERO BANNER (replaces the awkward top text) ── */}
        <div style={{
          background: "linear-gradient(120deg, #142A5D 0%, #1e3e8f 60%, #2f5ac7 100%)",
          borderRadius: 24,
          padding: "40px 48px",
          marginBottom: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          boxShadow: "0 12px 48px rgba(20,42,93,0.25)",
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* decorative circle inside banner */}
          <div style={{
            position: "absolute", right: -60, top: -60,
            width: 260, height: 260,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }} />
          <div style={{
            position: "absolute", right: 80, bottom: -80,
            width: 200, height: 200,
            background: "rgba(255,255,255,0.04)",
            borderRadius: "50%",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 100, padding: "4px 14px",
              marginBottom: 14,
            }}>
              <span style={{ color: "#93c5fd", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>
                Your Voice Matters
              </span>
            </div>
            <h1 style={{
              fontSize: "clamp(22px, 4vw, 34px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.25,
              margin: 0,
              letterSpacing: "-0.5px",
            }}>
              Share your feedback<br />
              <span style={{ color: "#93c5fd", fontWeight: 500 }}>and help us improve.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 10, margin: "10px 0 0" }}>
              Every suggestion shapes the product you use every day.
            </p>
          </div>

          <img
            src={feedbackIllustrationNavbar}
            alt="feedback"
            style={{
              width: "clamp(80px, 18vw, 160px)",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
              position: "relative", zIndex: 1,
            }}
          />
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
          gap: 28,
          alignItems: "start",
        }}>

          {/* LEFT — Form card */}
          <div style={{
            background: "#fff",
            borderRadius: 24,
            padding: "28px 28px 32px",
            boxShadow: "0 4px 32px rgba(20,42,93,0.09)",
            border: "1px solid rgba(20,42,93,0.07)",
          }}>

            {/* View toggle */}
            <div style={{
              display: "flex",
              background: "#f0f4ff",
              borderRadius: 14,
              padding: 4,
              marginBottom: 24,
              gap: 4,
            }}>
              {["form", "history"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`view-toggle ${view === v ? "view-active" : ""}`}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: view === v ? "#142A5D" : "transparent",
                    color: view === v ? "#fff" : "#6b7a99",
                    fontFamily: "inherit",
                  }}
                >
                  {v === "form" ? "Submit Feedback" : `My History (${feedbacks.length})`}
                </button>
              ))}
            </div>

            {/* FORM VIEW */}
            {view === "form" && (
              <div>
                {/* Category tabs */}
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9ba8c5", letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 10 }}>
                  Category
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                  {TABS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`tab-pill ${activeTab === tab.value ? "tab-active" : ""}`}
                      style={{
                        padding: "7px 16px",
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 600,
                        border: activeTab === tab.value
                          ? `2px solid ${TYPE_COLORS[tab.value]}`
                          : "2px solid #e8edf7",
                        background: activeTab === tab.value
                          ? TYPE_COLORS[tab.value]
                          : "#f5f7ff",
                        color: activeTab === tab.value ? "#fff" : "#6b7a99",
                        fontFamily: "inherit",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Success toast */}
                {showSuccess && (
                  <div className="success-toast" style={{
                    background: "linear-gradient(135deg, #d1fae5, #ecfdf5)",
                    border: "1px solid #6ee7b7",
                    borderRadius: 12,
                    padding: "12px 16px",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <p style={{ fontSize: 13, color: "#065f46", fontWeight: 600, margin: 0 }}>
                      Feedback submitted — thank you!
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#9ba8c5", letterSpacing: 1.1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                      Title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your feedback a short title..."
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1.5px solid #e8edf7",
                        fontSize: 14,
                        color: "#1a2540",
                        background: "#fafbff",
                        outline: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#9ba8c5", letterSpacing: 1.1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Describe your feedback in detail..."
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1.5px solid #e8edf7",
                        fontSize: 14,
                        color: "#1a2540",
                        background: "#fafbff",
                        outline: "none",
                        resize: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, background 0.2s",
                        lineHeight: 1.6,
                      }}
                    />
                  </div>

                  {/* Error */}
                  {(formError || error) && (
                    <div style={{
                      background: "#fff1f0",
                      border: "1px solid #fca5a5",
                      borderRadius: 10,
                      padding: "10px 14px",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}>
                      <span style={{ fontSize: 14 }}>⚠️</span>
                      <p style={{ fontSize: 13, color: "#b91c1c", fontWeight: 500, margin: 0 }}>
                        {formError || error}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="submit-btn"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 14,
                      background: submitting
                        ? "#8fa3cc"
                        : "linear-gradient(135deg, #142A5D, #1e4baa)",
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 700,
                      border: "none",
                      cursor: submitting ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      letterSpacing: 0.3,
                      boxShadow: "0 4px 16px rgba(20,42,93,0.25)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {submitting ? "Submitting…" : "Submit Feedback →"}
                  </button>
                </form>
              </div>
            )}

            {/* HISTORY VIEW */}
            {view === "history" && (
              <div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <div style={{ fontSize: 13, color: "#9ba8c5" }}>Loading your feedback…</div>
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "40px 0",
                    background: "#f5f7ff", borderRadius: 16,
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                    <p style={{ fontSize: 14, color: "#9ba8c5", fontWeight: 500 }}>
                      No feedback submitted yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {feedbacks.map((fb) => {
                      const color = TYPE_COLORS[fb.type] || "#142A5D";
                      return (
                        <div
                          key={fb._id}
                          className="feedback-card"
                          style={{
                            background: "#fafbff",
                            border: "1.5px solid #e8edf7",
                            borderLeft: `4px solid ${color}`,
                            borderRadius: 14,
                            padding: "16px 18px",
                            boxShadow: "0 2px 10px rgba(20,42,93,0.05)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#1a2540", margin: 0 }}>
                              {fb.title}
                            </p>
                            <span style={{
                              fontSize: 10, fontWeight: 700,
                              textTransform: "uppercase", letterSpacing: 1,
                              color, background: `${color}15`,
                              padding: "3px 10px", borderRadius: 100,
                              whiteSpace: "nowrap",
                            }}>
                              {fb.type?.replace("_", " ")}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, color: "#6b7a99", margin: "8px 0 0", lineHeight: 1.6 }}>
                            {fb.description}
                          </p>
                          <p style={{ fontSize: 11, color: "#b8c2d9", margin: "8px 0 0", fontWeight: 500 }}>
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

          {/* RIGHT — Stats / Illustration card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Illustration card */}
            <div style={{
              background: "linear-gradient(135deg, #f0f5ff, #e8efff)",
              borderRadius: 24,
              padding: "32px 28px",
              textAlign: "center",
              border: "1px solid rgba(20,42,93,0.08)",
              boxShadow: "0 4px 24px rgba(20,42,93,0.07)",
            }}>
              <img
                src={feedbackIllustration}
                alt="feedback"
                style={{
                  width: "clamp(140px, 30vw, 240px)",
                  filter: "drop-shadow(0 12px 28px rgba(20,42,93,0.15))",
                  marginBottom: 16,
                }}
              />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#142A5D", margin: "0 0 6px" }}>
                We read everything.
              </h3>
              <p style={{ fontSize: 13, color: "#6b7a99", margin: 0, lineHeight: 1.6 }}>
                Our team reviews each submission and uses your input to prioritise what gets built next.
              </p>
            </div>

            

            {/* Tips card */}
            <div style={{
              background: "#fff",
              borderRadius: 20,
              padding: "20px 22px",
              border: "1.5px solid #e8edf7",
              boxShadow: "0 2px 12px rgba(20,42,93,0.06)",
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ba8c5", letterSpacing: 1.1, textTransform: "uppercase", margin: "0 0 12px" }}>
                Tips for great feedback
              </p>
              {[
                "Be specific about what happened",
                "Describe the expected vs actual outcome",
                "Include steps to reproduce bugs",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "linear-gradient(135deg, #142A5D, #1e4baa)",
                    color: "#fff", fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 13, color: "#4a5578", margin: 0, lineHeight: 1.5 }}>{tip}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}