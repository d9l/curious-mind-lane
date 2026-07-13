import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ArrowRight, Sparkles, BookOpen, Hash } from "lucide-react";
import { allChapters } from "@/data/curriculum";

interface Props {
  open: boolean;
  onClose: () => void;
}

const suggestions = [
  { label: "Reflection of light", kind: "Chapter" },
  { label: "Quadratic equations", kind: "Chapter" },
  { label: "Photosynthesis", kind: "Topic" },
  { label: "Acids, bases & salts", kind: "Chapter" },
  { label: "Ask AI Tutor: “Explain resonance”", kind: "AI" },
];

export function SearchDialog({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const chapters = allChapters();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  const filtered = chapters.filter((c) =>
    q ? c.chapter.title.toLowerCase().includes(q.toLowerCase()) : true,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[10vh] backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-scale-in"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search chapters, topics, formulas…"
            className="h-14 flex-1 bg-transparent text-base placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!q && (
            <div className="mb-2 px-3 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Suggested
            </div>
          )}
          {!q &&
            suggestions.map((s) => (
              <button
                key={s.label}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted"
              >
                {s.kind === "AI" ? (
                  <Sparkles className="h-4 w-4 text-saffron" />
                ) : (
                  <Hash className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="flex-1">{s.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.kind}
                </span>
              </button>
            ))}

          {q && (
            <div className="mb-2 px-3 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Chapters · {filtered.length}
            </div>
          )}
          {q &&
            filtered.map(({ chapter, subject, classLevel }) => (
              <Link
                key={chapter.slug}
                to="/read/$chapterSlug"
                params={{ chapterSlug: chapter.slug }}
                onClick={onClose}
                className="flex items-start gap-3 rounded-lg px-3 py-3 hover:bg-muted"
              >
                <BookOpen className="mt-0.5 h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{chapter.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {classLevel.label} · {subject.name} · Ch {chapter.number}
                  </div>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          {q && filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No matches. Try “light”, “acids”, or “equations”.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-parchment/50 px-4 py-2 text-[11px] text-muted-foreground">
          <span>
            <kbd className="rounded border border-border bg-background px-1 font-mono">↑↓</kbd> to
            navigate
          </span>
          <span>Search powered by Vidyana Index</span>
        </div>
      </div>
    </div>
  );
}
