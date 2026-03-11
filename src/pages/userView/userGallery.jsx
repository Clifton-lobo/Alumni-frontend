import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApprovedAlbums,
  fetchAlbumPhotos,
  submitAlbum,
  fetchMyAlbums,
  clearActiveAlbum,
  clearSubmitState,
} from "../../store/user-view/GallerySlice";
import {
  Search, X, Upload, Images, Calendar, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, CheckCircle, Clock, ImagePlus, FolderOpen,
  ZoomIn, Quote, Camera,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import ReactDOM from "react-dom";
import PaginationControls from "../../components/common/Pagination.jsx";
import { useSearchParams } from "react-router-dom";

const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
);

const NAVY = "#142A5D";
const GOLD = "#EBAB09";

const globalStyle = `
  .gal-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
  .gal-sans  { font-family: 'Outfit', system-ui, sans-serif; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .fade-in { opacity: 0; animation: fadeInUp 0.6s cubic-bezier(.22,1,.36,1) forwards; }

  @keyframes heroShimmer {
    0%   { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .hero-text        { animation: heroShimmer 0.85s cubic-bezier(.22,1,.36,1) both; }
  .hero-text-delay  { animation: heroShimmer 0.85s 0.12s cubic-bezier(.22,1,.36,1) both; }
  .hero-text-delay2 { animation: heroShimmer 0.85s 0.24s cubic-bezier(.22,1,.36,1) both; }

  @keyframes cardFloat1 {
    0%,100% { transform: rotate(-7deg) translateY(0px); }
    50%     { transform: rotate(-7deg) translateY(-7px); }
  }
  @keyframes cardFloat2 {
    0%,100% { transform: rotate(4deg) translateY(0px); }
    50%     { transform: rotate(4deg) translateY(-10px); }
  }
  @keyframes cardFloat3 {
    0%,100% { transform: rotate(9deg) translateY(0px); }
    50%     { transform: rotate(9deg) translateY(-5px); }
  }
  .card-f1 { animation: cardFloat1 5s ease-in-out infinite; }
  .card-f2 { animation: cardFloat2 6s ease-in-out infinite 0.7s; }
  .card-f3 { animation: cardFloat3 4.5s ease-in-out infinite 1.3s; }

  .album-card { transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease; }
  .album-card:hover { transform: translateY(-7px); box-shadow: 0 30px 64px -12px rgba(0,0,0,0.26); }

  .drop-zone { border: 2px dashed; transition: all 0.2s ease; }
  .drop-zone.active { border-color: ${GOLD}; background: ${GOLD}10; }

  .album-overlay {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center; padding: 16px;
    animation: overlayIn 0.2s ease;
  }
  @keyframes overlayIn { from{opacity:0}to{opacity:1} }
  .album-panel {
    position: relative; background: #fff; border-radius: 24px;
    width: 100%; max-width: 1100px; max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.28);
    animation: panelIn 0.25s cubic-bezier(.22,1,.36,1);
  }
  @keyframes panelIn {
    from{opacity:0;transform:scale(0.96) translateY(12px)}
    to{opacity:1;transform:scale(1) translateY(0)}
  }

  .lb-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.96);
    display: flex; align-items: center; justify-content: center;
  }
  .lb-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,0.14); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.18s; z-index: 2; color: #fff;
  }
  .lb-btn:hover:not(:disabled) { background: rgba(255,255,255,0.26); }
  .lb-btn:disabled { opacity: 0.2; cursor: default; }
  .lb-close {
    position: absolute; top: 16px; right: 16px;
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.12); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #fff; z-index: 2; transition: background 0.18s;
  }
  .lb-close:hover { background: rgba(255,255,255,0.24); }

  .quote-card { transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease; }
  .quote-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px -8px rgba(0,0,0,0.12); }

  @keyframes navyPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(20,42,93,0.35); }
    50%     { box-shadow: 0 0 0 10px rgba(20,42,93,0); }
  }
  .upload-pulse { animation: navyPulse 2.8s ease infinite; }
`;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";

const statusConfig = {
  pending: { label: "Under Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Live", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-600", icon: AlertCircle },
};

const QUOTES = [
  { id: 1, text: "These photos are more than memories — they're proof that we built something real together. Every reunion feels like coming home.", author: "Sarah Chen", batch: "Class of 2004", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { id: 2, text: "Flipping through the gallery takes me right back. The laughter, the late nights, the friendships that outlasted everything.", author: "Marcus Williams", batch: "Class of 1998", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { id: 3, text: "I uploaded photos from our 10-year reunion and the response was overwhelming. This gallery keeps our story alive.", author: "Priya Nair", batch: "Class of 2011", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
];

/* ─── Per-column height tables so each column looks genuinely staggered ─── */
const COL_HEIGHTS = [
  ["h-[340px]", "h-[240px]", "h-[410px]", "h-[275px]", "h-[360px]"],
  ["h-[255px]", "h-[390px]", "h-[230px]", "h-[375px]", "h-[295px]"],
  ["h-[420px]", "h-[265px]", "h-[355px]", "h-[215px]", "h-[395px]"],
];

/* ══ ALBUM CARD ══ */
const AlbumCard = ({ album, onClick, colIndex, rowIndex }) => {
  const h = COL_HEIGHTS[colIndex % 3][rowIndex % 5];
  return (
    <div onClick={() => onClick(album._id)}
      className="album-card group cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100 mb-5"
      style={{ boxShadow: "0 3px 16px rgba(0,0,0,0.07)" }}>
      <div className={`relative w-full ${h} overflow-hidden bg-gray-100`}>
        {album.coverImage?.url ? (
          <img src={album.coverImage.url} alt={album.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${NAVY}15,${GOLD}20)` }}>
            <Images className="h-12 w-12 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to top, ${NAVY}bb 0%, transparent 55%)` }} />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ZoomIn className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-[3px] h-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" style={{ background: GOLD }} />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="gal-serif font-bold text-white text-lg leading-tight line-clamp-2 mb-2">{album.title}</h3>
          <div className="flex items-center gap-3 gal-sans text-xs text-white/60">
            {album.eventDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" style={{ color: GOLD }} />{fmtDate(album.eventDate)}</span>}
            <span className="flex items-center gap-1"><Images className="h-3 w-3" style={{ color: GOLD }} />{album.photoCount} photos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══ QUOTE CARD ══ */
const QuoteCard = ({ quote }) => (
  <div className="quote-card bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-4" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
    <Quote className="h-6 w-6 opacity-25 flex-shrink-0" style={{ color: GOLD }} />
    <p className="gal-serif text-[15px] italic text-gray-600 leading-relaxed flex-1">"{quote.text}"</p>
    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
      <img src={quote.avatar} alt={quote.author} className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-200" />
      <div>
        <p className="gal-sans text-sm font-semibold text-gray-900">{quote.author}</p>
        <p className="gal-sans text-xs text-gray-400">{quote.batch}</p>
      </div>
    </div>
  </div>
);

/* ══ LIGHTBOX ══ */
const Lightbox = ({ photos, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = "" }; }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key === "ArrowRight") setIdx(i => Math.min(i + 1, photos.length - 1));
      if (e.key === "ArrowLeft") setIdx(i => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [photos.length, onClose]);
  const photo = photos[idx];
  return ReactDOM.createPortal(
    <div className="lb-overlay" onClick={onClose}>
      <button className="lb-close" onClick={(e) => { e.stopPropagation(); onClose(); }}><X size={18} /></button>
      <div className="gal-sans" style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.45)", fontSize: 13, pointerEvents: "none" }}>{idx + 1} / {photos.length}</div>
      <button className="lb-btn" style={{ left: 16 }} disabled={idx === 0} onClick={(e) => { e.stopPropagation(); setIdx(i => Math.max(i - 1, 0)); }}><ChevronLeft size={26} /></button>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "calc(100vw - 160px)", maxHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img key={idx} src={photo.url} alt={photo.caption || ""} style={{ maxWidth: "100%", maxHeight: "calc(100vh - 80px)", width: "auto", height: "auto", objectFit: "contain", borderRadius: 10, display: "block", userSelect: "none" }} />
      </div>
      <button className="lb-btn" style={{ right: 16 }} disabled={idx === photos.length - 1} onClick={(e) => { e.stopPropagation(); setIdx(i => Math.min(i + 1, photos.length - 1)); }}><ChevronRight size={26} /></button>
    </div>,
    document.body
  );
};

/* ══ ALBUM PANEL ══ */
const AlbumPanel = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { activeAlbum, activePhotos, loading } = useSelector((s) => s.gallery);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  useEffect(() => { if (open) document.body.style.overflow = "hidden"; else document.body.style.overflow = ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key !== "Escape") return; e.stopPropagation(); if (lightboxIdx !== null) setLightboxIdx(null); else handleClose(); };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, lightboxIdx]);
  const handleClose = () => { setLightboxIdx(null); onClose(); dispatch(clearActiveAlbum()); };
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div className="album-overlay" onClick={handleClose}>
        <div className="album-panel" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleClose} style={{ position: "absolute", top: 14, right: 14, zIndex: 10, width: 34, height: 34, borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} color="#374151" /></button>
          {loading.photos ? (
            <div className="flex flex-col items-center justify-center py-28 gap-3 gal-sans"><Loader2 className="h-7 w-7 animate-spin text-gray-300" /><p className="text-sm text-gray-400">Loading photos…</p></div>
          ) : activeAlbum ? (
            <>
              <div className="flex-shrink-0 px-6 py-5 border-b border-gray-100">
                <h2 className="gal-serif font-bold text-2xl text-gray-900">{activeAlbum.title}</h2>
                <div className="flex items-center gap-4 gal-sans text-sm text-gray-400 mt-1.5">
                  {activeAlbum.eventDate && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" style={{ color: GOLD }} />{new Date(activeAlbum.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>}
                  <span className="flex items-center gap-1.5"><Images className="h-3.5 w-3.5" style={{ color: GOLD }} />{activePhotos.length} photos</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activePhotos.map((photo, i) => (
                    <div key={photo._id} className="fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                      <div onClick={() => setLightboxIdx(i)} className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 aspect-[4/3]">
                        <img src={photo.url} alt={photo.caption || ""} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <ZoomIn className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {lightboxIdx !== null && <Lightbox photos={activePhotos} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </>,
    document.body
  );
};

/* ══ UPLOAD MODAL ══ */
const UploadModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { loading, submitSuccess, error } = useSelector((s) => s.gallery);
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [eventDate, setEventDate] = useState("");
  const [files, setFiles] = useState([]); const [previews, setPreviews] = useState([]); const [dragging, setDragging] = useState(false);
  useEffect(() => { if (submitSuccess) { toast.success("Album submitted! It'll go live once approved by admin."); dispatch(clearSubmitState()); onClose(); reset(); } }, [submitSuccess]);
  useEffect(() => { if (error) toast.error(error); }, [error]);
  const reset = () => { setTitle(""); setDescription(""); setEventDate(""); setFiles([]); setPreviews([]); };
  const handleFiles = (newFiles) => {
    const incoming = Array.from(newFiles).filter(f => f.type.startsWith("image/"));
    setFiles(prev => [...prev, ...incoming].filter((f, i, s) => i === s.findIndex(x => x.name === f.name && x.size === f.size)).slice(0, 50));
    setPreviews(prev => [...prev, ...incoming.map(f => URL.createObjectURL(f))].slice(0, 50));
  };
  const handleSubmit = () => {
    if (!title.trim()) return toast.error("Please add a title");
    if (!files.length) return toast.error("Please select at least one photo");
    const fd = new FormData();
    fd.append("title", title.trim()); fd.append("description", description.trim());
    if (eventDate) fd.append("eventDate", eventDate);
    files.forEach(f => fd.append("photos", f));
    dispatch(submitAlbum(fd));
  };
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="max-w-xl p-0 gap-0 rounded-2xl border-0 overflow-hidden max-h-[90vh] flex flex-col [&>button]:p-1  [&>button]:rounded-full  [&>button]:cursor-pointer [&>button]:top-4 [&>button]:right-4 [&>button]:z-20 [&>button]:bg-gray-100">
        <div className="flex-shrink-0 relative overflow-hidden" style={{ background: NAVY, padding: "24px 24px 20px" }}>
          <div className="absolute top-0 left-0 w-1 h-full" style={{ background: GOLD }} />
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10" style={{ background: GOLD }} />
          <Camera className="h-6 w-6 mb-3" style={{ color: GOLD }} />
          <h2 className="gal-serif font-bold text-xl text-white">Share Your Photos</h2>
          <p className="gal-sans text-sm text-white/50 mt-1">Upload a photo album — admin will review and publish it.</p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 gal-sans">
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Album Title <span className="text-red-400">*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Annual Sports Day 2024" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition" /></div>
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Event Date</label>
            <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition" /></div>
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Brief description…" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition resize-none" /></div>
          <div>
            <div className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Photos <span className="text-red-400">*</span> <span className="normal-case font-normal text-gray-400">(max 50)</span></div>
            <label className={`drop-zone rounded-2xl p-6 text-center cursor-pointer block relative ${dragging ? "active" : "border-gray-200"}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}>
              <input type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: dragging ? GOLD : "#f5f5f5" }}>
                <ImagePlus className={`h-5 w-5 pointer-events-none ${dragging ? "text-white" : "text-gray-400"}`} />
              </div>
              <p className="text-sm text-gray-500 pointer-events-none">Drop photos here or <span className="font-semibold" style={{ color: GOLD }}>browse</span></p>
              <p className="text-xs text-gray-400 mt-1 pointer-events-none">JPG, PNG, WebP — up to 50 images</p>
            </label>
            <p className="text-xs text-white p-3 rounded-xl mt-2 bg-green-400">Hold <span className="font-medium">Ctrl</span> (or <span className="font-medium">Cmd</span> on Mac) or <span className="font-medium">Shift</span> to select multiple files</p>
            {previews.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">{files.length} photo{files.length !== 1 ? "s" : ""} selected</p>
                  <button onClick={() => { setFiles([]); setPreviews([]); }} className="text-xs text-red-400 hover:text-red-600 transition">Clear all</button>
                </div>
                <div className="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto">
                  {previews.slice(0, 20).map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => { setFiles(p => p.filter((_, di) => di !== i)); setPreviews(p => p.filter((_, di) => di !== i)); }}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {files.length > 20 && <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">+{files.length - 20}</div>}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
            <Clock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">Your album will be reviewed before going live. Track status in <strong>My Uploads</strong>.</p>
          </div>
        </div>
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={() => { onClose(); reset(); }} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 transition gal-sans">Cancel</button>
          <button onClick={handleSubmit} disabled={loading.submit} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90 gal-sans" style={{ background: GOLD, color: NAVY }}>
            {loading.submit ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading…</> : <><Upload className="h-4 w-4" />Submit Album</>}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ══ MY UPLOADS DIALOG ══ */
const MyUploadsDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { myAlbums, loading } = useSelector((s) => s.gallery);
  useEffect(() => { if (open) dispatch(fetchMyAlbums()); }, [open]);
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg p-0 gap-0 rounded-2xl border-0 overflow-hidden max-h-[80vh] flex flex-col [&>button]:top-4 [&>button]:right4 [&>button]:z-20 [&>button]:rounded-full 
    [&>button]:p-1 [&>button]:cursor-pointer 
      [&>button]:w9 [&>button]:h9 [&>button]:bg-gray-100">
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="gal-serif font-bold text-xl text-gray-900">My Uploads</h2>
          <p className="gal-sans text-sm text-gray-400 mt-1">Track your submitted photo albums</p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 gal-sans">
          {loading.mine ? (<div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
          ) : myAlbums.length === 0 ? (<div className="flex flex-col items-center justify-center py-16 text-center"><FolderOpen className="h-10 w-10 text-gray-200 mb-3" /><p className="text-sm text-gray-400">You haven't submitted any albums yet.</p></div>
          ) : (
            <div className="space-y-3">
              {myAlbums.map(album => {
                const sc = statusConfig[album.status] || statusConfig.pending; const Icon = sc.icon;
                return (
                  <div key={album._id} className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-white">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {album.coverImage?.url ? <img src={album.coverImage.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Images className="h-5 w-5 text-gray-300" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{album.title}</p>
                      <p className="text-xs text-gray-400">{album.photoCount} photos · {fmtDate(album.createdAt)}</p>
                      {album.rejectionReason && <p className="text-xs text-red-400 mt-0.5 truncate">{album.rejectionReason}</p>}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${sc.color}`}><Icon className="h-3 w-3" />{sc.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ══════════════════════════════════════════════
   MAIN GALLERY PAGE
══════════════════════════════════════════════ */
const UserGallery = () => {
  const dispatch = useDispatch();
  const { albums, pagination, loading } = useSelector((s) => s.gallery);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const debounceRef = useRef(null);
  const prevPageRef = useRef(pageFromUrl);
  const listRef = useRef(null);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [myUploadsOpen, setMyUploadsOpen] = useState(false);

  useEffect(() => {
    const params = { page: pageFromUrl, limit: 12 };
    if (searchText) params.search = searchText;
    dispatch(fetchApprovedAlbums(params));
  }, [searchText, pageFromUrl, dispatch]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value; setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchText(value.trim());
      setSearchParams(prev => { const p = new URLSearchParams(prev); p.set("page", "1"); return p; });
    }, 500);
  }, [setSearchParams]);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  useEffect(() => {
    if (loading.albums) return;
    if (prevPageRef.current !== pageFromUrl) {
      prevPageRef.current = pageFromUrl;
      setTimeout(() => {
        if (!listRef.current) return;
        window.scrollTo({ top: listRef.current.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
      }, 300);
    }
  }, [loading.albums, pageFromUrl]);

  const onPageChange = (page) => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set("page", String(page)); return p; });
  const clearSearch = () => { setSearchInput(""); setSearchText(""); if (debounceRef.current) clearTimeout(debounceRef.current); };
  const openAlbum = (id) => { dispatch(fetchAlbumPhotos(id)); setAlbumOpen(true); };

  const cols = [[], [], []];
  albums.forEach((a, i) => cols[i % 3].push({ album: a, rowIndex: Math.floor(i / 3) }));

  return (
    <>
      <style>{globalStyle}</style>
      <FontLink />

      <div className="min-h-screen gal-sans bg-white " style={{ background: "#" }}>

        {/* ══════════════════════════════════════════
            HERO — Polaroid stacked cards, cream bg
        ══════════════════════════════════════════ */}
        <div className="relative overflow-hidden bg-gray-200" style={{ minHeight: 560,}}>
          {/*  background: "rgba(245,242,236,0.95)"  */}

          {/* Dot grid texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.055]"
            style={{ backgroundImage: `radial-gradient(${NAVY} 1.5px, transparent 1.5px)`, backgroundSize: "26px 26px" }} />

          {/* Warm glow blobs */}
          <div className="absolute pointer-events-none" style={{ top: -120, right: "12%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle,${GOLD}1A 0%,transparent 65%)` }} />
          <div className="absolute pointer-events-none" style={{ bottom: -100, left: "-5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle,${NAVY}0D 0%,transparent 65%)` }} />


          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 flex flex-col lg:flex-row items-center gap-12 py-8 md:py-10" style={{ minHeight: 520 }}>

            {/* LEFT — Text block */}
            <div className="flex-1 max-w-xl">
              <div className="flex items-center gap-3 mb-4 hero-text">
                <div className="h-[2px] w-8 rounded-full" style={{ background: GOLD }} />
                <p
                  className="gal-sans text-[11px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: GOLD }}
                >
                  Alumni Network · Photo Gallery
                </p>
              </div>
              <h1 className="font-serif font-black mb-3 text-[54px] leading-[1.1] text-[var(--navy)]">
                Where Memories Live
                <br />
                <span className="text-[var(--gold)]">Beyond Graduation</span>
              </h1>

              <div
                className="w-14 h-[2px] rounded-full mb-3 hero-text-delay"
                style={{ background: `${NAVY}25` }}
              />

              <p
                className="gal-sans text-sm leading-relaxed mb-4 hero-text-delay2"
                style={{ color: `${NAVY}80`, maxWidth: 400 }}
              >
                Browse curated albums from graduation ceremonies, reunions, and campus
                milestones spanning decades of our global alumni community.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3 md:mt-10 flex-wrap hero-text-delay2">
                <button onClick={() => setUploadOpen(true)}
                  className="upload-pulse flex items-center gap-2.5 px-6 py-3.5 rounded-2xl gal-sans text-sm font-bold transition-all hover:opacity-95 hover:-translate-y-0.5 active:scale-95"
                  style={{ background: NAVY, color: "#fff", boxShadow: `0 8px 28px ${NAVY}40` }}>
                  <Upload className="h-4 w-4 flex-shrink-0" /> Upload &amp; Share Photos
                </button>
                <button onClick={() => setMyUploadsOpen(true)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl gal-sans text-sm font-semibold transition-all hover:-translate-y-0.5 border-2"
                  style={{ borderColor: `${NAVY}22`, color: NAVY, background: "rgba(255,255,255,0.65)" }}>
                  <FolderOpen className="h-4 w-4" /> My Uploads
                </button>
              </div>
            </div>

            {/* RIGHT — Polaroid stacked cards */}
            <div className="flex-shrink-0 relative hidden lg:block hero-text-delay2 ml-auto  w-[550px] h-[430px]">

              {/* Card 1 — back left, rotated -7° */}
              <div className="card-f1 absolute overflow-hidden rounded-2xl z-10 border-[5px] border-white top-[68px] left-[10px] w-[280px] h-[340px]"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.16),0 4px 12px rgba(0,0,0,0.08)" }}>
                <img
                  src="https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="" className="w-full object-cover h-[84%]" />
                <div className="px-3 pt-1.5 pb-2 bg-white">
                  <p className="gal-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">Campus Life</p>
                </div>
              </div>

              {/* Card 2 — front centre, rotated +4° (main focal card) */}
              <div className="card-f2 absolute overflow-hidden rounded-2xl z-30 border-[5px] border-white top-2 left-[148px] w-[310px] h-[372px]"
                style={{ boxShadow: "0 30px 72px rgba(0,0,0,0.24),0 8px 20px rgba(0,0,0,0.10)" }}>
                <img
                  src="https://images.pexels.com/photos/6147276/pexels-photo-6147276.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="" className="w-full object-cover h-[84%]" />
                <div className="px-3 pt-1.5 pb-2 bg-white flex items-center justify-between">
                  <p className="gal-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">Graduation Day</p>
                  <span className="text-sm">🎓</span>
                </div>
              </div>

              {/* Card 3 — back right, rotated +9° */}
              <div className="card-f3 absolute overflow-hidden rounded-2xl z-20 border-[5px] border-white top-[88px] left-[298px] w-[275px] h-[330px]"
                style={{ boxShadow: "0 14px 40px rgba(0,0,0,0.14),0 4px 10px rgba(0,0,0,0.07)" }}>
                <img
                  src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="" className="w-full object-cover h-[84%]" />
                <div className="px-3 pt-1.5 pb-2 bg-white">
                  <p className="gal-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">Alumni Meet</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ══ STICKY SEARCH ══ */}
        <div className="sticky top-0 z-30 border-b shadow-sm bg-gray-100" style={{ backdropFilter: "blur(12px)", borderColor: `${NAVY}12` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">

            {/* Search Bar */}
            <div
              className="flex items-center gap-3 rounded-xl px-5 py-3 w-full sm:max-w-3xl border bg-white"
              style={{ borderColor: `${NAVY}14` }}
            >
              <Search
                className="h-5 w-5 flex-shrink-0"
                style={{ color: `${NAVY}45` }}
              />

              <input
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search albums..."
                className="flex-1 bg-transparent text-sm  placeholder-gray-500 outline-none"
                style={{ color: NAVY }}
              />

              {searchInput && (
                <button onClick={clearSearch}>
                  <X className="h-4 w-4 text-gray-600 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Album count */}
            <p
              className="gal-sans text-sm font-semibold hidden sm:block"
              style={{ color: `${NAVY}60` }}
            >
              {pagination.total ? `${pagination.total} albums` : "Browse Gallery"}
            </p>

          </div>
        </div>

        {/* ══ MASONRY ALBUM GRID ══ */}
        <div ref={listRef} className="max-w-7xl bg-white mx-auto px-4 sm:px-6 py-10 sm:py-12">

          {!loading.albums && albums.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: `${NAVY}08` }}>
                <Images className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="gal-serif text-xl font-bold text-gray-700 mb-2">No albums yet</h3>
              <p className="text-sm text-gray-400 max-w-xs gal-sans">{searchText ? `No albums found for "${searchText}".` : "Be the first to share your photos!"}</p>
              {searchText ? (
                <button onClick={clearSearch} className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 gal-sans" style={{ background: NAVY }}>Clear search</button>
              ) : (
                <button onClick={() => setUploadOpen(true)} className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90 gal-sans" style={{ background: GOLD, color: NAVY }}>
                  <Upload className="h-4 w-4" /> Share Your Photos
                </button>
              )}
            </div>
          )}

          {albums.length > 0 && (
            <div className={`transition-opacity duration-300 ${loading.albums ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
              {/* 3 independent flex columns — heights vary per col+row for true masonry stagger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                {cols.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col">
                    {col.map(({ album, rowIndex }) => (
                      <AlbumCard key={album._id} album={album} onClick={openAlbum} colIndex={colIdx} rowIndex={rowIndex} />
                    ))}
                  </div>
                ))}
              </div>
              {pagination.pages > 1 && (
                <div className="mx-auto my-10 max-w-6xl px-4 md:px-6">
                  <PaginationControls currentPage={pageFromUrl} totalPages={pagination.pages} onPageChange={onPageChange} />
                </div>
              )}
            </div>
          )}

          {loading.albums && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-amber-400" />
            </div>
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <footer className="border-t border-gray-200 py-6 text-center" style={{ background: NAVY }}>
          <p className="gal-sans text-xs text-white/30">© {new Date().getFullYear()} Alumni Network · All rights reserved</p>
        </footer>
      </div>

      <AlbumPanel open={albumOpen} onClose={() => setAlbumOpen(false)} />
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <MyUploadsDialog open={myUploadsOpen} onClose={() => setMyUploadsOpen(false)} />
    </>
  );
};

export default UserGallery;

