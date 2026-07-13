import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Atom,
  BookOpenText,
  FlaskConical,
  Landmark,
  Leaf,
  Sigma,
  Sparkles,
  Star,
  Clock,
  ChevronRight,
  Compass,
  Lightbulb,
  Target,
  BadgeCheck,
  Brain,
  Bot,
  Layers,
  PenLine,
  PlayCircle,
  LineChart,
  BookMarked,
  ShieldCheck,
  Quote,
  Plus,
  Minus,
} from "lucide-react";
import { useState } from "react";
import { catalog } from "@/data/curriculum";

const iconMap = {
  Atom,
  FlaskConical,
  Leaf,
  Sigma,
  BookOpenText,
  Landmark,
};

const accentBg: Record<string, string> = {
  indigo: "bg-primary/10 text-primary",
  saffron: "bg-saffron/25 text-clay",
  sage: "bg-sage/20 text-sage",
  clay: "bg-clay/15 text-clay",
  ocean: "bg-chart-5/15 text-chart-5",
};

/* ---------- HERO ---------- */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-24 sm:pt-14 lg:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.76 0.16 62 / 0.35), transparent)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-saffron" />
            Now open for CBSE & ICSE, Class 6–12
          </span>
          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            A quieter, calmer way to
            <span className="relative mx-2 inline-block">
              <span className="relative z-10 italic text-primary">learn</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-saffron/50"
              />
            </span>
            what school teaches.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
            Vidyana rebuilds the school textbook for the way students actually think — clean
            reading, honest explanations, and interactive concepts that stay with you long after
            the chapter ends.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/read/$chapterSlug"
              params={{ chapterSlug: "reflection-of-light" }}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Open sample chapter
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#subjects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              Browse subjects
            </a>
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card/70 shadow-sm backdrop-blur">
            {[
              { k: "24+", v: "Chapters live" },
              { k: "6–12", v: "Grades covered" },
              { k: "CBSE · ICSE", v: "Boards" },
            ].map((s) => (
              <div key={s.v} className="px-4 py-5 text-center">
                <dt className="font-display text-2xl font-semibold text-foreground">{s.k}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Editorial preview card */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-3 shadow-xl">
            <div className="overflow-hidden rounded-2xl bg-parchment">
              <div className="flex items-center justify-between border-b border-border/60 bg-card/70 px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-clay/70" />
                  <span className="h-2 w-2 rounded-full bg-saffron" />
                  <span className="h-2 w-2 rounded-full bg-sage/70" />
                  <span className="ml-3 font-mono">vidyana.in / class-10 / physics / reflection-of-light</span>
                </div>
                <span className="hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:block">
                  Reading · Ch 10
                </span>
              </div>
              <div className="grid gap-6 p-6 sm:p-10 md:grid-cols-[1fr_260px]">
                <article>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Class 10 · Physics · Ch 10
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground">
                    Reflection of Light
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    Every morning, before you notice it, light is already at work — bouncing off
                    the walls, off your notebook, off the face in the mirror. Reflection is the
                    quiet trick that makes seeing possible…
                  </p>
                  <div className="mt-6 rounded-xl border border-border bg-card px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                      Mirror formula
                    </p>
                    <p className="mt-1 font-display text-xl italic">1/v + 1/u = 1/f</p>
                  </div>
                </article>
                <aside className="rounded-xl border border-border bg-card/60 p-4 text-xs">
                  <p className="font-mono uppercase tracking-widest text-muted-foreground">On this page</p>
                  <ul className="mt-3 space-y-2 text-foreground">
                    {["Introduction", "Laws of reflection", "Spherical mirrors", "Mirror formula"].map(
                      (t, i) => (
                        <li key={t} className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              i === 1 ? "bg-primary" : "bg-border"
                            }`}
                          />
                          <span className={i === 1 ? "text-primary" : ""}>{t}</span>
                        </li>
                      ),
                    )}
                  </ul>
                  <div className="mt-4 border-t border-border pt-3 text-muted-foreground">
                    Progress · 42%
                    <div className="mt-1.5 h-1 w-full rounded-full bg-border">
                      <div className="h-full w-[42%] rounded-full bg-primary" />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SUBJECTS ---------- */
export function Subjects() {
  const class10 = catalog[0].classes[0];
  return (
    <section id="subjects" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Subjects"
          title="Every subject, taught with care."
          copy="Start with the classics — Physics, Chemistry, Biology, Mathematics — and grow into languages and social sciences. Each subject is written by teachers, then quietly designed."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {class10.subjects.map((s) => {
            const Icon = (iconMap as any)[s.icon] ?? BookOpenText;
            return (
              <a
                key={s.id}
                href="#chapters"
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-xl ${accentBg[s.accent]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.chapters.length} ch
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-medium text-foreground">{s.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Class 6–12 · CBSE & ICSE
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURES ---------- */
const features = [
  {
    icon: BookMarked,
    title: "Reading first",
    body: "Long-form typography, warm ivory pages, and a table of contents that follows you. Made for calm concentration — not endless scrolling.",
  },
  {
    icon: Brain,
    title: "Concepts, not summaries",
    body: "Every chapter is built around ideas. Formulas arrive with context, examples arrive with intuition — the “why” never gets left behind.",
  },
  {
    icon: Layers,
    title: "Blocks, endlessly composable",
    body: "Definitions, notes, warnings, examples, quizzes, diagrams — every chapter is assembled from beautiful, reusable content blocks.",
  },
  {
    icon: LineChart,
    title: "Progress that respects you",
    body: "Track chapters, bookmark ideas, revisit last read. No streaks that shame you into studying — just quiet feedback.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-y border-border bg-parchment/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Vidyana"
          title="Designed like a textbook. Built like software."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-display text-xl font-medium text-foreground">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURED CHAPTERS ---------- */
export function FeaturedChapters() {
  const class10 = catalog[0].classes[0];
  const chapters = class10.subjects.flatMap((s) =>
    s.chapters.map((c) => ({ subject: s, chapter: c })),
  );

  return (
    <section id="chapters" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Featured
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground text-balance sm:text-5xl">
              A few chapters to begin with.
            </h2>
          </div>
          <a
            href="#"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {chapters.slice(0, 6).map(({ subject, chapter }, i) => (
            <Link
              key={chapter.slug}
              to="/read/$chapterSlug"
              params={{ chapterSlug: chapter.slug }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                i === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${accentBg[subject.accent]}`}
                >
                  {subject.name}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Clock className="h-3 w-3" /> {chapter.minutes} min
                </span>
              </div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Class 10 · Ch {chapter.number}
              </p>
              <h3 className="mt-1 font-display text-2xl font-medium leading-snug text-foreground">
                {chapter.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {chapter.summary}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read chapter
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- BENEFITS ---------- */
const benefits = [
  { icon: BadgeCheck, title: "Aligned to your syllabus", body: "Chapter numbers and topic order match your NCERT and ICSE prescribed books." },
  { icon: ShieldCheck, title: "Ad-free, always", body: "No pop-ups, no autoplay, no dark patterns. Just what you came to read." },
  { icon: Compass, title: "Board-aware navigation", body: "Switch between CBSE and ICSE in one click. Your progress stays with you." },
  { icon: Lightbulb, title: "Written by teachers", body: "Real teachers write, review and refine every chapter with editorial care." },
];

export function Benefits() {
  return (
    <section className="border-y border-border bg-parchment/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Benefits" title="Small details, deeply considered." />
        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title}>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-saffron/25 text-clay">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- JOURNEY ---------- */
const steps = [
  { n: "01", icon: Compass, title: "Pick your board & class", body: "Choose CBSE or ICSE and the grade you're in. Your library will assemble itself around you." },
  { n: "02", icon: BookOpenText, title: "Read the chapter", body: "Long-form reading with a live table of contents, bookmarks and reading progress." },
  { n: "03", icon: Target, title: "Practise the concept", body: "Solve worked examples, take short quizzes, and revisit any block that felt slippery." },
  { n: "04", icon: Star, title: "Revise before the exam", body: "Auto-generated flashcards and summaries appear from what you've already read." },
];

export function Journey() {
  return (
    <section id="journey" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Your journey"
          title="Four calm steps, from first chapter to exam-ready."
        />
        <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Step {s.n}
              </p>
              <h3 className="mt-1 font-display text-xl font-medium text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="absolute right-0 top-5 hidden h-px w-1/2 bg-gradient-to-r from-border to-transparent lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- COMING SOON ---------- */
const coming = [
  { icon: PlayCircle, title: "Interactive animations", body: "Scrub through ray diagrams, orbit models, and dynamic proofs." },
  { icon: Atom, title: "Physics simulations", body: "Play with pendulums, circuits and lenses — right on the page." },
  { icon: FlaskConical, title: "Molecule viewer", body: "Rotate 3D molecules and see bonds, angles and reactions." },
  { icon: Leaf, title: "3D biology models", body: "Explore cells, hearts and cross-sections in three dimensions." },
  { icon: Bot, title: "AI tutor", body: "Ask a chapter your questions and get grounded, honest answers." },
  { icon: PenLine, title: "Practice quizzes", body: "Adaptive question sets that meet you where you are." },
  { icon: BookMarked, title: "Flashcards", body: "Auto-generated cards from your read chapters — perfect for revision." },
  { icon: PlayCircle, title: "Video lessons", body: "Short, focused teacher-led videos to complement the reading." },
  { icon: LineChart, title: "Progress tracking", body: "See how deeply you've read, not just how many chapters you clicked." },
];

export function ComingSoon() {
  return (
    <section className="border-y border-border bg-parchment/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="On the way"
          title="A library growing in every direction."
          copy="These features are being built alongside classroom teachers. They'll arrive quietly, and only when they're ready."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coming.map((c) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-dashed border-border bg-card/60 p-6 transition-colors hover:bg-card"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-sage/15 text-sage">
                  <c.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Soon
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-foreground">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
const testimonials = [
  {
    quote:
      "I finally understood the mirror formula. It wasn't the equation — it was how quietly the page explained it.",
    name: "Ananya R.",
    role: "Class 10, Bengaluru",
  },
  {
    quote:
      "It feels like a beautifully printed book, but it's a website. My students actually want to read it.",
    name: "Rakesh Menon",
    role: "Physics teacher, Kochi",
  },
  {
    quote:
      "The chapters feel calm. There's nothing shouting at me to click. That alone is worth it.",
    name: "Ishaan G.",
    role: "Class 12, Pune",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="From students and teachers" title="What people are saying." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <Quote className="h-6 w-6 text-saffron" />
              <blockquote className="mt-4 flex-1 font-display text-xl italic leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4 text-sm">
                <div className="font-medium text-foreground">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const faqs = [
  {
    q: "Which boards and classes does Vidyana cover?",
    a: "Vidyana is built for CBSE and ICSE students in Classes 6 through 12. We start with core subjects and add languages and social sciences over time.",
  },
  {
    q: "Is Vidyana free to use?",
    a: "The core reading experience is free for every student in India. Some future features — like the AI tutor and adaptive practice — will be part of an optional subscription.",
  },
  {
    q: "Who writes the chapters?",
    a: "Every chapter is written by classroom teachers, reviewed by subject experts, and edited for clarity. Nothing is copied from prescribed textbooks.",
  },
  {
    q: "Does it work on my phone?",
    a: "Yes. Vidyana is fully responsive — the reader adapts to mobiles, tablets, and desktops, with sidebars collapsing when you need the room.",
  },
  {
    q: "Do I need to create an account?",
    a: "You can read without signing up. An account is only needed if you want to save bookmarks, track progress and sync across devices.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Questions
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground text-balance sm:text-5xl">
            Everything you might want to know.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Can't find your answer? Reach out — we usually reply within a day.
          </p>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Contact us <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div>
          <ul className="divide-y divide-border border-y border-border">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg font-medium text-foreground">{f.q}</span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border transition-transform ${
                        isOpen ? "bg-primary text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-6 text-[15px] leading-relaxed text-muted-foreground animate-fade-in">
                      {f.a}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
export function BottomCTA() {
  return (
    <section className="pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-8 py-16 text-center sm:px-16 sm:py-20">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, oklch(0.76 0.16 62 / 0.25), transparent 55%), radial-gradient(circle at 80% 80%, oklch(0.55 0.2 265 / 0.35), transparent 55%)",
            }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-medium tracking-tight text-ivory text-balance sm:text-5xl">
              Open your first chapter today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/70">
              A single click. No sign-up. See what a beautifully made lesson feels like.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/read/$chapterSlug"
                params={{ chapterSlug: "reflection-of-light" }}
                className="inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 text-sm font-medium text-ink shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Read: Reflection of Light <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#subjects"
                className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-6 py-3 text-sm font-medium text-ivory hover:bg-ivory/5"
              >
                Browse subjects
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Utility heading ---------- */
function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground text-balance sm:text-5xl">
        {title}
      </h2>
      {copy && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{copy}</p>}
    </div>
  );
}
