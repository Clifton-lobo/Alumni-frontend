import { useState, useEffect } from "react";

const stats = {
  totalAlumni: 1284,
  pendingJobs: 23,
  upcomingEvents: 7,
  pendingAlbums: 5,
  publishedNews: 42,
  totalConnections: 8920,
};

const recentJobs = [
  { _id: "1", title: "Senior Software Engineer", companyName: "Infosys", location: "Pune", workMode: "hybrid", experienceLevel: "senior", postedBy: "john_alumni", createdAt: "Jul 10" },
  { _id: "2", title: "Product Manager", companyName: "TCS", location: "Mumbai", workMode: "onsite", experienceLevel: "mid", postedBy: "priya_k", createdAt: "Jul 11" },
  { _id: "3", title: "Data Analyst Intern", companyName: "Wipro", location: "Bengaluru", workMode: "remote", experienceLevel: "entry", postedBy: "rahul_m", createdAt: "Jul 12" },
  { _id: "4", title: "UX Designer", companyName: "Accenture", location: "Hyderabad", workMode: "remote", experienceLevel: "mid", postedBy: "sneha_d", createdAt: "Jul 13" },
];

const recentEvents = [
  { _id: "1", title: "Annual Alumni Meetup 2025", date: "Aug 15", category: "meetup", isVirtual: false, registrationsCount: 134, capacity: 200, isLimited: true },
  { _id: "2", title: "Tech Talk: AI in Industry", date: "Jul 28", category: "seminar", isVirtual: true, registrationsCount: 89, capacity: null, isLimited: false },
  { _id: "3", title: "Career Guidance Workshop", date: "Sep 5", category: "workshop", isVirtual: false, registrationsCount: 12, capacity: 50, isLimited: true },
];

const recentNews = [
  { _id: "1", title: "Alumni of the Year Award 2025", category: "awards", isPublished: true, viewCount: 432, publishedAt: "Jul 1" },
  { _id: "2", title: "New Campus Infrastructure Update", category: "campus", isPublished: true, viewCount: 218, publishedAt: "Jun 28" },
  { _id: "3", title: "Placement Season 2025 Kicks Off", category: "placements", isPublished: false, viewCount: 0, publishedAt: null },
];

const pendingAlbums = [
  { _id: "1", title: "Tech Fest Photos", photoCount: 32, uploadedBy: "student_user", eventDate: "Mar 15" },
  { _id: "2", title: "Sports Day 2025", photoCount: 24, uploadedBy: "sports_coord", eventDate: "Jan 26" },
  { _id: "3", title: "Cultural Night", photoCount: 41, uploadedBy: "cultural_comm", eventDate: "Feb 10" },
  { _id: "4", title: "Freshers Welcome", photoCount: 18, uploadedBy: "coordinator_01", eventDate: "Jul 5" },
  { _id: "5", title: "Hackathon 2025", photoCount: 56, uploadedBy: "tech_club", eventDate: "Apr 22" },
];

const topAlumni = [
  { _id: "1", fullname: "Aarav Shah", batch: "2019", stream: "CE", company: "Google", jobTitle: "SDE-2" },
  { _id: "2", fullname: "Priya Mehta", batch: "2020", stream: "IT", company: "Flipkart", jobTitle: "Product Manager" },
  { _id: "3", fullname: "Rohan Desai", batch: "2018", stream: "EC", company: "Qualcomm", jobTitle: "VLSI Engineer" },
  { _id: "4", fullname: "Sneha Kulkarni", batch: "2021", stream: "CE", company: "Amazon", jobTitle: "ML Engineer" },
  { _id: "5", fullname: "Karan Joshi", batch: "2019", stream: "ME", company: "Tesla", jobTitle: "Design Engineer" },
];

const AVATAR_GRADIENTS = [
  "from-rose-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-500",
];

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  const animated = useCountUp(value, 1000 + delay);
  return (
    <div
      className="relative bg-white rounded-2xl p-5 overflow-hidden group cursor-default"
      style={{
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        animation: `fadeSlideUp 0.5s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* accent bar */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${accent} opacity-80`} />
      {/* bg glow */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${accent} opacity-5 group-hover:opacity-10 transition-opacity blur-xl`} />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${accent.replace("bg-", "bg-").replace("600", "100")} bg-opacity-10`}
          style={{ background: "rgba(0,0,0,0.04)" }}>
          {icon}
        </div>
        {sub && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full">{sub}</span>
        )}
      </div>
      <p className="text-[28px] font-black text-slate-800 tabular-nums leading-none">{animated.toLocaleString()}</p>
      <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [jobActions, setJobActions] = useState({});
  const [albumActions, setAlbumActions] = useState({});

  const handleJob = (id, action) => setJobActions(prev => ({ ...prev, [id]: action }));
  const handleAlbum = (id, action) => setAlbumActions(prev => ({ ...prev, [id]: action }));

  const workModeStyle = { remote: "#10b981", hybrid: "#3b82f6", onsite: "#8b5cf6" };
  const expStyle = { entry: "#64748b", mid: "#f59e0b", senior: "#10b981" };

  return (
    <div style={{ fontFamily: "'Sora', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "32px 28px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .card { background: #fff; border-radius: 20px; border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04); }
        .badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .hover-row:hover { background: #f8fafc; }
        .action-btn { border: none; cursor: pointer; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 8px; font-family: inherit; transition: all 0.15s; letter-spacing: 0.02em; }
        .action-btn:active { transform: scale(0.96); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32, animation: "fadeSlideUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 6, height: 32, borderRadius: 99, background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }} />
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
            Overview
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginLeft: 18 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Alumni"     value={stats.totalAlumni}     icon="👥" accent="bg-violet-500" sub="users"    delay={0} />
        <StatCard label="Pending Jobs"     value={stats.pendingJobs}     icon="💼" accent="bg-amber-400"  sub="review"   delay={60} />
        <StatCard label="Upcoming Events"  value={stats.upcomingEvents}  icon="📅" accent="bg-emerald-500" sub="active"  delay={120} />
        <StatCard label="Pending Albums"   value={stats.pendingAlbums}   icon="🖼"  accent="bg-rose-400"  sub="approval" delay={180} />
        <StatCard label="Published News"   value={stats.publishedNews}   icon="📰" accent="bg-sky-500"    sub="live"     delay={240} />
        <StatCard label="Connections"      value={stats.totalConnections} icon="🔗" accent="bg-indigo-400" sub="total"   delay={300} />
      </div>

      {/* ── ROW 1: Jobs + Events ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Pending Jobs */}
        <div className="card" style={{ animation: "fadeSlideUp 0.5s ease 0.35s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Pending Job Approvals</h3>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{recentJobs.filter(j => !jobActions[j._id]).length} awaiting review</p>
            </div>
            <span className="badge" style={{ background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" }}>
              {recentJobs.filter(j => !jobActions[j._id]).length} pending
            </span>
          </div>
          <div style={{ padding: "6px 0" }}>
            {recentJobs.map((job) => {
              const action = jobActions[job._id];
              return (
                <div key={job._id} className="hover-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", transition: "background 0.15s" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>{job.companyName} · {job.location}</span>
                      <span className="badge" style={{ background: "#f1f5f9", color: workModeStyle[job.workMode], fontSize: 10 }}>{job.workMode}</span>
                      <span className="badge" style={{ background: "#f1f5f9", color: expStyle[job.experienceLevel], fontSize: 10 }}>{job.experienceLevel}</span>
                    </div>
                  </div>
                  {action ? (
                    <span className="badge" style={{ background: action === "approved" ? "#f0fdf4" : "#fff1f2", color: action === "approved" ? "#16a34a" : "#e11d48", border: `1px solid ${action === "approved" ? "#bbf7d0" : "#fecdd3"}` }}>
                      {action === "approved" ? "✓ Approved" : "✕ Rejected"}
                    </span>
                  ) : (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button className="action-btn" onClick={() => handleJob(job._id, "approved")} style={{ background: "#f0fdf4", color: "#16a34a" }}>Approve</button>
                      <button className="action-btn" onClick={() => handleJob(job._id, "rejected")} style={{ background: "#fff1f2", color: "#e11d48" }}>Reject</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card" style={{ animation: "fadeSlideUp 0.5s ease 0.4s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Upcoming Events</h3>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Registration overview</p>
            </div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {recentEvents.map(ev => {
              const pct = ev.isLimited ? Math.min(100, Math.round((ev.registrationsCount / ev.capacity) * 100)) : null;
              const catColors = { meetup: ["#ede9fe", "#7c3aed"], seminar: ["#e0f2fe", "#0284c7"], workshop: ["#fef9c3", "#ca8a04"] };
              const [bg, fg] = catColors[ev.category] || ["#f1f5f9", "#475569"];
              return (
                <div key={ev._id} className="hover-row" style={{ padding: "12px 20px", transition: "background 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                        <span className="badge" style={{ background: bg, color: fg }}>{ev.category}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{ev.isVirtual ? "🌐 Virtual" : "📍 Physical"}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#334155" }}>{ev.title}</p>
                    </div>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700, whiteSpace: "nowrap", background: "#f8fafc", padding: "3px 8px", borderRadius: 8 }}>{ev.date}</span>
                  </div>
                  {ev.isLimited && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#10b981", borderRadius: 99, transition: "width 1s ease" }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>{ev.registrationsCount}/{ev.capacity}</span>
                    </div>
                  )}
                  {!ev.isLimited && (
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#10b981", fontWeight: 600 }}>✓ Open · {ev.registrationsCount} registered</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Gallery Approvals + News ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, marginBottom: 20 }}>

        {/* Gallery Pending Albums */}
        <div className="card" style={{ animation: "fadeSlideUp 0.5s ease 0.45s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Gallery — Pending Albums</h3>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{pendingAlbums.filter(a => !albumActions[a._id]).length} need approval</p>
            </div>
            <span className="badge" style={{ background: "#fff1f2", color: "#e11d48", border: "1px solid #fecdd3" }}>
              🖼 {pendingAlbums.filter(a => !albumActions[a._id]).length}
            </span>
          </div>
          <div style={{ padding: "6px 0" }}>
            {pendingAlbums.map(album => {
              const action = albumActions[album._id];
              return (
                <div key={album._id} className="hover-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", transition: "background 0.15s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🖼</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{album.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{album.photoCount} photos · @{album.uploadedBy} · {album.eventDate}</p>
                  </div>
                  {action ? (
                    <span className="badge" style={{ background: action === "approved" ? "#f0fdf4" : "#fff1f2", color: action === "approved" ? "#16a34a" : "#e11d48", border: `1px solid ${action === "approved" ? "#bbf7d0" : "#fecdd3"}` }}>
                      {action === "approved" ? "✓ Approved" : "✕ Rejected"}
                    </span>
                  ) : (
                    <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                      <button className="action-btn" onClick={() => handleAlbum(album._id, "approved")} style={{ background: "#f0fdf4", color: "#16a34a" }}>Approve</button>
                      <button className="action-btn" onClick={() => handleAlbum(album._id, "rejected")} style={{ background: "#fff1f2", color: "#e11d48" }}>Reject</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent News */}
        <div className="card" style={{ animation: "fadeSlideUp 0.5s ease 0.5s both" }}>
          <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Recent News</h3>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Published & drafts</p>
          </div>
          <div style={{ padding: "8px 0" }}>
            {recentNews.map(n => {
              const catStyle = { awards: ["#fef9c3", "#a16207"], campus: ["#e0f2fe", "#0369a1"], placements: ["#dcfce7", "#15803d"], general: ["#f1f5f9", "#475569"] };
              const [bg, fg] = catStyle[n.category] || catStyle.general;
              return (
                <div key={n._id} className="hover-row" style={{ padding: "12px 20px", transition: "background 0.15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#334155", lineHeight: 1.4, flex: 1 }}>{n.title}</p>
                    <span className="badge" style={{ background: n.isPublished ? "#f0fdf4" : "#f8fafc", color: n.isPublished ? "#16a34a" : "#94a3b8", border: `1px solid ${n.isPublished ? "#bbf7d0" : "#e2e8f0"}`, flexShrink: 0 }}>
                      {n.isPublished ? "Live" : "Draft"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                    <span className="badge" style={{ background: bg, color: fg }}>{n.category}</span>
                    {n.isPublished && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>👁 {n.viewCount.toLocaleString()} views · {n.publishedAt}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Alumni Table ── */}
      <div className="card" style={{ animation: "fadeSlideUp 0.5s ease 0.55s both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid #f1f5f9" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Recent Alumni</h3>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Latest registered profiles</p>
          </div>
          <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, cursor: "pointer", background: "#eef2ff", padding: "4px 12px", borderRadius: 8 }}>View all →</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Alumni", "Batch", "Stream", "Current Role", "Company"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topAlumni.map((a, i) => (
                <tr key={a._id} className="hover-row" style={{ borderTop: "1px solid #f8fafc", transition: "background 0.15s" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, var(--s,#a78bfa), var(--e,#7c3aed))`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0 }}
                        className={`bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}>
                        {a.fullname.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 700, color: "#334155" }}>{a.fullname}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <span className="badge" style={{ background: "#eef2ff", color: "#4f46e5" }}>{a.batch}</span>
                  </td>
                  <td style={{ padding: "12px 20px", color: "#64748b", fontWeight: 500 }}>{a.stream}</td>
                  <td style={{ padding: "12px 20px", color: "#334155", fontWeight: 600 }}>{a.jobTitle}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span style={{ color: "#0f172a", fontWeight: 700 }}>{a.company}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* bottom padding */}
      <div style={{ height: 40 }} />
    </div>
  );
}