import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlbums,
  fetchAlbumPhotos,
  createAlbum,
  addPhotosToAlbum,
  approveAlbum,
  rejectAlbum,
  deleteAlbum,
  deletePhoto,
  setAlbumCover,
  mergeAlbums,
  setStatusFilter,
  setSearch,
  clearAlbumPhotos,
} from "../../store/admin/AdminGallerySlice";

import {
  Images, Upload, CheckCircle, XCircle, Clock, Trash2,
  Loader2, Plus, Search, X, Calendar, Merge,
  ChevronLeft, ChevronRight, Star, FolderOpen, ImagePlus,
  Eye, ZoomIn,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

/* ─── Design tokens (match the rest of the admin) ─── */
const NAVY = "#142A5D";
const GOLD = "#EBAB09";

const STATUS = {
  all:      { label: "All",      color: "" },
  pending:  { label: "Pending",  color: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-600" },
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

/* ══════════════════════════════════════════════
   SHARED UI HELPERS
══════════════════════════════════════════════ */
const Skel = ({ className = "", style = {} }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} style={style} />
);

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  const icons = { pending: Clock, approved: CheckCircle, rejected: XCircle };
  const Icon = icons[status] || Clock;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${s.color}`}
    >
      <Icon className="h-3 w-3" /> {s.label}
    </span>
  );
};

/* ══════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════ */
const Lightbox = ({ photos, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, photos.length - 1));
      if (e.key === "ArrowLeft")  setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [photos.length, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const photo = photos[idx];
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.96)" }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40">
        {idx + 1} / {photos.length}
      </div>

      {idx > 0 && (
        <button
          onClick={() => setIdx((i) => i - 1)}
          className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
      )}

      <div className="max-w-5xl max-h-[85vh] w-full px-16 flex items-center justify-center">
        <img src={photo.url} alt="" className="max-w-full max-h-[85vh] object-contain rounded-xl" />
      </div>

      {idx < photos.length - 1 && (
        <button
          onClick={() => setIdx((i) => i + 1)}
          className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   ALBUM PHOTOS DIALOG  (Redux-connected)
══════════════════════════════════════════════ */
const AlbumPhotosDialog = ({ album, open, onClose }) => {
  const dispatch = useDispatch();
  const { albumPhotos, photosLoading, addingPhotos } = useSelector((s) => s.Admingallery);

  const [lightboxIdx, setLightboxIdx] = useState(null);
  const fileRef = useRef(null);

  // Load photos whenever the dialog opens for a different album
  useEffect(() => {
    if (open && album) {
      dispatch(fetchAlbumPhotos(album._id));
    }
    return () => { if (!open) dispatch(clearAlbumPhotos()); };
  }, [open, album?._id, dispatch]);

  const handleAddPhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const fd = new FormData();
    files.forEach((f) => fd.append("photos", f));
    const result = await dispatch(addPhotosToAlbum({ albumId: album._id, formData: fd }));
    if (addPhotosToAlbum.fulfilled.match(result)) {
      toast.success("Photos added");
      dispatch(fetchAlbumPhotos(album._id));
      // Refresh parent list so photo count updates
      dispatch(fetchAlbums({ page: 1 }));
    } else {
      toast.error(result.payload || "Failed to add photos");
    }
  };

  const handleDelete = async (photoId) => {
    const result = await dispatch(deletePhoto(photoId));
    if (deletePhoto.fulfilled.match(result)) {
      toast.success("Photo deleted");
    } else {
      toast.error("Failed to delete photo");
    }
  };

  const handleSetCover = async (photoId) => {
    const result = await dispatch(setAlbumCover({ albumId: album._id, photoId }));
    if (setAlbumCover.fulfilled.match(result)) {
      toast.success("Cover updated");
      dispatch(fetchAlbums({ page: 1 }));
    } else {
      toast.error("Failed to update cover");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
        <DialogContent className="!w-[1300px] !max-w-[1300px] p-0 gap-0 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col border-0
          [&>button]:top-4 [&>button]:right-4 [&>button]:z-20 [&>button]:rounded-full [&>button]:w-9 [&>button]:h-9 [&>button]:bg-gray-100">

          <DialogHeader className="flex-shrink-0 px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">{album?.title}</DialogTitle>
                <p className="text-sm text-gray-400 mt-0.5">{albumPhotos.length} photos</p>
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={addingPhotos}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition hover:opacity-90"
                style={{ background: NAVY, color: "#fff" }}
              >
                {addingPhotos
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Plus className="h-3.5 w-3.5" />}
                Add Photos
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleAddPhotos}
              />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5">
            {photosLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {albumPhotos.map((photo, i) => (
                  <div
                    key={photo._id}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => setLightboxIdx(i)}
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSetCover(photo._id); }}
                        title="Set as cover"
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#EBAB09] flex items-center justify-center transition"
                      >
                        <Star className="h-3.5 w-3.5 text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(photo._id); }}
                        title="Delete"
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {lightboxIdx !== null && (
        <Lightbox
          photos={albumPhotos}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
};

/* ══════════════════════════════════════════════
   REJECT DIALOG  (Redux-connected)
══════════════════════════════════════════════ */
const RejectDialog = ({ album, open, onClose, currentPage }) => {
  const dispatch = useDispatch();
  const { rejecting } = useSelector((s) => s.Admingallery);
  const [reason, setReason] = useState("");

  const handle = async () => {
    const result = await dispatch(rejectAlbum({ albumId: album._id, reason }));
    if (rejectAlbum.fulfilled.match(result)) {
      toast.success("Album rejected");
      dispatch(fetchAlbums({ page: currentPage }));
      onClose();
      setReason("");
    } else {
      toast.error(result.payload || "Failed to reject album");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setReason(""); } }}>
      <DialogContent className="max-w-sm rounded-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900">Reject Album</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 -mt-2">
          Rejecting: <strong className="text-gray-700">{album?.title}</strong>
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Reason for rejection (optional)…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-300 resize-none mt-1"
        />
        <div className="flex items-center justify-end gap-3 mt-1">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={rejecting}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition flex items-center gap-2"
          >
            {rejecting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Reject
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ══════════════════════════════════════════════
   MERGE DIALOG  (Redux-connected)
══════════════════════════════════════════════ */
const MergeDialog = ({ selected, allAlbums, open, onClose, onMerged }) => {
  const dispatch = useDispatch();
  const { merging } = useSelector((s) => s.Admingallery);
  const [title, setTitle] = useState("");

  const handle = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (selected.length < 2) return toast.error("Select at least 2 albums to merge");
    const result = await dispatch(mergeAlbums({ albumIds: selected, title: title.trim() }));
    if (mergeAlbums.fulfilled.match(result)) {
      toast.success(`${selected.length} albums merged successfully`);
      onMerged();
      onClose();
      setTitle("");
    } else {
      toast.error(result.payload || "Merge failed");
    }
  };

  const selectedAlbums = allAlbums.filter((a) => selected.includes(a._id));

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setTitle(""); } }}>
      <DialogContent className="max-w-md rounded-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Merge className="h-4 w-4" /> Merge {selected.length} Albums
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-36 overflow-y-auto">
          {selectedAlbums.map((a) => (
            <div key={a._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                {a.coverImage?.url && (
                  <img src={a.coverImage.url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">{a.title}</p>
                <p className="text-[10px] text-gray-400">{a.photoCount} photos</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            New Album Title <span className="text-red-400">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Annual Sports Day 2024"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition"
          />
        </div>

        <p className="text-xs text-amber-600 bg-amber-50 rounded-xl p-3 border border-amber-100">
          All photos from the selected albums will be moved into the new merged album. The original albums will be deleted.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={merging}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition flex items-center gap-2"
            style={{ background: NAVY }}
          >
            {merging && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Merge Albums
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ══════════════════════════════════════════════
   UPLOAD SHEET  (Redux-connected)
══════════════════════════════════════════════ */
const UploadSheet = ({ open, onClose, onCreated }) => {
  const dispatch = useDispatch();
  const { creating } = useSelector((s) => s.Admingallery);

  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate]   = useState("");
  const [files, setFiles]           = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [dragging, setDragging]     = useState(false);
  const fileRef = useRef(null);

  const reset = () => {
    setTitle(""); setDescription(""); setEventDate(""); setFiles([]); setPreviews([]);
  };

  const handleFiles = (newFiles) => {
    const imgs = Array.from(newFiles).filter((f) => f.type.startsWith("image/")).slice(0, 50);
    setFiles(imgs);
    setPreviews(imgs.map((f) => URL.createObjectURL(f)));
  };

  const handle = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!files.length)  return toast.error("Upload at least one photo");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    if (eventDate) fd.append("eventDate", eventDate);
    files.forEach((f) => fd.append("photos", f));

    const result = await dispatch(createAlbum(fd));
    if (createAlbum.fulfilled.match(result)) {
      toast.success("Album created and published!");
      onCreated();
      onClose();
      reset();
    } else {
      toast.error(result.payload || "Failed to create album");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] p-0 flex flex-col gap-0">

        {/* Header */}
        <div
          className="flex-shrink-0 px-6 py-5 border-b border-gray-100"
          style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3560)` }}
        >
          <SheetTitle className="text-white font-bold text-lg flex items-center gap-2">
            <ImagePlus className="h-5 w-5" style={{ color: GOLD }} />
            Create Album
          </SheetTitle>
          <p className="text-white/40 text-xs mt-1">
            Admin uploads are auto-approved and go live immediately.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Album Title <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Gala 2024"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition"
            />
          </div>

          {/* Event date */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Event Date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of the event…"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#EBAB09] focus:ring-2 focus:ring-[#EBAB09]/20 transition resize-none"
            />
          </div>

          {/* Drop zone */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Photos <span className="text-red-400">*</span>
            </label>
            <div
              className={`rounded-2xl border-2 p-6 text-center cursor-pointer transition-all
                ${dragging
                  ? "border-[#EBAB09] bg-amber-50"
                  : "border-dashed border-gray-200 hover:border-gray-300"}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Images className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">
                Drop photos or{" "}
                <span className="font-semibold" style={{ color: GOLD }}>click to browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Up to 50 images · First image becomes cover</p>
            </div>

            {previews.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">
                  {files.length} photo{files.length !== 1 ? "s" : ""} selected
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {previews.slice(0, 18).map((url, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {previews.length > 18 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-bold">
                      +{previews.length - 18}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={() => { onClose(); reset(); }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={creating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition hover:opacity-90"
            style={{ background: NAVY }}
          >
            {creating
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
              : <><Plus className="h-4 w-4" /> Create Album</>}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/* ══════════════════════════════════════════════
   MAIN ADMIN GALLERY PAGE  (Redux-connected)
══════════════════════════════════════════════ */
const Gallery = () => {
  const dispatch = useDispatch();
  const {
    albums, pagination, pendingCount,
    loading, approving, deleting,
    statusFilter, search,
  } = useSelector((s) => s.Admingallery);

  // Local UI state — not worth putting in Redux
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected]       = useState([]);
  const [uploadOpen, setUploadOpen]   = useState(false);
  const [mergeOpen, setMergeOpen]     = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [viewAlbum, setViewAlbum]     = useState(null);

  /* ── Initial load + re-fetch on filter change ── */
  useEffect(() => {
    dispatch(fetchAlbums({ page: 1, status: statusFilter, search }));
    setSelected([]);
  }, [statusFilter, search, dispatch]);

  const load = useCallback(
    (page = 1) => {
      dispatch(fetchAlbums({ page, status: statusFilter, search }));
      setSelected([]);
    },
    [dispatch, statusFilter, search]
  );

  /* ── Approve ── */
  const handleApprove = async (album) => {
    const result = await dispatch(approveAlbum(album._id));
    if (approveAlbum.fulfilled.match(result)) {
      toast.success("Album approved and now live!");
    } else {
      toast.error(result.payload || "Failed to approve");
    }
  };

  /* ── Delete ── */
  const handleDelete = async (album) => {
    if (!window.confirm(`Delete "${album.title}" and all its photos?`)) return;
    const result = await dispatch(deleteAlbum(album._id));
    if (deleteAlbum.fulfilled.match(result)) {
      toast.success("Album deleted");
    } else {
      toast.error(result.payload || "Failed to delete");
    }
  };

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  /* ── Search: commit on Enter or clear ── */
  const commitSearch = () => dispatch(setSearch(searchInput.trim()));
  const clearSearch  = () => { setSearchInput(""); dispatch(setSearch("")); };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F7F6F3", fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-5  top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
              <Images className="h-5 w-5" style={{ color: NAVY }} />
              Gallery Management
            </h1>
            {pendingCount > 0 && (
              <p className="text-xs text-amber-600 font-medium mt-0.5 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {pendingCount} album{pendingCount !== 1 ? "s" : ""} awaiting review
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selected.length >= 2 && (
              <button
                onClick={() => setMergeOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border-2 border-dashed transition hover:opacity-80"
                style={{ borderColor: GOLD, color: NAVY }}
              >
                <Merge className="h-3.5 w-3.5" />
                Merge {selected.length}
              </button>
            )}
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: NAVY }}
            >
              <Plus className="h-4 w-4" /> Create Album
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Filters row ── */}
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1">
            {Object.entries(STATUS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => dispatch(setStatusFilter(key))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === key ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                style={statusFilter === key ? { background: NAVY } : {}}
              >
                {val.label}
                {key === "pending" && pendingCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] font-bold flex items-center justify-center">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitSearch(); }}
              placeholder="Search albums…"
              className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
            />
            {searchInput && (
              <button onClick={clearSearch}>
                <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Selection info */}
          {selected.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-700">
              <CheckCircle className="h-3.5 w-3.5" />
              {selected.length} selected
              <button onClick={() => setSelected([])}>
                <X className="h-3 w-3 hover:text-amber-900" />
              </button>
            </div>
          )}
        </div>

        {/* ── Album grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <Skel style={{ aspectRatio: "4/3", borderRadius: 0 }} />
                <div className="p-4 space-y-2">
                  <Skel style={{ height: 14, width: "70%", borderRadius: 4 }} />
                  <Skel style={{ height: 12, width: "40%", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FolderOpen className="h-10 w-10 text-gray-200 mb-3" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              {statusFilter === "pending" ? "No pending submissions" : "No albums found"}
            </h3>
            <p className="text-sm text-gray-400">
              {statusFilter === "pending"
                ? "All user submissions have been reviewed."
                : "Create your first album to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {albums.map((album) => {
                const isSelected = selected.includes(album._id);
                return (
                  <div
                    key={album._id}
                    onDoubleClick={() => toggleSelect(album._id)}
                    className={`group relative bg-white rounded-2xl border overflow-hidden transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#EBAB09] ring-2 ring-[#EBAB09]/30"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {/* Select checkbox */}
                    <div className="absolute top-3 left-3 z-10">
                      <button
                        onClick={() => toggleSelect(album._id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#EBAB09] bg-[#EBAB09]"
                            : "border-white/60 bg-black/20 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isSelected && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                      </button>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <StatusBadge status={album.status} />
                    </div>

                    {/* Cover image */}
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {album.coverImage?.url ? (
                        <img
                          src={album.coverImage.url}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${NAVY}15, ${GOLD}20)` }}
                        >
                          <Images className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-0.5">
                        {album.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Images className="h-3 w-3" /> {album.photoCount} photos
                        </span>
                        {album.eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {fmtDate(album.eventDate)}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        by {album.uploadedBy?.name} · {fmtDate(album.createdAt)}
                      </p>
                    </div>

                    {/* Action bar */}
                    <div className="px-4 pb-4 flex items-center gap-1.5 flex-wrap">
                      {/* View photos */}
                      <button
                        onClick={() => setViewAlbum(album)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      >
                        <Eye className="h-3.5 w-3.5" /> Photos
                      </button>

                      {/* Approve */}
                      {album.status !== "approved" && (
                        <button
                          onClick={() => handleApprove(album)}
                          disabled={approving === album._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition"
                        >
                          {approving === album._id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <CheckCircle className="h-3.5 w-3.5" />}
                          Approve
                        </button>
                      )}

                      {/* Reject */}
                      {album.status !== "rejected" && (
                        <button
                          onClick={() => setRejectTarget(album)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(album)}
                        disabled={deleting === album._id}
                        className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40 transition"
                      >
                        {deleting === album._id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => load(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 transition"
                  style={{ background: NAVY, color: "#fff" }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-500 px-3">
                  {pagination.page} / {pagination.pages}
                </span>
                <button
                  onClick={() => load(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 transition"
                  style={{ background: NAVY, color: "#fff" }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Overlays ── */}
      <UploadSheet
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onCreated={() => load(1)}
      />
      <MergeDialog
        selected={selected}
        allAlbums={albums}
        open={mergeOpen}
        onClose={() => setMergeOpen(false)}
        onMerged={() => { load(1); setSelected([]); }}
      />
      <RejectDialog
        album={rejectTarget}
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        currentPage={pagination.page}
      />
      <AlbumPhotosDialog
        album={viewAlbum}
        open={!!viewAlbum}
        onClose={() => setViewAlbum(null)}
      />
    </div>
  );
};

export default Gallery;