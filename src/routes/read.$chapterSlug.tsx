import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Home,
  Menu,
  Printer,
  Search,
  Share2,
  ChevronRight,
  ChevronDown,
  X,
  BookOpen,
  ListChecks,
} from "lucide-react";
import { catalog, findChapterBySlug, type Chapter, type ClassLevel, type Subject, type Board } from "@/data/curriculum";
import { chapterContent, type ChapterContent } from "@/data/chapter-content";

type Meta = { board: Board; classLevel: ClassLevel; subject: Subject; chapter: Chapter };
type LoaderData = { meta: Meta; content: ChapterContent };
import { ChapterBlock } from "@/components/chapter/ChapterBlock";
import { Logo } from "@/components/site/Logo";
import { SearchDialog } from "@/components/site/SearchDialog";
import { LibraryTree } from "@/components/reader/LibraryTree";

export const Route = createFileRoute("/read/$chapterSlug")({
  loader: ({ params }): LoaderData => {
    const meta = findChapterBySlug(params.chapterSlug);
    const content = chapterContent[params.chapterSlug];
    if (!meta || !content) throw notFound();
    return { meta, content };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Chapter not found — Vidyana" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { meta } = loaderData;
    const title = `${meta.chapter.title} · ${meta.classLevel.label} ${meta.subject.name} — Vidyana`;
    const desc = meta.chapter.summary;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ReadingPage,
});

function ReadingPage() {
  const { meta, content } = Route.useLoaderData() as LoaderData;
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  // Reading progress
  useEffect(() => {
    const on = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const p = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
      setProgress(p);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Active TOC
  useEffect(() => {
    const ids = meta.chapter.topics.map((t) => t.id);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveSection(e.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [meta.chapter.topics]);

  const chapters = meta.subject.chapters;
  const currentIdx = chapters.findIndex((c) => c.slug === meta.chapter.slug);
  const prev = currentIdx > 0 ? chapters[currentIdx - 1] : null;
  const next = currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null;

  const share = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: meta.chapter.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="h-0.5 w-full bg-border">
          <div
            className="h-full bg-primary transition-[width] duration-150"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>
        <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 sm:px-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLeftOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card lg:hidden"
              aria-label="Open library"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Logo className="hidden sm:inline-flex" />
          </div>
          <nav
            className="hidden min-w-0 items-center gap-1.5 text-sm text-muted-foreground md:flex"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{meta.classLevel.label}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{meta.subject.name}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-foreground">{meta.chapter.title}</span>
          </nav>
          <div className="flex items-center gap-1.5 justify-self-end">
            <IconBtn label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </IconBtn>
            <IconBtn
              label={bookmarked ? "Bookmarked" : "Bookmark"}
              onClick={() => setBookmarked((b) => !b)}
              active={bookmarked}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
            </IconBtn>
            <IconBtn label="Share" onClick={share}>
              <Share2 className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="Print" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
            </IconBtn>
            <button
              onClick={() => setRightOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card xl:hidden"
              aria-label="Open contents"
            >
              <ListChecks className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[260px_minmax(0,1fr)_260px]">
        {/* Left sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <LibraryTree
              selectedChapterId={selectedChapterId}
              onSelectChapter={setSelectedChapterId}
            />
          </div>
        </aside>

        {/* Reading */}
        <article className="min-w-0">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {meta.board} · {meta.classLevel.label} · {meta.subject.name} · Chapter{" "}
              {meta.chapter.number}
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-foreground text-balance sm:text-5xl">
              {meta.chapter.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {meta.chapter.summary}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {meta.chapter.minutes} min read
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" /> {meta.chapter.topics.length} sections
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                Updated recently
              </span>
            </div>

            {/* Objectives */}
            <div className="mt-10 rounded-2xl border border-border bg-parchment/50 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                Learning objectives
              </p>
              <ul className="mt-3 space-y-2">
                {content.objectives.map((o, i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-foreground/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blocks */}
            <div className="mt-4">
              {content.blocks.map((b, i) => (
                <ChapterBlock key={i} block={b} />
              ))}
            </div>

            {/* Summary */}
            <section id="summary" className="mt-16 scroll-mt-28">
              <h2 className="font-display text-3xl font-medium tracking-tight text-foreground">
                Summary
              </h2>
              <ul className="mt-6 grid gap-3">
                {content.summary.map((s, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-border bg-card px-5 py-4 text-[15px] leading-relaxed text-foreground/90"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.06] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  Key takeaways
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {content.keyTakeaways.map((k, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground/85">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Practice */}
            <section id="practice" className="mt-16 scroll-mt-28">
              <h2 className="font-display text-3xl font-medium tracking-tight text-foreground">
                Practice
              </h2>
              <ol className="mt-6 grid gap-3">
                {content.practice.map((p, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-border bg-card p-5"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[15px] leading-relaxed text-foreground">{p.q}</p>
                      {p.hint && (
                        <p className="mt-2 text-xs text-muted-foreground">Hint · {p.hint}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* FAQ */}
            <section id="faq" className="mt-16 scroll-mt-28">
              <h2 className="font-display text-3xl font-medium tracking-tight text-foreground">
                Frequently asked
              </h2>
              <div className="mt-6">
                {content.faq.map((f, i) => (
                  <FaqRow key={i} q={f.q} a={f.a} />
                ))}
              </div>
            </section>

            {/* Prev / Next */}
            <nav
              className="mt-16 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"
              aria-label="Chapter navigation"
            >
              {prev ? (
                <Link
                  to="/read/$chapterSlug"
                  params={{ chapterSlug: prev.slug }}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted"
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <ArrowLeft className="h-3 w-3" /> Previous
                  </span>
                  <div className="mt-2 font-display text-lg font-medium text-foreground">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to="/read/$chapterSlug"
                  params={{ chapterSlug: next.slug }}
                  className="group rounded-2xl border border-border bg-card p-5 text-right transition-colors hover:bg-muted"
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Next <ArrowRight className="h-3 w-3" />
                  </span>
                  <div className="mt-2 font-display text-lg font-medium text-foreground">
                    {next.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </div>
        </article>

        {/* Right sidebar */}
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <TOC
              topics={meta.chapter.topics}
              activeId={activeSection}
              progress={progress}
              minutes={meta.chapter.minutes}
            />
          </div>
        </aside>
      </div>

      {/* Mobile drawers */}
      {leftOpen && (
        <Drawer side="left" onClose={() => setLeftOpen(false)} title="Library">
          <LibraryTree
            selectedChapterId={selectedChapterId}
            onSelectChapter={(id) => {
              setSelectedChapterId(id);
              setLeftOpen(false);
            }}
          />
        </Drawer>
      )}
      {rightOpen && (
        <Drawer side="right" onClose={() => setRightOpen(false)} title="On this page">
          <TOC
            topics={meta.chapter.topics}
            activeId={activeSection}
            progress={progress}
            minutes={meta.chapter.minutes}
            onNavigate={() => setRightOpen(false)}
          />
        </Drawer>
      )}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full border border-border transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}




/* ---------- Right: TOC ---------- */
function TOC({
  topics,
  activeId,
  progress,
  minutes,
  onNavigate,
}: {
  topics: { id: string; title: string }[];
  activeId: string | null;
  progress: number;
  minutes: number;
  onNavigate?: () => void;
}) {
  const readMinutes = useMemo(
    () => Math.max(0, Math.round(minutes * (1 - progress / 100))),
    [minutes, progress],
  );
  return (
    <div className="text-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        On this page
      </p>
      <ul className="mt-4 space-y-1">
        {topics.map((t) => {
          const active = t.id === activeId;
          return (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                onClick={onNavigate}
                className={`grid grid-cols-[3px_1fr] items-center gap-3 rounded-md py-1.5 pr-2 transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`h-4 w-[3px] rounded-full ${
                    active ? "bg-primary" : "bg-transparent"
                  }`}
                />
                <span className={active ? "font-medium" : ""}>{t.title}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          ~{readMinutes} min left · {minutes} min total
        </p>
      </div>
    </div>
  );
}

/* ---------- Drawer ---------- */
function Drawer({
  side,
  onClose,
  title,
  children,
}: {
  side: "left" | "right";
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 h-full w-[85vw] max-w-sm overflow-y-auto bg-background p-5 shadow-2xl animate-slide-in-right ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- FAQ row ---------- */
function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-medium text-foreground">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground animate-fade-in">
          {a}
        </p>
      )}
    </div>
  );
}
