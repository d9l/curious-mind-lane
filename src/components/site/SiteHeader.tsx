import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

const navItems = [
  { label: "Subjects", href: "#subjects" },
  { label: "Features", href: "#features" },
  { label: "Chapters", href: "#chapters" },
  { label: "Journey", href: "#journey" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden justify-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <button
            onClick={onOpenSearch}
            className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted sm:inline-flex"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
            <span>Search chapters…</span>
            <kbd className="ml-6 hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={onOpenSearch}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground sm:hidden"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            to="/read/$chapterSlug"
            params={{ chapterSlug: "reflection-of-light" }}
            className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md md:inline-flex"
          >
            Start learning <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" aria-label="Mobile">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                {n.label}
              </a>
            ))}
            <Link
              to="/read/$chapterSlug"
              params={{ chapterSlug: "reflection-of-light" }}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Start learning <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
