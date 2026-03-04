
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
  ZoomIn,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import ReactDOM from "react-dom";
import PaginationControls from "../../components/common/Pagination.jsx";
import { useSearchParams } from "react-router-dom";

/* ─── Fonts ─── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const NAVY = "#142A5D";
const GOLD = "#EBAB09";

const globalStyle = `
  .gal-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
  .gal-sans  { font-family: 'Outfit', system-ui, sans-serif; }
  .album-card { transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease; }
  .album-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px -10px rgba(0,0,0,0.18); }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .fade-in {
    opacity: 0;
    animation: fadeInUp 0.6s cubic-bezier(.22,1,.36,1) forwards;
  }
  .drop-zone { border: 2px dashed; transition: all 0.2s ease; }
  .drop-zone.active { border-color: ${GOLD}; background: ${GOLD}10; }

  /* ── Album Panel overlay ── */
  .album-overlay {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(0,0,0,0.55);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: overlayIn 0.2s ease;
  }
  @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }
  .album-panel {
    position: relative; background: #fff; border-radius: 24px;
    width: 100%; max-width: 1100px; max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.28);
    animation: panelIn 0.25s cubic-bezier(.22,1,.36,1);
  }
  @keyframes panelIn {
    from { opacity: 0; transform: scale(0.96) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* ── Lightbox ── */
  .lb-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.96);
    display: flex; align-items: center; justify-content: center;
  }
  .lb-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,0.14); border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.18s; z-index: 2; color: #fff;
  }
  .lb-btn:hover:not(:disabled) { background: rgba(255,255,255,0.26); }
  .lb-btn:disabled { opacity: 0.2; cursor: default; }
  .lb-close {
    position: absolute; top: 16px; right: 16px;
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.12); border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #fff; z-index: 2; transition: background 0.18s;
  }
  .lb-close:hover { background: rgba(255,255,255,0.24); }
`;

/* ── Helpers ── */
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";

const statusConfig = {
  pending:  { label: "Under Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Live",         color: "bg-green-100 text-green-700",  icon: CheckCircle },
  rejected: { label: "Rejected",     color: "bg-red-100 text-red-600",      icon: AlertCircle },
};

/* ══════════════════════════════════════════════
   ALBUM CARD
══════════════════════════════════════════════ */
const AlbumCard = ({ album, onClick }) => (
  <div
    onClick={() => onClick(album._id)}
    className="album-card group cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100"
    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
  >
    <div className="relative w-full h-[320px] overflow-hidden bg-gray-100">
      {album.coverImage?.url ? (
        <img src={album.coverImage.url} alt={album.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${NAVY}15, ${GOLD}20)` }}>
          <Images className="h-12 w-12 text-gray-300" />
        </div>
      )}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(10,20,50,0.85) 0%, transparent 55%)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="gal-serif font-bold text-white text-lg leading-tight line-clamp-1 mb-1">
          {album.title}
        </h3>
        <div className="flex items-center gap-3 gal-sans text-xs text-white/60">
          {album.eventDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {fmtDate(album.eventDate)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Images className="h-3 w-3" />
            {album.photoCount} photos
          </span>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   LIGHTBOX — pure portal, zero Radix involvement
   Desktop: chevron buttons
   Mobile:  swipe left/right, no buttons
   z-index 9999 sits above AlbumPanel (9000)
══════════════════════════════════════════════ */
const Lightbox = ({ photos, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const [isMobile, setIsMobile] = useState(false);

  // Swipe tracking
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging  = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  /* detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* keyboard (desktop) */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape")     { e.stopPropagation(); onClose(); }
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, photos.length - 1));
      if (e.key === "ArrowLeft")  setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [photos.length, onClose]);

  /* swipe handlers */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current  = false;
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Only track horizontal swipe
    if (!isDragging.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      e.preventDefault(); // stop page scroll while swiping
      setDragOffset(dx);
    }
  };

  const onTouchEnd = (e) => {
    if (isDragging.current) {
      const dx = dragOffset;
      const THRESHOLD = 50;
      if (dx < -THRESHOLD && idx < photos.length - 1) setIdx((i) => i + 1);
      else if (dx > THRESHOLD && idx > 0)              setIdx((i) => i - 1);
    } else {
      // Tap without swipe → close
      onClose();
    }
    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current  = false;
    setDragOffset(0);
  };

  const photo = photos[idx];

  // Animate image slide on drag
  const imgTransform = isMobile && dragOffset !== 0
    ? `translateX(${dragOffset * 0.3}px)`
    : "translateX(0)";

  return ReactDOM.createPortal(
    <div
      className="lb-overlay"
      onClick={!isMobile ? onClose : undefined}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
      style={{ touchAction: "none" }}
    >
      {/* close button */}
      <button
        className="lb-close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X size={18} />
      </button>

      {/* counter */}
      <div className="gal-sans" style={{
        position: "absolute", bottom: 20,
        left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.45)", fontSize: 13, pointerEvents: "none",
      }}>
        {idx + 1} / {photos.length}
      </div>

      {/* swipe hint dots — mobile only */}
      {isMobile && photos.length > 1 && (
        <div style={{
          position: "absolute", bottom: 44,
          left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 6, pointerEvents: "none",
        }}>
          {photos.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 18 : 6, height: 6,
              borderRadius: 3,
              background: i === idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
              transition: "all 0.25s ease",
            }} />
          ))}
        </div>
      )}

      {/* Desktop: prev button */}
      {!isMobile && (
        <button
          className="lb-btn"
          style={{ left: 16 }}
          disabled={idx === 0}
          onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.max(i - 1, 0)); }}
        >
          <ChevronLeft size={26} />
        </button>
      )}

      {/* image */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          maxWidth: isMobile ? "100vw" : "calc(100vw - 160px)",
          maxHeight: "calc(100vh - 80px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: isMobile ? "60px 12px 80px" : "0",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <img
          key={idx}
          src={photo.url}
          alt={photo.caption || ""}
          style={{
            maxWidth: "100%", maxHeight: "calc(100vh - 140px)",
            width: "auto", height: "auto",
            objectFit: "contain", borderRadius: 10,
            display: "block", userSelect: "none",
            transform: imgTransform,
            transition: dragOffset === 0 ? "transform 0.3s ease" : "none",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Desktop: next button */}
      {!isMobile && (
        <button
          className="lb-btn"
          style={{ right: 16 }}
          disabled={idx === photos.length - 1}
          onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.min(i + 1, photos.length - 1)); }}
        >
          <ChevronRight size={26} />
        </button>
      )}
    </div>,
    document.body
  );
};

/* ══════════════════════════════════════════════
   ALBUM PANEL — pure portal (NO DialogContent at all)
   This eliminates ALL Radix event interception.
══════════════════════════════════════════════ */
const AlbumPanel = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { activeAlbum, activePhotos, loading } = useSelector((s) => s.gallery);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  /* lock body scroll */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else      document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Escape key: close lightbox first, then panel */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (lightboxIdx !== null) setLightboxIdx(null);
      else handleClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, lightboxIdx]);

  const handleClose = () => {
    setLightboxIdx(null);
    onClose();
    dispatch(clearActiveAlbum());
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      {/* overlay backdrop — click closes panel */}
      <div className="album-overlay" onClick={handleClose}>

        {/* panel — stopPropagation so clicks inside don't hit backdrop */}
        <div className="album-panel" onClick={(e) => e.stopPropagation()}>

          {/* close btn */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute", top: 14, right: 14, zIndex: 10,
              width: 34, height: 34, borderRadius: "50%",
              background: "#f3f4f6", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={16} color="#374151" />
          </button>

          {loading.photos ? (
            <div className="flex flex-col items-center justify-center py-28 gap-3 gal-sans">
              <Loader2 className="h-7 w-7 animate-spin text-gray-300" />
              <p className="text-sm text-gray-400">Loading photos…</p>
            </div>
          ) : activeAlbum ? (
            <>
              {/* Header */}
              <div className="flex-shrink-0 px-6 py-5 border-b border-gray-100">
                <h2 className="gal-serif font-bold text-2xl text-gray-900">{activeAlbum.title}</h2>
                <div className="flex items-center gap-4 gal-sans text-sm text-gray-400 mt-1.5">
                  {activeAlbum.eventDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" style={{ color: GOLD }} />
                      {new Date(activeAlbum.eventDate).toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Images className="h-3.5 w-3.5" style={{ color: GOLD }} />
                    {activePhotos.length} photos
                  </span>
                </div>
              </div>

              {/* Photo grid */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activePhotos.map((photo, i) => (
                    <div key={photo._id} className="fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                      <div
                        onClick={() => setLightboxIdx(i)}
                        className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 aspect-[4/3]"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || ""}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
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

      {/* Lightbox at z-9999 — above everything */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={activePhotos}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>,
    document.body
  );
};

/* ══════════════════════════════════════════════
   UPLOAD MODAL (no lightbox inside — DialogContent is fine)
══════════════════════════════════════════════ */
const UploadModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { loading, submitSuccess, error } = useSelector((s) => s.gallery);

  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate]     = useState("");
  const [files, setFiles]             = useState([]);
  const [previews, setPreviews]       = useState([]);
  const [dragging, setDragging]       = useState(false);

  useEffect(() => {
    if (submitSuccess) {
      toast.success("Album submitted! It'll go live once approved by admin.");
      dispatch(clearSubmitState());
      onClose(); reset();
    }
  }, [submitSuccess]);

  useEffect(() => { if (error) toast.error(error); }, [error]);

  const reset = () => {
    setTitle(""); setDescription(""); setEventDate(""); setFiles([]); setPreviews([]);
  };

  const handleFiles = (newFiles) => {
    const incoming = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) =>
      [...prev, ...incoming]
        .filter((f, i, s) => i === s.findIndex((x) => x.name === f.name && x.size === f.size))
        .slice(0, 50)
    );
    setPreviews((prev) => [...prev, ...incoming.map((f) => URL.createObjectURL(f))].slice(0, 50));
  };

  const handleSubmit = () => {
    if (!title.trim()) return toast.error("Please add a title");
    if (!files.length) return toast.error("Please select at least one photo");
    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    if (eventDate) fd.append("eventDate", eventDate);
    files.forEach((f) => fd.append("photos", f));
    dispatch(submitAlbum(fd));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="max-w-xl p-0 gap-0 rounded-2xl border-0 overflow-hidden max-h-[90vh] flex flex-col
        [&>button]:top-4 [&>button]:right-4 [&>button]:z-20 [&>button]:rounded-full [&>button]:w-9 [&>button]:h-9 [&>button]:bg-gray-100">

        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="gal-serif font-bold text-xl text-gray-900">Share Your Photos</h2>
          <p className="gal-sans text-sm text-gray-400 mt-1">Upload a folder of photos — admin will review and publish them.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 gal-sans">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Album Title <span className="text-red-400">*</span>
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day 2024"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Event Date</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              placeholder="Brief description…"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition resize-none" />
          </div>

          <div>
            <div className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Photos <span className="text-red-400">*</span>{" "}
              <span className="normal-case font-normal text-gray-400">(max 50)</span>
            </div>
            <label
              className={`drop-zone rounded-2xl p-6 text-center cursor-pointer block relative ${dragging ? "active" : "border-gray-200"}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
            >
              <input type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <ImagePlus className="h-8 w-8 mx-auto mb-2 text-gray-300 pointer-events-none" />
              <p className="text-sm text-gray-500 pointer-events-none">
                Drop photos here or <span className="font-semibold" style={{ color: GOLD }}>browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1 pointer-events-none">JPG, PNG, WebP — up to 50 images</p>
            </label>

            <p className="text-xs text-white p-3 rounded-xl mt-1 bg-green-400">
              Hold <span className="font-medium">Ctrl</span> (or <span className="font-medium">Cmd</span> on Mac)
              or <span className="font-medium">Shift</span> to select multiple files
            </p>

            {previews.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">{files.length} photo{files.length !== 1 ? "s" : ""} selected</p>
                  <button onClick={() => { setFiles([]); setPreviews([]); }}
                    className="text-xs text-red-400 hover:text-red-600 transition">Clear all</button>
                </div>
                <div className="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto">
                  {previews.slice(0, 20).map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          setFiles((prev) => prev.filter((_, di) => di !== i));
                          setPreviews((prev) => prev.filter((_, di) => di !== i));
                        }}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {files.length > 20 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">
                      +{files.length - 20}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
            <Clock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Your album will be reviewed by admin before going live. You'll be able to track the status in <strong>My Uploads</strong>.
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={() => { onClose(); reset(); }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 transition gal-sans">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading.submit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 gal-sans"
            style={{ background: NAVY, color: "#fff" }}>
            {loading.submit
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
              : <><Upload className="h-4 w-4" /> Submit Album</>}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ══════════════════════════════════════════════
   MY UPLOADS DIALOG
══════════════════════════════════════════════ */
const MyUploadsDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { myAlbums, loading } = useSelector((s) => s.gallery);

  useEffect(() => { if (open) dispatch(fetchMyAlbums()); }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg p-0 gap-0 rounded-2xl border-0 overflow-hidden max-h-[80vh] flex flex-col
        [&>button]:top-4 [&>button]:right-4 [&>button]:z-20 [&>button]:rounded-full [&>button]:w-9 [&>button]:h-9 [&>button]:bg-gray-100">

        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="gal-serif font-bold text-xl text-gray-900">My Uploads</h2>
          <p className="gal-sans text-sm text-gray-400 mt-1">Track your submitted photo albums</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 gal-sans">
          {loading.mine ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : myAlbums.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">You haven't submitted any albums yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myAlbums.map((album) => {
                const sc = statusConfig[album.status] || statusConfig.pending;
                const Icon = sc.icon;
                return (
                  <div key={album._id} className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-white">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {album.coverImage?.url
                        ? <img src={album.coverImage.url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Images className="h-5 w-5 text-gray-300" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{album.title}</p>
                      <p className="text-xs text-gray-400">{album.photoCount} photos · {fmtDate(album.createdAt)}</p>
                      {album.rejectionReason && (
                        <p className="text-xs text-red-400 mt-0.5 truncate">{album.rejectionReason}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${sc.color}`}>
                      <Icon className="h-3 w-3" />
                      {sc.label}
                    </span>
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
  const [searchText, setSearchText]   = useState("");

  const debounceRef  = useRef(null);
  const prevPageRef  = useRef(pageFromUrl);
  const listRef      = useRef(null);

  const [albumOpen,     setAlbumOpen]     = useState(false);
  const [uploadOpen,    setUploadOpen]    = useState(false);
  const [myUploadsOpen, setMyUploadsOpen] = useState(false);

  useEffect(() => {
    const params = { page: pageFromUrl, limit: 12 };
    if (searchText) params.search = searchText;
    dispatch(fetchApprovedAlbums(params));
  }, [searchText, pageFromUrl, dispatch]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchText(value.trim());
      setSearchParams((prev) => { const p = new URLSearchParams(prev); p.set("page", "1"); return p; });
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

  const onPageChange = (page) => {
    setSearchParams((prev) => { const p = new URLSearchParams(prev); p.set("page", String(page)); return p; });
  };

  const clearSearch = () => {
    setSearchInput(""); setSearchText("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  const openAlbum = (id) => {
    dispatch(fetchAlbumPhotos(id));
    setAlbumOpen(true);
  };

  return (
    <>
      <style>{globalStyle}</style>
      <FontLink />

      <div className="min-h-screen gal-sans" style={{ background: "#F8F7F4" }}>

        {/* Header */}
        <div style={{ background: NAVY }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
                  Alumni Network
                </p>
                <h1 className="gal-serif font-extrabold text-white text-3xl sm:text-4xl leading-tight">
                  Photo Gallery
                </h1>
                <p className="text-sm text-white/40 mt-1.5">Memories from our community events</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMyUploadsOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white/70 hover:bg-white/15 transition">
                  <FolderOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">My Uploads</span>
                </button>
                <button onClick={() => setUploadOpen(true)}
                  className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
                  style={{ background: GOLD }}>
                  <Upload className="h-4 w-4" />
                  Share Photos
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 max-w-md">
              <Search className="h-4 w-4 text-white/30 flex-shrink-0" />
              <input
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search albums…"
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
              />
              {searchInput && (
                <button onClick={clearSearch}>
                  <X className="h-3.5 w-3.5 text-white/40 hover:text-white transition" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={listRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {!loading.albums && albums.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                style={{ background: `${NAVY}08` }}>
                <Images className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="gal-serif text-xl font-bold text-gray-700 mb-2">No albums yet</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                {searchText ? `No albums found for "${searchText}".` : "Be the first to share your photos!"}
              </p>
              {searchText && (
                <button onClick={clearSearch}
                  className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: NAVY }}>
                  Clear search
                </button>
              )}
            </div>
          )}

          {albums.length > 0 && (
            <div className={`transition-opacity duration-300 ${loading.albums ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {albums.map((album) => (
                  <AlbumCard key={album._id} album={album} onClick={openAlbum} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mx-auto my-10 max-w-6xl px-4 md:px-6">
                  <PaginationControls
                    currentPage={pageFromUrl}
                    totalPages={pagination.pages}
                    onPageChange={onPageChange}
                  />
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
      </div>

      {/* Pure portal — zero Radix interference */}
      <AlbumPanel open={albumOpen} onClose={() => setAlbumOpen(false)} />

      {/* These have no lightbox inside so DialogContent is fine */}
      <UploadModal     open={uploadOpen}    onClose={() => setUploadOpen(false)} />
      <MyUploadsDialog open={myUploadsOpen} onClose={() => setMyUploadsOpen(false)} />
    </>
  );
};

export default UserGallery;


// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchApprovedAlbums,
//   fetchAlbumPhotos,
//   submitAlbum,
//   fetchMyAlbums,
//   clearActiveAlbum,
//   clearSubmitState,
// } from "../../store/user-view/GallerySlice";
// import {
//   Search, X, Upload, Images, Calendar, ChevronLeft, ChevronRight,
//   Loader2, AlertCircle, CheckCircle, Clock, ImagePlus, FolderOpen,
//   ZoomIn,
// } from "lucide-react";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import ReactDOM from "react-dom";
// import PaginationControls from "../../components/common/Pagination.jsx";
// import { useSearchParams } from "react-router-dom";

// /* ─── Fonts ─── */
// const FontLink = () => (
//   <link
//     href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap"
//     rel="stylesheet"
//   />
// );

// const NAVY = "#142A5D";
// const GOLD = "#EBAB09";

// const globalStyle = `
//   .gal-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
//   .gal-sans  { font-family: 'Outfit', system-ui, sans-serif; }
//   .album-card { transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease; }
//   .album-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px -10px rgba(0,0,0,0.18); }
//   .scrollbar-hide::-webkit-scrollbar { display: none; }
//   .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//   @keyframes fadeInUp {
//     from { opacity: 0; transform: translateY(16px) scale(0.98); }
//     to   { opacity: 1; transform: translateY(0) scale(1); }
//   }
//   .fade-in {
//     opacity: 0;
//     animation: fadeInUp 0.6s cubic-bezier(.22,1,.36,1) forwards;
//   }
//   .drop-zone { border: 2px dashed; transition: all 0.2s ease; }
//   .drop-zone.active { border-color: ${GOLD}; background: ${GOLD}10; }

//   /* ── Album Panel overlay ── */
//   .album-overlay {
//     position: fixed; inset: 0; z-index: 9000;
//     background: rgba(0,0,0,0.55);
//     display: flex; align-items: center; justify-content: center;
//     padding: 16px;
//     animation: overlayIn 0.2s ease;
//   }
//   @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }
//   .album-panel {
//     position: relative; background: #fff; border-radius: 24px;
//     width: 100%; max-width: 1100px; max-height: 90vh;
//     display: flex; flex-direction: column; overflow: hidden;
//     box-shadow: 0 32px 80px rgba(0,0,0,0.28);
//     animation: panelIn 0.25s cubic-bezier(.22,1,.36,1);
//   }
//   @keyframes panelIn {
//     from { opacity: 0; transform: scale(0.96) translateY(12px); }
//     to   { opacity: 1; transform: scale(1) translateY(0); }
//   }

//   /* ── Lightbox ── */
//   .lb-overlay {
//     position: fixed; inset: 0; z-index: 9999;
//     background: rgba(0,0,0,0.96);
//     display: flex; align-items: center; justify-content: center;
//   }
//   .lb-btn {
//     position: absolute; top: 50%; transform: translateY(-50%);
//     width: 52px; height: 52px; border-radius: 50%;
//     background: rgba(255,255,255,0.14); border: none;
//     cursor: pointer; display: flex; align-items: center; justify-content: center;
//     transition: background 0.18s; z-index: 2; color: #fff;
//   }
//   .lb-btn:hover:not(:disabled) { background: rgba(255,255,255,0.26); }
//   .lb-btn:disabled { opacity: 0.2; cursor: default; }
//   .lb-close {
//     position: absolute; top: 16px; right: 16px;
//     width: 40px; height: 40px; border-radius: 50%;
//     background: rgba(255,255,255,0.12); border: none;
//     cursor: pointer; display: flex; align-items: center; justify-content: center;
//     color: #fff; z-index: 2; transition: background 0.18s;
//   }
//   .lb-close:hover { background: rgba(255,255,255,0.24); }
// `;

// /* ── Helpers ── */
// const fmtDate = (d) =>
//   d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";

// const statusConfig = {
//   pending:  { label: "Under Review", color: "bg-amber-100 text-amber-700", icon: Clock },
//   approved: { label: "Live",         color: "bg-green-100 text-green-700",  icon: CheckCircle },
//   rejected: { label: "Rejected",     color: "bg-red-100 text-red-600",      icon: AlertCircle },
// };

// /* ══════════════════════════════════════════════
//    ALBUM CARD
// ══════════════════════════════════════════════ */
// const AlbumCard = ({ album, onClick }) => (
//   <div
//     onClick={() => onClick(album._id)}
//     className="album-card group cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100"
//     style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
//   >
//     <div className="relative w-full h-[320px] overflow-hidden bg-gray-100">
//       {album.coverImage?.url ? (
//         <img src={album.coverImage.url} alt={album.title} className="w-full h-full object-cover" />
//       ) : (
//         <div className="w-full h-full flex items-center justify-center"
//           style={{ background: `linear-gradient(135deg, ${NAVY}15, ${GOLD}20)` }}>
//           <Images className="h-12 w-12 text-gray-300" />
//         </div>
//       )}
//       <div className="absolute inset-0"
//         style={{ background: "linear-gradient(to top, rgba(10,20,50,0.85) 0%, transparent 55%)" }} />
//       <div className="absolute bottom-0 left-0 right-0 p-4">
//         <h3 className="gal-serif font-bold text-white text-lg leading-tight line-clamp-1 mb-1">
//           {album.title}
//         </h3>
//         <div className="flex items-center gap-3 gal-sans text-xs text-white/60">
//           {album.eventDate && (
//             <span className="flex items-center gap-1">
//               <Calendar className="h-3 w-3" />
//               {fmtDate(album.eventDate)}
//             </span>
//           )}
//           <span className="flex items-center gap-1">
//             <Images className="h-3 w-3" />
//             {album.photoCount} photos
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════
//    LIGHTBOX — pure portal, zero Radix involvement
//    z-index 9999 sits above AlbumPanel (9000)
// ══════════════════════════════════════════════ */
// const Lightbox = ({ photos, startIndex, onClose }) => {
//   const [idx, setIdx] = useState(startIndex);

//   /* lock body scroll */
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   /* keyboard */
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape")     { e.stopPropagation(); onClose(); }
//       if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, photos.length - 1));
//       if (e.key === "ArrowLeft")  setIdx((i) => Math.max(i - 1, 0));
//     };
//     window.addEventListener("keydown", onKey, true);
//     return () => window.removeEventListener("keydown", onKey, true);
//   }, [photos.length, onClose]);

//   const photo = photos[idx];

//   return ReactDOM.createPortal(
//     /* backdrop click → close */
//     <div className="lb-overlay" onClick={onClose}>

//       {/* close */}
//       <button className="lb-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
//         <X size={18} />
//       </button>

//       {/* counter */}
//       <div className="gal-sans" style={{
//         position: "absolute", bottom: 20,
//         left: "50%", transform: "translateX(-50%)",
//         color: "rgba(255,255,255,0.45)", fontSize: 13, pointerEvents: "none",
//       }}>
//         {idx + 1} / {photos.length}
//       </div>

//       {/* prev */}
//       <button
//         className="lb-btn"
//         style={{ left: 16 }}
//         disabled={idx === 0}
//         onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.max(i - 1, 0)); }}
//       >
//         <ChevronLeft size={26} />
//       </button>

//       {/* image — stopPropagation so clicking photo doesn't close */}
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           maxWidth: "calc(100vw - 160px)",
//           maxHeight: "calc(100vh - 80px)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//         }}
//       >
//         <img
//           key={idx}
//           src={photo.url}
//           alt={photo.caption || ""}
//           style={{
//             maxWidth: "100%", maxHeight: "calc(100vh - 80px)",
//             width: "auto", height: "auto",
//             objectFit: "contain", borderRadius: 10,
//             display: "block", userSelect: "none",
//           }}
//         />
//       </div>

//       {/* next */}
//       <button
//         className="lb-btn"
//         style={{ right: 16 }}
//         disabled={idx === photos.length - 1}
//         onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.min(i + 1, photos.length - 1)); }}
//       >
//         <ChevronRight size={26} />
//       </button>
//     </div>,
//     document.body
//   );
// };

// /* ══════════════════════════════════════════════
//    ALBUM PANEL — pure portal (NO DialogContent at all)
//    This eliminates ALL Radix event interception.
// ══════════════════════════════════════════════ */
// const AlbumPanel = ({ open, onClose }) => {
//   const dispatch = useDispatch();
//   const { activeAlbum, activePhotos, loading } = useSelector((s) => s.gallery);
//   const [lightboxIdx, setLightboxIdx] = useState(null);

//   /* lock body scroll */
//   useEffect(() => {
//     if (open) document.body.style.overflow = "hidden";
//     else      document.body.style.overflow = "";
//     return () => { document.body.style.overflow = ""; };
//   }, [open]);

//   /* Escape key: close lightbox first, then panel */
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key !== "Escape") return;
//       e.stopPropagation();
//       if (lightboxIdx !== null) setLightboxIdx(null);
//       else handleClose();
//     };
//     window.addEventListener("keydown", onKey, true);
//     return () => window.removeEventListener("keydown", onKey, true);
//   }, [open, lightboxIdx]);

//   const handleClose = () => {
//     setLightboxIdx(null);
//     onClose();
//     dispatch(clearActiveAlbum());
//   };

//   if (!open) return null;

//   return ReactDOM.createPortal(
//     <>
//       {/* overlay backdrop — click closes panel */}
//       <div className="album-overlay" onClick={handleClose}>

//         {/* panel — stopPropagation so clicks inside don't hit backdrop */}
//         <div className="album-panel" onClick={(e) => e.stopPropagation()}>

//           {/* close btn */}
//           <button
//             onClick={handleClose}
//             style={{
//               position: "absolute", top: 14, right: 14, zIndex: 10,
//               width: 34, height: 34, borderRadius: "50%",
//               background: "#f3f4f6", border: "none", cursor: "pointer",
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}
//           >
//             <X size={16} color="#374151" />
//           </button>

//           {loading.photos ? (
//             <div className="flex flex-col items-center justify-center py-28 gap-3 gal-sans">
//               <Loader2 className="h-7 w-7 animate-spin text-gray-300" />
//               <p className="text-sm text-gray-400">Loading photos…</p>
//             </div>
//           ) : activeAlbum ? (
//             <>
//               {/* Header */}
//               <div className="flex-shrink-0 px-6 py-5 border-b border-gray-100">
//                 <h2 className="gal-serif font-bold text-2xl text-gray-900">{activeAlbum.title}</h2>
//                 <div className="flex items-center gap-4 gal-sans text-sm text-gray-400 mt-1.5">
//                   {activeAlbum.eventDate && (
//                     <span className="flex items-center gap-1.5">
//                       <Calendar className="h-3.5 w-3.5" style={{ color: GOLD }} />
//                       {new Date(activeAlbum.eventDate).toLocaleDateString("en-GB", {
//                         day: "numeric", month: "long", year: "numeric",
//                       })}
//                     </span>
//                   )}
//                   <span className="flex items-center gap-1.5">
//                     <Images className="h-3.5 w-3.5" style={{ color: GOLD }} />
//                     {activePhotos.length} photos
//                   </span>
//                 </div>
//               </div>

//               {/* Photo grid */}
//               <div className="flex-1 overflow-y-auto p-5">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                   {activePhotos.map((photo, i) => (
//                     <div key={photo._id} className="fade-in" style={{ animationDelay: `${i * 60}ms` }}>
//                       <div
//                         onClick={() => setLightboxIdx(i)}
//                         className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 aspect-[4/3]"
//                       >
//                         <img
//                           src={photo.url}
//                           alt={photo.caption || ""}
//                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                         />
//                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
//                           <ZoomIn className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           ) : null}
//         </div>
//       </div>

//       {/* Lightbox at z-9999 — above everything */}
//       {lightboxIdx !== null && (
//         <Lightbox
//           photos={activePhotos}
//           startIndex={lightboxIdx}
//           onClose={() => setLightboxIdx(null)}
//         />
//       )}
//     </>,
//     document.body
//   );
// };

// /* ══════════════════════════════════════════════
//    UPLOAD MODAL (no lightbox inside — DialogContent is fine)
// ══════════════════════════════════════════════ */
// const UploadModal = ({ open, onClose }) => {
//   const dispatch = useDispatch();
//   const { loading, submitSuccess, error } = useSelector((s) => s.gallery);

//   const [title, setTitle]             = useState("");
//   const [description, setDescription] = useState("");
//   const [eventDate, setEventDate]     = useState("");
//   const [files, setFiles]             = useState([]);
//   const [previews, setPreviews]       = useState([]);
//   const [dragging, setDragging]       = useState(false);

//   useEffect(() => {
//     if (submitSuccess) {
//       toast.success("Album submitted! It'll go live once approved by admin.");
//       dispatch(clearSubmitState());
//       onClose(); reset();
//     }
//   }, [submitSuccess]);

//   useEffect(() => { if (error) toast.error(error); }, [error]);

//   const reset = () => {
//     setTitle(""); setDescription(""); setEventDate(""); setFiles([]); setPreviews([]);
//   };

//   const handleFiles = (newFiles) => {
//     const incoming = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
//     setFiles((prev) =>
//       [...prev, ...incoming]
//         .filter((f, i, s) => i === s.findIndex((x) => x.name === f.name && x.size === f.size))
//         .slice(0, 50)
//     );
//     setPreviews((prev) => [...prev, ...incoming.map((f) => URL.createObjectURL(f))].slice(0, 50));
//   };

//   const handleSubmit = () => {
//     if (!title.trim()) return toast.error("Please add a title");
//     if (!files.length) return toast.error("Please select at least one photo");
//     const fd = new FormData();
//     fd.append("title", title.trim());
//     fd.append("description", description.trim());
//     if (eventDate) fd.append("eventDate", eventDate);
//     files.forEach((f) => fd.append("photos", f));
//     dispatch(submitAlbum(fd));
//   };

//   return (
//     <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
//       <DialogContent className="max-w-xl p-0 gap-0 rounded-2xl border-0 overflow-hidden max-h-[90vh] flex flex-col
//         [&>button]:top-4 [&>button]:right-4 [&>button]:z-20 [&>button]:rounded-full [&>button]:w-9 [&>button]:h-9 [&>button]:bg-gray-100">

//         <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
//           <h2 className="gal-serif font-bold text-xl text-gray-900">Share Your Photos</h2>
//           <p className="gal-sans text-sm text-gray-400 mt-1">Upload a folder of photos — admin will review and publish them.</p>
//         </div>

//         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 gal-sans">
//           <div>
//             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
//               Album Title <span className="text-red-400">*</span>
//             </label>
//             <input value={title} onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g. Annual Sports Day 2024"
//               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition" />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Event Date</label>
//             <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
//               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition" />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
//             <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
//               placeholder="Brief description…"
//               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition resize-none" />
//           </div>

//           <div>
//             <div className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
//               Photos <span className="text-red-400">*</span>{" "}
//               <span className="normal-case font-normal text-gray-400">(max 50)</span>
//             </div>
//             <label
//               className={`drop-zone rounded-2xl p-6 text-center cursor-pointer block relative ${dragging ? "active" : "border-gray-200"}`}
//               onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
//               onDragLeave={() => setDragging(false)}
//               onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
//             >
//               <input type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
//               <ImagePlus className="h-8 w-8 mx-auto mb-2 text-gray-300 pointer-events-none" />
//               <p className="text-sm text-gray-500 pointer-events-none">
//                 Drop photos here or <span className="font-semibold" style={{ color: GOLD }}>browse</span>
//               </p>
//               <p className="text-xs text-gray-400 mt-1 pointer-events-none">JPG, PNG, WebP — up to 50 images</p>
//             </label>

//             <p className="text-xs text-white p-3 rounded-xl mt-1 bg-green-400">
//               Hold <span className="font-medium">Ctrl</span> (or <span className="font-medium">Cmd</span> on Mac)
//               or <span className="font-medium">Shift</span> to select multiple files
//             </p>

//             {previews.length > 0 && (
//               <div className="mt-3">
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="text-xs text-gray-400">{files.length} photo{files.length !== 1 ? "s" : ""} selected</p>
//                   <button onClick={() => { setFiles([]); setPreviews([]); }}
//                     className="text-xs text-red-400 hover:text-red-600 transition">Clear all</button>
//                 </div>
//                 <div className="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto">
//                   {previews.slice(0, 20).map((url, i) => (
//                     <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
//                       <img src={url} alt="" className="w-full h-full object-cover" />
//                       <button
//                         onClick={() => {
//                           setFiles((prev) => prev.filter((_, di) => di !== i));
//                           setPreviews((prev) => prev.filter((_, di) => di !== i));
//                         }}
//                         className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ))}
//                   {files.length > 20 && (
//                     <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">
//                       +{files.length - 20}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
//             <Clock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
//             <p className="text-xs text-amber-700 leading-relaxed">
//               Your album will be reviewed by admin before going live. You'll be able to track the status in <strong>My Uploads</strong>.
//             </p>
//           </div>
//         </div>

//         <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
//           <button onClick={() => { onClose(); reset(); }}
//             className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 transition gal-sans">
//             Cancel
//           </button>
//           <button onClick={handleSubmit} disabled={loading.submit}
//             className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 gal-sans"
//             style={{ background: NAVY, color: "#fff" }}>
//             {loading.submit
//               ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
//               : <><Upload className="h-4 w-4" /> Submit Album</>}
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// /* ══════════════════════════════════════════════
//    MY UPLOADS DIALOG
// ══════════════════════════════════════════════ */
// const MyUploadsDialog = ({ open, onClose }) => {
//   const dispatch = useDispatch();
//   const { myAlbums, loading } = useSelector((s) => s.gallery);

//   useEffect(() => { if (open) dispatch(fetchMyAlbums()); }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
//       <DialogContent className="max-w-lg p-0 gap-0 rounded-2xl border-0 overflow-hidden max-h-[80vh] flex flex-col
//         [&>button]:top-4 [&>button]:right-4 [&>button]:z-20 [&>button]:rounded-full [&>button]:w-9 [&>button]:h-9 [&>button]:bg-gray-100">

//         <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
//           <h2 className="gal-serif font-bold text-xl text-gray-900">My Uploads</h2>
//           <p className="gal-sans text-sm text-gray-400 mt-1">Track your submitted photo albums</p>
//         </div>

//         <div className="flex-1 overflow-y-auto px-4 py-4 gal-sans">
//           {loading.mine ? (
//             <div className="flex items-center justify-center py-16">
//               <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
//             </div>
//           ) : myAlbums.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <FolderOpen className="h-10 w-10 text-gray-200 mb-3" />
//               <p className="text-sm text-gray-400">You haven't submitted any albums yet.</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {myAlbums.map((album) => {
//                 const sc = statusConfig[album.status] || statusConfig.pending;
//                 const Icon = sc.icon;
//                 return (
//                   <div key={album._id} className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-white">
//                     <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
//                       {album.coverImage?.url
//                         ? <img src={album.coverImage.url} alt="" className="w-full h-full object-cover" />
//                         : <div className="w-full h-full flex items-center justify-center"><Images className="h-5 w-5 text-gray-300" /></div>}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-gray-800 truncate">{album.title}</p>
//                       <p className="text-xs text-gray-400">{album.photoCount} photos · {fmtDate(album.createdAt)}</p>
//                       {album.rejectionReason && (
//                         <p className="text-xs text-red-400 mt-0.5 truncate">{album.rejectionReason}</p>
//                       )}
//                     </div>
//                     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${sc.color}`}>
//                       <Icon className="h-3 w-3" />
//                       {sc.label}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// /* ══════════════════════════════════════════════
//    MAIN GALLERY PAGE
// ══════════════════════════════════════════════ */
// const UserGallery = () => {
//   const dispatch = useDispatch();
//   const { albums, pagination, loading } = useSelector((s) => s.gallery);
//   const [searchParams, setSearchParams] = useSearchParams();

//   const pageFromUrl = parseInt(searchParams.get("page")) || 1;

//   const [searchInput, setSearchInput] = useState("");
//   const [searchText, setSearchText]   = useState("");

//   const debounceRef  = useRef(null);
//   const prevPageRef  = useRef(pageFromUrl);
//   const listRef      = useRef(null);

//   const [albumOpen,     setAlbumOpen]     = useState(false);
//   const [uploadOpen,    setUploadOpen]    = useState(false);
//   const [myUploadsOpen, setMyUploadsOpen] = useState(false);

//   useEffect(() => {
//     const params = { page: pageFromUrl, limit: 12 };
//     if (searchText) params.search = searchText;
//     dispatch(fetchApprovedAlbums(params));
//   }, [searchText, pageFromUrl, dispatch]);

//   const handleSearchChange = useCallback((e) => {
//     const value = e.target.value;
//     setSearchInput(value);
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       setSearchText(value.trim());
//       setSearchParams((prev) => { const p = new URLSearchParams(prev); p.set("page", "1"); return p; });
//     }, 500);
//   }, [setSearchParams]);

//   useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

//   useEffect(() => {
//     if (loading.albums) return;
//     if (prevPageRef.current !== pageFromUrl) {
//       prevPageRef.current = pageFromUrl;
//       setTimeout(() => {
//         if (!listRef.current) return;
//         window.scrollTo({ top: listRef.current.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
//       }, 300);
//     }
//   }, [loading.albums, pageFromUrl]);

//   const onPageChange = (page) => {
//     setSearchParams((prev) => { const p = new URLSearchParams(prev); p.set("page", String(page)); return p; });
//   };

//   const clearSearch = () => {
//     setSearchInput(""); setSearchText("");
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//   };

//   const openAlbum = (id) => {
//     dispatch(fetchAlbumPhotos(id));
//     setAlbumOpen(true);
//   };

//   return (
//     <>
//       <style>{globalStyle}</style>
//       <FontLink />

//       <div className="min-h-screen gal-sans" style={{ background: "#F8F7F4" }}>

//         {/* Header */}
//         <div style={{ background: NAVY }}>
//           <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
//             <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
//                   Alumni Network
//                 </p>
//                 <h1 className="gal-serif font-extrabold text-white text-3xl sm:text-4xl leading-tight">
//                   Photo Gallery
//                 </h1>
//                 <p className="text-sm text-white/40 mt-1.5">Memories from our community events</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button onClick={() => setMyUploadsOpen(true)}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white/70 hover:bg-white/15 transition">
//                   <FolderOpen className="h-4 w-4" />
//                   <span className="hidden sm:inline">My Uploads</span>
//                 </button>
//                 <button onClick={() => setUploadOpen(true)}
//                   className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
//                   style={{ background: GOLD }}>
//                   <Upload className="h-4 w-4" />
//                   Share Photos
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 max-w-md">
//               <Search className="h-4 w-4 text-white/30 flex-shrink-0" />
//               <input
//                 value={searchInput}
//                 onChange={handleSearchChange}
//                 placeholder="Search albums…"
//                 className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
//               />
//               {searchInput && (
//                 <button onClick={clearSearch}>
//                   <X className="h-3.5 w-3.5 text-white/40 hover:text-white transition" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div ref={listRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

//           {!loading.albums && albums.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-24 text-center">
//               <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
//                 style={{ background: `${NAVY}08` }}>
//                 <Images className="h-8 w-8 text-gray-300" />
//               </div>
//               <h3 className="gal-serif text-xl font-bold text-gray-700 mb-2">No albums yet</h3>
//               <p className="text-sm text-gray-400 max-w-xs">
//                 {searchText ? `No albums found for "${searchText}".` : "Be the first to share your photos!"}
//               </p>
//               {searchText && (
//                 <button onClick={clearSearch}
//                   className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
//                   style={{ background: NAVY }}>
//                   Clear search
//                 </button>
//               )}
//             </div>
//           )}

//           {albums.length > 0 && (
//             <div className={`transition-opacity duration-300 ${loading.albums ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
//                 {albums.map((album) => (
//                   <AlbumCard key={album._id} album={album} onClick={openAlbum} />
//                 ))}
//               </div>

//               {pagination.pages > 1 && (
//                 <div className="mx-auto my-10 max-w-6xl px-4 md:px-6">
//                   <PaginationControls
//                     currentPage={pageFromUrl}
//                     totalPages={pagination.pages}
//                     onPageChange={onPageChange}
//                   />
//                 </div>
//               )}
//             </div>
//           )}

//           {loading.albums && (
//             <div className="flex justify-center py-8">
//               <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-amber-400" />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Pure portal — zero Radix interference */}
//       <AlbumPanel open={albumOpen} onClose={() => setAlbumOpen(false)} />

//       {/* These have no lightbox inside so DialogContent is fine */}
//       <UploadModal     open={uploadOpen}    onClose={() => setUploadOpen(false)} />
//       <MyUploadsDialog open={myUploadsOpen} onClose={() => setMyUploadsOpen(false)} />
//     </>
//   );
// };

// export default UserGallery;