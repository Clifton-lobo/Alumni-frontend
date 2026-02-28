import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNews,
  fetchNewsStats,
  fetchNewsById,
  createNews,
  updateNews,
  togglePublish,
  deleteNews,
  clearSelectedNews,
} from "../../../store/admin/AdminNewsSlice";

import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff, X,
  ImagePlus, Loader2, ChevronLeft, ChevronRight,
  Newspaper, Tag, Calendar, CheckCircle, Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";

/* ─── Design tokens ─── */
const NAVY = "#142A5D";
const GOLD = "#EBAB09";

const CATEGORIES = [
  { value: "announcement",     label: "Announcement"    },
  { value: "achievement",      label: "Achievement"     },
  { value: "event",            label: "Event"           },
  { value: "general",          label: "General"         },
  { value: "alumni-spotlight", label: "Alumni Spotlight" },
];

const CATEGORY_COLORS = {
  announcement:      "bg-blue-50 text-blue-700 border-blue-200",
  achievement:       "bg-green-50 text-green-700 border-green-200",
  event:             "bg-purple-50 text-purple-700 border-purple-200",
  general:           "bg-gray-50 text-gray-600 border-gray-200",
  "alumni-spotlight":"bg-amber-50 text-amber-700 border-amber-200",
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

/* ══════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════ */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
    <div
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}15` }}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color }} />
    </div>
    <div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   IMAGE UPLOADER  (pure UI, no Redux needed)
══════════════════════════════════════════════ */
const ImageUploader = ({ preview, onChange, onRemove }) => {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) { toast.error("Images only"); return; }
    if (file.size > 5 * 1024 * 1024)     { toast.error("Max 5MB");     return; }
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cover Image</label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-[16/6]">
          <img src={preview} alt="cover" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
            ${dragging
              ? "border-[#EBAB09] bg-amber-50"
              : "border-gray-200 hover:border-[#EBAB09] hover:bg-gray-50"}`}
        >
          <ImagePlus className="h-7 w-7 sm:h-8 sm:w-8 text-gray-300" />
          <p className="text-sm text-gray-500 text-center">
            Drop an image or <span className="text-[#EBAB09] font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

/* ══════════════════════════════════════════════
   TAG INPUT  (pure UI)
══════════════════════════════════════════════ */
const TagInput = ({ tags, onChange }) => {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim().toLowerCase();
    if (val && !tags.includes(val) && tags.length < 8) {
      onChange([...tags, val]);
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tags</label>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50 min-h-[52px]">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#142A5D] text-white"
          >
            #{t}
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="hover:text-[#EBAB09] transition"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          }}
          placeholder={tags.length < 8 ? "Add tag + Enter" : "Max 8 tags"}
          disabled={tags.length >= 8}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder-gray-400 text-gray-800"
        />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   NEWS FORM SHEET  (Redux-connected)
══════════════════════════════════════════════ */
const NewsSheet = ({ open, onClose, editNews, onSaved }) => {
  const dispatch = useDispatch();
  const { saving } = useSelector((s) => s.Adminnews);

  const BLANK = {
    title: "", content: "", excerpt: "",
    category: "general", tags: [], isPublished: false,
  };

  const [form, setForm]               = useState(BLANK);
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors]           = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editNews) {
      setForm({
        title:       editNews.title       || "",
        content:     editNews.content     || "",
        excerpt:     editNews.excerpt     || "",
        category:    editNews.category    || "general",
        tags:        editNews.tags        || [],
        isPublished: editNews.isPublished || false,
      });
      setImagePreview(editNews.coverImage?.url || null);
      setImageFile(null);
    } else {
      setForm(BLANK);
      setImageFile(null);
      setImagePreview(null);
    }
    setErrors({});
  }, [editNews, open]);

  const update = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()   || form.title.trim().length   < 5)  e.title   = "Title must be at least 5 characters";
    if (!form.content.trim() || form.content.trim().length < 20) e.content = "Content must be at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const fd = new FormData();
    fd.append("title",       form.title.trim());
    fd.append("content",     form.content.trim());
    fd.append("excerpt",     form.excerpt.trim());
    fd.append("category",    form.category);
    fd.append("tags",        JSON.stringify(form.tags));
    fd.append("isPublished", form.isPublished);
    if (imageFile) fd.append("coverImage", imageFile);

    let result;
    if (editNews) {
      result = await dispatch(updateNews({ id: editNews._id, formData: fd }));
    } else {
      result = await dispatch(createNews(fd));
    }

    const isSuccess = editNews
      ? updateNews.fulfilled.match(result)
      : createNews.fulfilled.match(result);

    if (isSuccess) {
      toast.success(editNews ? "News updated!" : "News created!");
      onSaved();
      onClose();
    } else {
      toast.error(result.payload || "Failed to save article");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] p-0 flex flex-col h-full [&>button]:hidden"
      >
        {/* Header */}
        <SheetHeader
          className="px-4 py-4 sm:px-6 sm:py-5 flex-shrink-0 space-y-0"
          style={{ background: `linear-gradient(135deg, ${NAVY}, #1e3d7a)` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-base sm:text-lg font-bold text-white text-left leading-snug">
                {editNews ? "Edit Article" : "Create News Article"}
              </SheetTitle>
              <p className="text-xs text-blue-200 mt-0.5">
                {editNews ? "Update the article details" : "Write and publish a new news article"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center mt-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-5">

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Title *</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Enter a compelling headline..."
              className={`w-full h-11 px-4 rounded-xl border text-sm text-gray-800 outline-none transition
                ${errors.title
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-gray-50 focus:border-[#EBAB09] focus:bg-white"}`}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => update("category", c.value)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold border transition-all
                    ${form.category === c.value
                      ? "bg-[#142A5D] text-white border-[#142A5D]"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#EBAB09]"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <ImageUploader
            preview={imagePreview}
            onChange={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }}
            onRemove={() => { setImageFile(null); setImagePreview(null); }}
          />

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Content *</label>
            <textarea
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Write the full article content here..."
              rows={8}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800 outline-none transition resize-none leading-relaxed
                ${errors.content
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-gray-50 focus:border-[#EBAB09] focus:bg-white"}`}
            />
            {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
            <p className="text-xs text-gray-400 text-right">{form.content.length} characters</p>
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Excerpt{" "}
              <span className="font-normal text-gray-400">(auto-generated if blank)</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="Short summary shown in news listings..."
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-[#EBAB09] focus:bg-white transition resize-none"
            />
          </div>

          {/* Tags */}
          <TagInput tags={form.tags} onChange={(t) => update("tags", t)} />

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-800">Publish immediately</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {form.isPublished
                  ? "Visible to all users right now"
                  : "Save as draft — not visible to users"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => update("isPublished", !form.isPublished)}
              className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-200 ${
                form.isPublished ? "bg-[#EBAB09]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                  form.isPublished ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 sm:px-6 border-t border-gray-100 flex gap-3 bg-white flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-black flex items-center justify-center gap-2 transition disabled:opacity-50"
            style={{ background: GOLD }}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving
              ? "Saving..."
              : editNews
              ? "Save Changes"
              : form.isPublished
              ? "Publish Now"
              : "Save as Draft"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/* ══════════════════════════════════════════════
   DELETE CONFIRM  (pure UI)
══════════════════════════════════════════════ */
const DeleteConfirm = ({ news, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 className="h-5 w-5 text-red-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 text-center">Delete Article?</h3>
      <p className="text-sm text-gray-500 text-center mt-1 mb-5">
        "
        <span className="font-medium text-gray-700">
          {news?.title?.substring(0, 50)}{news?.title?.length > 50 ? "..." : ""}
        </span>
        " will be permanently deleted.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   PAGINATION  (pure UI)
══════════════════════════════════════════════ */
const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total, limit } = pagination;
  if (!pages || pages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 sm:mt-6 px-1">
      <p className="text-sm text-gray-400 order-2 sm:order-1">
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
              p === page
                ? "bg-[#EBAB09] text-black"
                : "bg-[#1e2d4d] text-white hover:bg-[#EBAB09] hover:text-black"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN PAGE  (Redux-connected)
══════════════════════════════════════════════ */
const NewsLetter = () => {
  const dispatch = useDispatch();
  const {
    newsList, pagination, stats,
    loading, togglingId, deleting,
    selectedNews, selectedLoading,
  } = useSelector((s) => s.Adminnews);

  // Local UI state — filter values and modal open states
  const [search, setSearch]           = useState("");
  const [filterCat, setFilterCat]     = useState("");
  const [filterPub, setFilterPub]     = useState("");
  const [sheetOpen, setSheetOpen]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ── Helpers ── */
  const load = (page = 1) =>
    dispatch(fetchNews({ page, search, category: filterCat, isPublished: filterPub }));

  /* ── Initial + filter-driven fetch ── */
  useEffect(() => { load(1); },           [filterCat, filterPub]); // eslint-disable-line
  useEffect(() => { dispatch(fetchNewsStats()); }, [dispatch]);

  /* ── Search (on Enter or button click) ── */
  const handleSearch = (e) => { e.preventDefault(); load(1); };

  /* ── Toggle publish ── */
  const handleTogglePublish = async (news) => {
    const result = await dispatch(togglePublish(news._id));
    if (togglePublish.fulfilled.match(result)) {
      toast.success(result.payload.isPublished ? "Published!" : "Moved to drafts");
      dispatch(fetchNewsStats());
    } else {
      toast.error(result.payload || "Failed to toggle publish status");
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteNews(deleteTarget._id));
    if (deleteNews.fulfilled.match(result)) {
      toast.success("Article deleted");
      setDeleteTarget(null);
      dispatch(fetchNewsStats());
      // If we just deleted the last item on this page, go back one page
      const remaining = newsList.length - 1;
      const targetPage = remaining === 0 && pagination.page > 1
        ? pagination.page - 1
        : pagination.page;
      load(targetPage);
    } else {
      toast.error(result.payload || "Failed to delete");
    }
  };

  /* ── Open edit sheet — fetch full article first ── */
  const openEdit = async (news) => {
    const result = await dispatch(fetchNewsById(news._id));
    if (fetchNewsById.fulfilled.match(result)) {
      setSheetOpen(true);
    } else {
      toast.error(result.payload || "Failed to load article");
    }
  };

  /* ── After save ── */
  const handleSaved = () => {
    load(pagination.page);
    dispatch(fetchNewsStats());
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    dispatch(clearSelectedNews());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* Page Header */}
      <div className="mb-5 sm:mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl flex-shrink-0" style={{ background: NAVY }}>
              <Newspaper className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: GOLD }} />
            </div>
            News Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-11 sm:ml-12">
            Create and manage news articles for alumni
          </p>
        </div>
        <button
          onClick={() => { dispatch(clearSelectedNews()); setSheetOpen(true); }}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
          style={{ background: GOLD }}
        >
          <Plus className="h-4 w-4" />
          New Article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <StatCard icon={Newspaper}   label="Total Articles" value={stats.total}     color={NAVY}      />
        <StatCard icon={CheckCircle} label="Published"       value={stats.published} color="#16a34a"   />
        <StatCard icon={Clock}       label="Drafts"          value={stats.drafts}    color="#d97706"   />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 mb-4 sm:mb-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full sm:flex-1 sm:min-w-[200px]"
        >
          <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-80 whitespace-nowrap"
            style={{ background: GOLD }}
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filterPub}
          onChange={(e) => setFilterPub(e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Drafts</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : newsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Newspaper className="h-6 w-6 sm:h-7 sm:w-7 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No articles found</p>
              <p className="text-gray-400 text-sm mt-1">
                Create your first news article to get started.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3.5">Article</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {newsList.map((news) => (
                  <tr key={news._id} className="hover:bg-gray-50/50 transition-colors">

                    {/* Article */}
                    <td className="px-4 sm:px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {news.coverImage?.url ? (
                          <img
                            src={news.coverImage.url}
                            alt=""
                            className="w-10 h-9 sm:w-12 sm:h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-9 sm:w-12 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Newspaper className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-[280px]">
                            {news.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px] sm:max-w-[280px] mt-0.5">
                            {news.excerpt || "No excerpt"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          CATEGORY_COLORS[news.category] || CATEGORY_COLORS.general
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        {CATEGORIES.find((c) => c.value === news.category)?.label || news.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 text-gray-300" />
                        {news.isPublished && news.publishedAt ? (
                          formatDate(news.publishedAt)
                        ) : (
                          <span className="text-gray-400 italic">Not published</span>
                        )}
                      </div>
                    </td>

                    {/* Status (clickable toggle) */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleTogglePublish(news)}
                        disabled={togglingId === news._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                          ${news.isPublished
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                          }`}
                        title={news.isPublished ? "Click to unpublish" : "Click to publish"}
                      >
                        {togglingId === news._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : news.isPublished ? (
                          <><Eye className="h-3 w-3" /><span className="hidden sm:inline">Published</span></>
                        ) : (
                          <><EyeOff className="h-3 w-3" /><span className="hidden sm:inline">Draft</span></>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 sm:px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(news)}
                          disabled={selectedLoading}
                          className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-[#142A5D] hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                          title="Edit"
                        >
                          {selectedLoading
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Edit2 className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(news)}
                          disabled={deleting === news._id}
                          className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === news._id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {!loading && newsList.length > 0 && (
        <Pagination pagination={pagination} onPageChange={load} />
      )}

      {/* Edit / Create sheet */}
      <NewsSheet
        open={sheetOpen}
        onClose={handleCloseSheet}
        editNews={selectedNews}
        onSaved={handleSaved}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          news={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting === deleteTarget._id}
        />
      )}
    </div>
  );
};

export default NewsLetter;