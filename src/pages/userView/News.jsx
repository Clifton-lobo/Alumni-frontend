import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicNews,
  fetchNewsById,
  clearArticle,
} from "../../store/user-view/UserNewsSlice";
import {
  Search,
  X,
  Calendar,
  Eye,
  Tag,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  ArrowUpRight,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PaginationControls from "../../components/common/Pagination.jsx"; // adjust path

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
  announcement: {
    bg: "bg-blue-500",
    text: "text-white",
    softBg: "bg-blue-500/10",
    softText: "text-blue-500",
  },
  achievement: {
    bg: "bg-emerald-500",
    text: "text-white",
    softBg: "bg-emerald-500/10",
    softText: "text-emerald-500",
  },
  event: {
    bg: "bg-violet-500",
    text: "text-white",
    softBg: "bg-violet-500/10",
    softText: "text-violet-500",
  },
  general: {
    bg: "bg-gray-500",
    text: "text-white",
    softBg: "bg-gray-500/10",
    softText: "text-gray-500",
  },
  "alumni-spotlight": {
    bg: "bg-amber-500",
    text: "text-white",
    softBg: "bg-amber-500/10",
    softText: "text-amber-500",
  },
};

const catLabel = (v) => CATS.find((c) => c.value === v)?.label || v;
const catColors = (v) => CAT_COLORS[v] || CAT_COLORS.general;

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

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
    <span
      className={`inline-block px-2.5 py-[3px] rounded-sm uppercase tracking-widest font-semibold text-[10px] font-sans
      ${dark ? `${c.softBg} ${c.softText}` : `${c.bg} ${c.text}`}`}
    >
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
    className="relative w-full cursor-pointer overflow-hidden rounded-2xl min-h-[480px] sm:min-h-[600px]"
  >
    {/* Background image */}
    {article.coverImage?.url ? (
      <img
        src={article.coverImage.url}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-blue-900" />
    )}

    {/* Dark gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent" />

    {/* Content overlaid on image */}
    <div className="absolute bottom-0 left-0 right-0 px-8 py-10 flex flex-col gap-4">
      {/* Featured + Category + Date */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded"
          style={{ background: GOLD, color: NAVY }}
        >
          Featured
        </span>
        <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
          {catLabel(article.category)}
        </span>
        <span className="text-white/40 text-xs">·</span>
        <span className="text-white/60 text-xs">
          {new Date(article.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white max-w-3xl">
        {article.title}
      </h2>

      {/* Excerpt */}
      <p className="text-white/70 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-2xl">
        {article.excerpt}
      </p>

      {/* CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(article._id);
        }}
        className="inline-flex items-center gap-2 text-sm font-semibold w-fit"
        style={{ color: GOLD }}
      >
        Read article <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);
/* ══════════════════════════════════════════
   PHOTO CARD
══════════════════════════════════════════ */
const PhotoCard = ({ article, onClick }) => (
  <div
    onClick={() => onClick(article._id)}
    className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100
      shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
  >
    {/* Image */}
    <div className="relative overflow-hidden bg-gray-100 aspect-[16/10]">
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
    </div>

    {/* Text */}
    <div className="p-5 sm:p-6 flex flex-col">
      {/* Category + Date row */}
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="flex items-center gap-1 font-sans text-xs font-semibold"
          style={{ color: GOLD }}
        >
          <Tag className="h-3 w-3" />
          {catLabel(article.category)}
        </span>
        <span className="text-gray-300 text-xs">·</span>
        <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          {fmtDate(article.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-serif font-bold text-gray-900 text-base sm:text-[1.1rem] leading-snug line-clamp-2 mb-2.5 transition-colors duration-200 h-[3rem] overflow-hidden"
        style={{ color: "#142A5D" }}
      >
        <span className="group-hover:text-amber-500 transition-colors duration-200">
          {article.title}
        </span>
      </h3>

      {/* Excerpt */}
      <p className="font-sans text-sm text-gray-500 leading-relaxed line-clamp-2 mb-5 h-[2.8rem] overflow-hidden">
        {article.excerpt}
      </p>

      {/* Read More */}
      <div
        className="flex items-center gap-1.5 font-sans text-sm font-semibold mt-auto"
        style={{ color: GOLD }}
      >
        <span>Read More</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        style={{
          maxWidth: 1000,
          width: "95vw",
          maxHeight: "92vh",
          padding: 0,
          borderRadius: 24,
          border: "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // ✅ outer clips, NO scroll here
          background: "#ffffff",
        }}
      >
        {/* ✅ Inner div scrolls — same pattern as UserEventDetails */}
        <div className="ued-scroll" style={{ flex: 1, overflowY: "auto" }}>
          {loading.article ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 font-sans">
              <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-amber-400 animate-spin" />
              <p className="text-sm text-gray-400">Loading article…</p>
            </div>
          ) : !article ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3 px-8 text-center font-sans">
              <AlertCircle className="h-8 w-8 text-red-300" />
              <p className="text-sm text-gray-400">
                Article could not be loaded.
              </p>
            </div>
          ) : (
            <>
              {/* Hero image */}
              <div className="relative flex-shrink-0">
                {article.coverImage?.url ? (
                  <div className="aspect-[21/9] overflow-hidden">
                    <img
                      src={article.coverImage.url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
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
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-5">
                  {article.title}
                </h1>

                {/* Pull-quote */}
                {article.excerpt && (
                  <div className="relative pl-5 mb-7 border-l-[3px] border-amber-400 rounded-full">
                    <p className="text-base text-gray-500 leading-relaxed italic">
                      {article.excerpt}
                    </p>
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
                      <span
                        key={t}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500
                          hover:bg-slate-900 hover:text-white transition-colors cursor-default"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* end scrollable inner */}
      </DialogContent>
    </Dialog>
  );
};

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

  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState(""); // debounced value
  const [category, setCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const isFirstRender = useRef(true);
  const didMountRef = useRef(false);
  const prevPageRef = useRef(pageFromUrl);
  const listRef = useRef(null);
  const [heroArticle, setHeroArticle] = useState(null);

  useEffect(() => {
    dispatch(fetchPublicNews({ page: 1, limit: 10 })).then((res) => {
      console.log("Hero fetch payload:", res.payload);
      const items = res.payload?.news || res.payload?.data || res.payload || [];
      const found = items.find((a) => a.newsType === "main") || items[0];
      if (found) setHeroArticle(found);
    });
  }, []);

  /* ── Main fetch — page + filters + debounced search ── */
  const load = useCallback(
    (page = pageFromUrl) => {
      const params = { page, limit: 10 };
      if (searchText) params.search = searchText;
      if (category) params.category = category;
      dispatch(fetchPublicNews(params));
    },
    [dispatch, searchText, category, pageFromUrl],
  );

  useEffect(() => {
    load(pageFromUrl);
  }, [category, searchText, pageFromUrl]);

  /* ── Reset page to 1 when category changes ── */
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", "1");
      return p;
    });
  }, [category]);

  const smoothScrollTo = (targetY, duration = 700) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const easedProgress = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  /* ── Debounced search ── */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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
      dispatch(
        fetchPublicNews({
          page: 1,
          limit: 10,
          search: trimmed || undefined,
          category: category || undefined,
        }),
      );
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ── Scroll to list on page change ── */
  useEffect(() => {
    if (loading.list) return;

    if (prevPageRef.current !== pageFromUrl) {
      prevPageRef.current = pageFromUrl;

      requestAnimationFrame(() => {
        const element = listRef.current;
        if (!element) return;

        const headerOffset = 120;
        const offsetPosition =
          element.getBoundingClientRect().top + window.scrollY - headerOffset;

        smoothScrollTo(offsetPosition, 900); // ← controlled duration
      });
    }
  }, [loading.list, pageFromUrl]);
  /* ── Page change handler ── */
  const onPageChange = (page) => {
    prevPageRef.current = pageFromUrl; // snapshot current before update
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

  const clearAll = () => {
    clearSearch();
    setCategory("");
  };

  const openArticle = (id) => {
    dispatch(fetchNewsById(id));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    dispatch(clearArticle());
  };

  const isFiltering = searchText || category;
  const rest = heroArticle
    ? list.filter((a) => a._id !== heroArticle._id)
    : list;

  return (
    <div className="min-h-screen font-sans bg-stone-100">
      {/* ══ HEADER ══
    

      {/* ══ MAIN CONTENT ══ */}
      <div
        ref={listRef}
        className="max-w-[1350px] mx-auto px-4 sm:px-6 py-7 sm:py-10 relative min-h-[800px]"
      >
        {/* Empty state */}
        {!loading.list && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-slate-900/5">
              <Newspaper className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
              No stories found
            </h3>
            <p className="font-sans text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
              {searchText
                ? `We couldn't find anything for "${searchText}". Try a different term.`
                : "There are no published stories yet. Check back soon."}
            </p>
            {isFiltering && (
              <button
                onClick={clearAll}
                className="px-6 py-2.5 rounded-xl font-sans text-sm font-semibold bg-amber-400 text-slate-900 hover:opacity-90 transition-opacity"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <div className="relative">
          {/* Spinner overlay — sits on top, doesn't affect layout */}
          {loading.list && (
            <div className="absolute inset-0 z-10 flex items-start justify-center pt-20 pointer-events-none">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-amber-400 animate-spin" />
                <p className="text-xs text-gray-400 font-sans">
                  Loading stories…
                </p>
              </div>
            </div>
          )}

          {/* Content — subtle fade but no jump */}
          <div
            className={`transition-opacity duration-300 ${loading.list ? "opacity-80" : "opacity-100"}`}
          >
            {list.length === 0 && !loading.list ? (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-slate-900/5">
                  <Newspaper className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                  No stories found
                </h3>
                <p className="font-sans text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
                  {searchText
                    ? `We couldn't find anything for "${searchText}". Try a different term.`
                    : "There are no published stories yet. Check back soon."}
                </p>
                {isFiltering && (
                  <button
                    onClick={clearAll}
                    className="px-6 py-2.5 rounded-xl font-sans text-sm font-semibold bg-amber-400 text-slate-900 hover:opacity-90 transition-opacity"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {/* ══ HERO HEADLINE — always visible ══ */}
                <div className="pb-2">
                  <p
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                    style={{ color: GOLD }}
                  >
                    <span
                      className="inline-block w-6 h-px"
                      style={{ background: GOLD }}
                    />
                    Newsroom
                  </p>
                  <h1 className="text-4xl sm:text-6xl font-extrabold font-serif leadingtight text-gray-900  max-w-3xl">
                    Stories, research, and conversations from across Heritage.
                  </h1>
                </div>

                {heroArticle && (
                  <HeroCard article={heroArticle} onClick={openArticle} />
                )}
                {/* Filter + Search — below hero card */}
                <div className="flex flex-col gap-3 w-full">
                  {/* Search bar — full width on all sizes */}
                  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 w-full">
                    <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search articles..."
                      className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    />
                    {searchInput && (
                      <button type="button" onClick={clearSearch}>
                        <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-700 transition" />
                      </button>
                    )}
                  </div>

                  {/* Category pills — scrollable on mobile */}
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {CATS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition border
          ${
            category === c.value
              ? "text-white border-transparent"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
                        style={
                          category === c.value
                            ? { background: NAVY, borderColor: NAVY }
                            : undefined
                        }
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {rest.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {rest.map((a) => (
                      <PhotoCard
                        key={a._id}
                        article={a}
                        onClick={openArticle}
                      />
                    ))}
                  </div>
                )}
                {pagination.pages > 1 && (
                  <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <PaginationControls
                      currentPage={pageFromUrl}
                      totalPages={pagination.pages}
                      onPageChange={onPageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
