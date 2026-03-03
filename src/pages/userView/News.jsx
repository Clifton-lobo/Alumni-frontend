import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicNews,
  fetchNewsById,
  clearArticle,
} from "../../store/user-view/UserNewsSlice";
import {
  Search, X, Calendar, Eye, Tag, ChevronLeft, ChevronRight,
  Newspaper, ArrowUpRight, Clock, AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/* ─── Constants ─── */
const CATS = [
  { value: "", label: "All Stories" },
  { value: "announcement", label: "Announcement" },
  { value: "achievement", label: "Achievement" },
  { value: "event", label: "Event" },
  { value: "general", label: "General" },
  { value: "alumni-spotlight", label: "Spotlight" },
];

const NAVY = "#142A5D";
const GOLD = "#EBAB09";


const CAT_COLORS = {
  announcement: { bg: "bg-blue-500", text: "text-white", softBg: "bg-blue-500/10", softText: "text-blue-500" },
  achievement: { bg: "bg-emerald-500", text: "text-white", softBg: "bg-emerald-500/10", softText: "text-emerald-500" },
  event: { bg: "bg-violet-500", text: "text-white", softBg: "bg-violet-500/10", softText: "text-violet-500" },
  general: { bg: "bg-gray-500", text: "text-white", softBg: "bg-gray-500/10", softText: "text-gray-500" },
  "alumni-spotlight": { bg: "bg-amber-500", text: "text-white", softBg: "bg-amber-500/10", softText: "text-amber-500" },
};

const catLabel = (v) => CATS.find((c) => c.value === v)?.label || v;
const catColors = (v) => CAT_COLORS[v] || CAT_COLORS.general;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

const timeAgo = (d) => {
  if (!d) return "";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(d);
};

/* ══════════════════════════════════════════
   CAT PILL
══════════════════════════════════════════ */
const CatPill = ({ cat, dark = false }) => {
  const c = catColors(cat);
  return (
    <span className={`inline-block px-2.5 py-[3px] rounded-sm uppercase tracking-widest font-semibold text-[10px] font-sans
      ${dark ? `${c.softBg} ${c.softText}` : `${c.bg} ${c.text}`}`}>
      {catLabel(cat)}
    </span>
  );
};

/* ══════════════════════════════════════════
   SKELETON
══════════════════════════════════════════ */
const Skel = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

/* ══════════════════════════════════════════
   HERO CARD
══════════════════════════════════════════ */
const HeroCard = ({ article, onClick }) => (
  <div
    onClick={() => onClick(article._id)}
    className="relative w-full cursor-pointer overflow-hidden rounded-2xl min-h-[460px]
      transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
  >
    {/* BG image */}
    <div className="absolute inset-0 overflow-hidden">
      {article.coverImage?.url ? (
        <img
          src={article.coverImage.url}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
      )}
    </div>

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/10" />

    {/* Left gold bar */}
    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />

    {/* Content */}
    <div className="relative z-10 flex flex-col justify-end h-full min-h-[460px] p-6 sm:p-8 md:p-10">
      <div className="maxl">
        <div className="flex items-center gap-3 mb-4 animate-[fadeUp_0.5s_ease_both]">
          <CatPill cat={article.category} />
          <span className="text-xs text-white/40 flex items-center gap-1 font-sans">
            <Clock className="h-3 w-3" /> {timeAgo(article.publishedAt)}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] font-black text-white leading-[1.1] mb-4
          [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] animate-[fadeUp_0.5s_0.08s_ease_both]">
          {article.title}
        </h1>

        <p className="font-sans text-sm sm:text-base text-white/60 leading-relaxed mb-7 max-w-2xl line-clamp-2
          animate-[fadeUp_0.5s_0.16s_ease_both]">
          {article.excerpt}
        </p>

        <div className="flex w-full items-center justify-between  animate-[fadeUp_0.5s_0.16s_ease_both]">
          <span className="font-sans text-xs text-white/30 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" /> {article.viewCount || 0} views
          </span>
          <button className="flex flex-end items-center gap-2  justify-end font-sans text-sm font-semibold px-5 py-2.5 rounded-xl
            bg-amber-400 text-slate-900 transition-all hover:scale-105 active:scale-95">
            Read Story <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   PHOTO CARD
══════════════════════════════════════════ */
const PhotoCard = ({ article, onClick }) => (
  <div
    onClick={() => onClick(article._id)}
    className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100/80
      shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
  >
    {/* Image */}
    <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
      {article.coverImage?.url ? (
        <img
          src={article.coverImage.url}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900/10 to-amber-400/20">
          <Newspaper className="h-10 w-10 text-gray-200" />
        </div>
      )}
      <div className="absolute top-3 left-3">
        <CatPill cat={article.category} />
      </div>
    </div>

    {/* Text */}
    <div className="p-4 sm:p-5">
      <h3 className="font-serif font-bold text-gray-900 text-base sm:text-lg leading-snug line-clamp-2 mb-2
        group-hover:opacity-70 transition-opacity">
        {article.title}
      </h3>
      <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 font-sans text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(article.publishedAt)}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount || 0}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   ARTICLE MODAL
══════════════════════════════════════════ */
const ArticleModal = ({ open, onClose }) => {
  const { article, loading } = useSelector((s) => s.news);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className=" md:!w-[1000px]
    md:!max-w-[1000px] p-0 gap-0 overflow-hidden rounded-3xl border-0
        [&>button]:z-20 [&>button]:top-4 [&>button]:right-4 [&>button]:rounded-full
        [&>button]:bg-black/10 [&>button]:hover:bg-black/20
        [&>button]:w-9 [&>button]:h-9 [&>button]:text-gray-700
        max-h-[90vh] overflow-y-auto">

        {loading.article ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 font-sans">
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-amber-400 animate-spin" />
            <p className="text-sm text-gray-400">Loading article…</p>
          </div>

        ) : !article ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3 px-8 text-center font-sans">
            <AlertCircle className="h-8 w-8 text-red-300" />
            <p className="text-sm text-gray-400">Article could not be loaded.</p>
          </div>

        ) : (
          <>
            {/* Hero image */}
            <div className="relative flex-shrink-0">
              {article.coverImage?.url ? (
                <div className="aspect-[21/9] overflow-hidden">
                  <img src={article.coverImage.url} alt={article.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[21/9] flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
                  <Newspaper className="h-16 w-16 text-white/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <CatPill cat={article.category} />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-8 pt-7 pb-8 font-sans">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  {fmtDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-amber-400" />
                  {article.viewCount} views
                </span>
                {article.postedBy?.name && (
                  <span>by <strong className="text-gray-600">{article.postedBy.name}</strong></span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-5">
                {article.title}
              </h1>

              {/* Pull-quote */}
              {article.excerpt && (
                <div className="relative pl-5 mb-7 border-l-[3px] border-amber-400 rounded-full">
                  <p className="text-base text-gray-500 leading-relaxed italic">{article.excerpt}</p>
                </div>
              )}

              {/* Ornament */}
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px flex-1 bg-gray-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="w-1 h-1 rounded-full bg-gray-200" />
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Body */}
              <div className="text-[15px] text-gray-700 leading-[1.9] whitespace-pre-line">
                {article.content}
              </div>

              {/* Tags */}
              {article.tags?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-gray-100">
                  <Tag className="h-3.5 w-3.5 text-gray-300" />
                  {article.tags.map((t) => (
                    <span key={t}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500
                        hover:bg-slate-900 hover:text-white transition-colors cursor-default">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ══════════════════════════════════════════
   PAGINATION
══════════════════════════════════════════ */
const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total, limit } = pagination;
  if (!pages || pages <= 1) return null;

  const getPages = () => {
    if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "…", pages];
    if (page >= pages - 2) return [1, "…", pages - 3, pages - 2, pages - 1, pages];
    return [1, "…", page - 1, page, page + 1, "…", pages];
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 mt-10 border-t border-gray-100">
      <p className="font-sans text-sm text-gray-400 order-2 sm:order-1">
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
        <strong className="text-gray-600">{total}</strong> stories
      </p>
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 text-white
            transition-all disabled:opacity-25 hover:opacity-80">
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPages().map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-gray-300 font-sans text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-xl font-sans text-sm font-semibold transition-all hover:opacity-90
                ${p === page
                  ? "bg-amber-400 text-slate-900"
                  : "bg-slate-900/10 text-slate-900"
                }`}>
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 text-white
            transition-all disabled:opacity-25 hover:opacity-80">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
import { useSearchParams } from "react-router-dom"; // 👈 add this import at top

const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 2;

const News = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((s) => s.news);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = parseInt(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput]   = useState("");
  const [searchText, setSearchText]     = useState(""); // debounced value
  const [category, setCategory]         = useState("");
  const [modalOpen, setModalOpen]       = useState(false);

  const isFirstRender = useRef(true);
  const didMountRef   = useRef(false);
  const prevPageRef   = useRef(pageFromUrl);
  const listRef       = useRef(null);

  /* ── Main fetch — page + filters + debounced search ── */
  const load = useCallback((page = pageFromUrl) => {
    const params = { page, limit: 10 };
    if (searchText) params.search   = searchText;
    if (category)   params.category = category;
    dispatch(fetchPublicNews(params));
  }, [dispatch, searchText, category, pageFromUrl]);

  useEffect(() => { load(pageFromUrl); }, [category, searchText, pageFromUrl]);

  /* ── Reset page to 1 when category changes ── */
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", "1");
      return p;
    });
  }, [category]);

  /* ── Debounced search ── */
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }

    const trimmed = searchInput.trim();
    if (trimmed !== "" && trimmed.length < MIN_SEARCH_LENGTH) return;

    const timer = setTimeout(() => {
      setSearchText(trimmed);
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set("page", "1");
        return p;
      });
      // Direct dispatch in case already on page 1
      dispatch(fetchPublicNews({
        page: 1, limit: 10,
        search: trimmed || undefined,
        category: category || undefined,
      }));
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ── Scroll to list on page change ── */
  useEffect(() => {
    if (loading.list) return;
    if (prevPageRef.current !== pageFromUrl) {
      prevPageRef.current = pageFromUrl;
      setTimeout(() => {
        if (!listRef.current) return;
        const top = listRef.current.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "smooth" });
      }, 300);
    }
  }, [loading.list, pageFromUrl]);

  /* ── Page change handler ── */
  const onPageChange = (page) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(page));
      return p;
    });
  };

  /* ── Clear search ── */
  const clearSearch = () => {
    setSearchInput("");
    setSearchText("");
  };

  const clearAll = () => { clearSearch(); setCategory(""); };

  const openArticle = (id) => {
    dispatch(fetchNewsById(id));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    dispatch(clearArticle());
  };

  const isFiltering = searchText || category;
  const hero = !isFiltering && pageFromUrl === 1 ? list.find(a => a.newsType === "main") : null;
  const rest = hero ? list.filter(a => a._id !== hero._id) : list;

  return (
    <div className="min-h-screen font-sans bg-stone-100">

      {/* ══ HEADER ══ */}
      <div style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
                Alumni Network
              </p>
              <h1 className="gal-serif font-bold text-white text-3xl sm:text-4xl leading-tight">
                Alumni News
              </h1>
              <p className="text-sm text-white/40 mt-1.5">
                Stories, milestones, and community highlights from our alumni community
              </p>
            </div>

            {/* Search — now debounced on input change */}
            <div className="w-full sm:max-w-md">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
                <Search className="h-4 w-4 text-white/30 flex-shrink-0" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search stories…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                />
                {searchInput && (
                  <button type="button" onClick={clearSearch}>
                    <X className="h-3.5 w-3.5 text-white/40 hover:text-white transition" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Nav */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATS.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition
                  ${category === c.value ? "" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
                style={category === c.value ? { background: GOLD, color: NAVY } : undefined}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ ACTIVE FILTER PILLS ══ */}
      {isFiltering && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs text-gray-400">Showing:</span>
            {searchText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
                "{searchText}"
                <button onClick={clearSearch}><X className="w-3 h-3 opacity-60 hover:opacity-100" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
                {catLabel(category)}
                <button onClick={() => setCategory("")}><X className="w-3 h-3 opacity-60 hover:opacity-100" /></button>
              </span>
            )}
            <button onClick={clearAll} className="font-sans text-xs text-gray-400 underline underline-offset-2 hover:text-gray-700">
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <div ref={listRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10">

        {/* Skeletons */}
        {loading.list && (
          <div className="space-y-6">
            <Skel className="h-[460px] rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                  <Skel className="aspect-video rounded-none" />
                  <div className="p-5 space-y-2.5">
                    <Skel className="h-3 w-16 rounded" />
                    <Skel className="h-4 w-4/5 rounded" />
                    <Skel className="h-3 w-full rounded" />
                    <Skel className="h-3 w-3/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading.list && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-slate-900/5">
              <Newspaper className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">No stories found</h3>
            <p className="font-sans text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
              {searchText
                ? `We couldn't find anything for "${searchText}". Try a different term.`
                : "There are no published stories yet. Check back soon."}
            </p>
            {isFiltering && (
              <button onClick={clearAll} className="px-6 py-2.5 rounded-xl font-sans text-sm font-semibold bg-amber-400 text-slate-900 hover:opacity-90 transition-opacity">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Article grid */}
        {!loading.list && list.length > 0 && (
          <div className="space-y-6 sm:space-y-8">
            {hero && <HeroCard article={hero} onClick={openArticle} />}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {rest.map((a) => <PhotoCard key={a._id} article={a} onClick={openArticle} />)}
              </div>
            )}
            <Pagination pagination={pagination} onPageChange={onPageChange} />
          </div>
        )}
      </div>

      {/* ══ FOOTER ══ */}
      <div className="border-t border-gray-200 py-6 text-center">
        <p className="font-sans text-xs text-gray-400">
          © {new Date().getFullYear()} Alumni Network · All rights reserved
        </p>
      </div>

      <ArticleModal open={modalOpen} onClose={closeModal} />
    </div>
  );
};

export default News;