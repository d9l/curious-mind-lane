import { Logo } from "./Logo";

const cols = [
  {
    title: "Learn",
    links: ["CBSE", "ICSE", "Class 6–8", "Class 9–10", "Class 11–12"],
  },
  {
    title: "Subjects",
    links: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
  },
  {
    title: "Platform",
    links: ["About", "Teachers", "For schools", "Careers", "Press"],
  },
  {
    title: "Support",
    links: ["Help centre", "Community", "Contact", "Status"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-parchment/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A quiet, modern learning platform for students of Class 6 to 12. Built with the
              belief that a beautifully made textbook can change how a child thinks.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Made in India · For India
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-sm font-semibold text-foreground">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Vidyana Learning. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
