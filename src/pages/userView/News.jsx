import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicNews,
  fetchNewsById,
  clearArticle,
} from "../../store/user-view/UserNewsSlice";
import {
  Search, X, Calendar, Eye, Tag, ChevronLeft, ChevronRight,
  Newspaper, ArrowUpRight, Clock, Loader2, AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/* ─── Google Fonts ─── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

/* ─── Design tokens ─── */
const NAVY = "#0B1D3A";
const GOLD = "#E8A800";

const CATS = [
  { value: "",                label: "All Stories"  },
  { value: "announcement",   label: "Announcement" },
  { value: "achievement",    label: "Achievement"  },
  { value: "event",          label: "Event"        },
  { value: "general",        label: "General"      },
  { value: "alumni-spotlight", label: "Spotlight"  },
];

const CAT_ACCENT = {
  announcement:       "#3B82F6",
  achievement:        "#10B981",
  event:              "#8B5CF6",
  general:            "#6B7280",
  "alumni-spotlight": "#F59E0B",
};

const catLabel = (v) => CATS.find((c) => c.value === v)?.label || v;
const catColor = (v) => CAT_ACCENT[v] || "#6B7280";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

const timeAgo = (d) => {
  if (!d) return "";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 3600)   return `${Math.floor(s / 60)}m ago`;
  if (s < 86400)  return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(d);
};

/* ─── Injected global styles ─── */
const globalStyle = `
  .mag-display { font-family: 'Playfair Display', Georgia, serif; }
  .mag-body    { font-family: 'DM Sans', system-ui, sans-serif; }
  .cat-pill    { font-family: 'DM Sans', sans-serif; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; font-size: 10px; }
  .img-zoom img { transition: transform 0.6s cubic-bezier(.22,1,.36,1); }
  .img-zoom:hover img { transform: scale(1.06); }
  .card-lift   { transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease; }
  .card-lift:hover { transform: translateY(-6px); box-shadow: 0 28px 60px -12px rgba(0,0,0,0.2); }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up   { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .fade-up-2 { animation: fadeUp 0.5s 0.08s cubic-bezier(.22,1,.36,1) both; }
  .fade-up-3 { animation: fadeUp 0.5s 0.16s cubic-bezier(.22,1,.36,1) both; }
`;

/* ══════════════════════════════════════════
   CAT PILL
══════════════════════════════════════════ */
const CatPill = ({ cat, dark = false }) => (
  <span
    className="cat-pill inline-block px-2.5 py-[3px] rounded-sm"
    style={{
      background: dark ? `${catColor(cat)}20` : catColor(cat),
      color:      dark ? catColor(cat)        : "#fff",
    }}
  >
    {catLabel(cat)}
  </span>
);

/* ══════════════════════════════════════════
   SKELETON
══════════════════════════════════════════ */
const Skel = ({ className = "", style = {} }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} style={style} />
);

/* ══════════════════════════════════════════
   HERO CARD — full-width cinematic opener
══════════════════════════════════════════ */
const HeroCard = ({ article, onClick }) => (
  <div
    onClick={() => onClick(article._id)}
    className="card-lift relative w-full cursor-pointer overflow-hidden rounded-2xl"
    style={{ minHeight: 460 }}
  >
    {/* BG image */}
    <div className="img-zoom absolute inset-0">
      {article.coverImage?.url ? (
        <img src={article.coverImage.url} alt={article.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3560 50%, #0d2644 100%)` }} />
      )}
    </div>

    {/* Gradient overlay */}
    <div className="absolute inset-0"
      style={{ background: "linear-gradient(to top, rgba(4,10,22,0.97) 0%, rgba(4,10,22,0.55) 45%, rgba(4,10,22,0.1) 100%)" }} />

    {/* Left gold bar */}
    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: GOLD }} />

    {/* Content */}
    <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8 md:p-10"
      style={{ minHeight: 460 }}>
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4 fade-up">
          <CatPill cat={article.category} />
          <span className="mag-body text-xs text-white/40 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo(article.publishedAt)}
          </span>
        </div>

        <h1 className="mag-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] font-black text-white leading-[1.1] mb-4 fade-up-2"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}>
          {article.title}
        </h1>

        <p className="mag-body text-sm sm:text-base text-white/60 leading-relaxed mb-7 max-w-2xl line-clamp-2 fade-up-3">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between fade-up-3">
          <span className="mag-body text-xs text-white/30 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" /> {article.viewCount || 0} views
          </span>
          <button
            className="flex items-center gap-2 mag-body text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: GOLD, color: NAVY }}>
            Read Story <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   STANDARD CARD
══════════════════════════════════════════ */
/* ══════════════════════════════════════════
   PHOTO CARD — image-first, title below
══════════════════════════════════════════ */
const PhotoCard = ({ article, onClick }) => (
  <div
    onClick={() => onClick(article._id)}
    className="card-lift group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100/80"
    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
  >
    {/* Full image top */}
    <div className="img-zoom relative overflow-hidden bg-gray-100" style={{ aspectRatio: "4/3" }}>
      {article.coverImage?.url ? (
        <img src={article.coverImage.url} alt={article.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${NAVY}18, ${GOLD}25)` }}>
          <Newspaper className="h-10 w-10 text-gray-200" />
        </div>
      )}
      {/* Category badge top-left */}
      <div className="absolute top-3 left-3">
        <CatPill cat={article.category} />
      </div>
    </div>

    {/* Text block below image */}
    <div className="p-4 sm:p-5">
      <h3
        className="mag-display font-bold text-gray-900 text-base sm:text-lg leading-snug line-clamp-2 mb-2 group-hover:opacity-70 transition-opacity"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {article.title}
      </h3>
      <p className="mag-body text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mag-body text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(article.publishedAt)}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount || 0}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-[#E8A800] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   ARTICLE DIALOG (shadcn)
══════════════════════════════════════════ */
const ArticleModal = ({ open, onClose }) => {
  const { article, loading } = useSelector((s) => s.news);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden rounded-3xl border-0 [&>button]:z-20 [&>button]:top-4 [&>button]:right-4 [&>button]:rounded-full [&>button]:bg-black/10 [&>button]:hover:bg-black/20 [&>button]:w-9 [&>button]:h-9 [&>button]:text-gray-700 max-h-[90vh] overflow-y-auto">
        {loading.article ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 mag-body">
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-[#E8A800] animate-spin" />
            <p className="text-sm text-gray-400">Loading article…</p>
          </div>
        ) : !article ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3 px-8 text-center mag-body">
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
                <div className="aspect-[21/9] flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3a7a)` }}>
                  <Newspaper className="h-16 w-16 text-white/10" />
                </div>
              )}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(5,12,26,0.75) 0%, transparent 55%)" }} />
              <div className="absolute bottom-4 left-6">
                <CatPill cat={article.category} />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-8 pt-7 pb-8 mag-body">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" style={{ color: GOLD }} />
                  {fmtDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" style={{ color: GOLD }} />
                  {article.viewCount} views
                </span>
                {article.postedBy?.name && (
                  <span>by <strong className="text-gray-600">{article.postedBy.name}</strong></span>
                )}
              </div>

              {/* Title */}
              <h1 className="mag-display text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {article.title}
              </h1>

              {/* Pull-quote */}
              {article.excerpt && (
                <div className="relative pl-5 mb-7">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full" style={{ background: GOLD }} />
                  <p className="text-base text-gray-500 leading-relaxed italic">{article.excerpt}</p>
                </div>
              )}

              {/* Ornament */}
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px flex-1 bg-gray-100" />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
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
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-[#0B1D3A] hover:text-white transition-colors cursor-default">
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
    if (page <= 3)  return [1, 2, 3, 4, "…", pages];
    if (page >= pages - 2) return [1, "…", pages - 3, pages - 2, pages - 1, pages];
    return [1, "…", page - 1, page, page + 1, "…", pages];
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 mt-10 border-t border-gray-100">
      <p className="mag-body text-sm text-gray-400 order-2 sm:order-1">
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
        <strong className="text-gray-600">{total}</strong> stories
      </p>
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-25 hover:opacity-80"
          style={{ background: NAVY, color: "#fff" }}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPages().map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-gray-300 mag-body text-sm">…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p)}
              className="w-9 h-9 rounded-xl mag-body text-sm font-semibold transition-all hover:opacity-90"
              style={p === page
                ? { background: GOLD, color: NAVY }
                : { background: `${NAVY}12`, color: NAVY }}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page === pages}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-25 hover:opacity-80"
          style={{ background: NAVY, color: "#fff" }}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const News = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((s) => s.news);

  const [search,      setSearch]     = useState("");
  const [searchInput, setSearchInput]= useState("");
  const [category,    setCategory]   = useState("");
  const [modalOpen,   setModalOpen]  = useState(false);
  const [searchOpen,  setSearchOpen] = useState(false);

  const load = useCallback((page = 1) => {
    const params = { page, limit: 9 };
    if (search)   params.search   = search;
    if (category) params.category = category;
    dispatch(fetchPublicNews(params));
  }, [dispatch, search, category]);

  useEffect(() => { load(1); }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setSearchOpen(false);
  };

  const clearAll = () => { setSearch(""); setSearchInput(""); setCategory(""); };

  const openArticle = (id) => {
    dispatch(fetchNewsById(id));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    dispatch(clearArticle());
  };

  const isFiltering = search || category;

  /* Layout slices */
  const hero = list[0];
  const rest = list.slice(1);

  return (
    <>
      <style>{globalStyle}</style>
      <FontLink />

      <div className="min-h-screen mag-body" style={{ background: "#F7F6F3" }}>

        {/* ══ MASTHEAD ══ */}
        <div style={{ background: NAVY }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Search (slide-down) */}
            {searchOpen && (
              <div className="pb-5 fade-up">
                <form onSubmit={handleSearch}
                  className="flex items-center gap-2 bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 max-w-xl mx-auto">
                  <Search className="h-4 w-4 text-white/30 flex-shrink-0" />
                  <input
                    autoFocus
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search stories…"
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
                  />
                  {searchInput && (
                    <button type="button" onClick={() => setSearchInput("")}>
                      <X className="h-3.5 w-3.5 text-white/30 hover:text-white transition-colors" />
                    </button>
                  )}
                  <button type="submit"
                    className="px-4 py-1.5 rounded-lg cat-pill transition-all hover:opacity-90"
                    style={{ background: GOLD, color: NAVY }}>
                    Search
                  </button>
                </form>
              </div>
            )}

            {/* Category navigation */}
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {CATS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className="flex-shrink-0 px-4 sm:px-5 py-3.5 mag-body text-xs sm:text-sm font-medium transition-all whitespace-nowrap border-b-2"
                  style={{
                    color:       category === c.value ? GOLD : "rgba(255,255,255,0.4)",
                    borderColor: category === c.value ? GOLD : "transparent",
                    background:  "transparent",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ ACTIVE FILTER PILLS ══ */}
        {isFiltering && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mag-body text-xs text-gray-400">Showing:</span>
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: NAVY, color: "#fff" }}>
                  "{search}"
                  <button onClick={() => { setSearch(""); setSearchInput(""); }}>
                    <X className="w-3 h-3 opacity-60 hover:opacity-100" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: NAVY, color: "#fff" }}>
                  {catLabel(category)}
                  <button onClick={() => setCategory("")}>
                    <X className="w-3 h-3 opacity-60 hover:opacity-100" />
                  </button>
                </span>
              )}
              <button onClick={clearAll} className="mag-body text-xs text-gray-400 underline underline-offset-2 hover:text-gray-700">
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* ══ MAIN CONTENT ══ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10">

          {/* Loading skeletons */}
          {loading.list && (
            <div className="space-y-6">
              <Skel style={{ height: 460, borderRadius: 16 }} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[0,1,2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                    <Skel style={{ aspectRatio: "16/9", borderRadius: 0 }} />
                    <div className="p-5 space-y-2.5">
                      <Skel style={{ height: 12, width: 64, borderRadius: 4 }} />
                      <Skel style={{ height: 18, width: "80%", borderRadius: 4 }} />
                      <Skel style={{ height: 12, width: "100%", borderRadius: 4 }} />
                      <Skel style={{ height: 12, width: "60%", borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading.list && list.length === 0 && (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{ background: `${NAVY}08` }}>
                <Newspaper className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="mag-display text-xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                No stories found
              </h3>
              <p className="mag-body text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
                {search
                  ? `We couldn't find anything for "${search}". Try a different term.`
                  : "There are no published stories yet. Check back soon."}
              </p>
              {isFiltering && (
                <button onClick={clearAll}
                  className="px-6 py-2.5 rounded-xl mag-body text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: GOLD, color: NAVY }}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Article grid */}
          {!loading.list && list.length > 0 && (
            <div className="space-y-6 sm:space-y-8">

              {/* HERO — first article, full width */}
              {hero && <HeroCard article={hero} onClick={openArticle} />}

              {/* PHOTO GRID — rest of articles */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {rest.map((a) => (
                    <PhotoCard key={a._id} article={a} onClick={openArticle} />
                  ))}
                </div>
              )}

              <Pagination pagination={pagination} onPageChange={load} />
            </div>
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <div className="border-t border-gray-200 py-6 text-center">
          <p className="mag-body text-xs text-gray-400">
            © {new Date().getFullYear()} Alumni Network · All rights reserved
          </p>
        </div>
      </div>

      <ArticleModal open={modalOpen} onClose={closeModal} />
    </>
  );
};

export default News;