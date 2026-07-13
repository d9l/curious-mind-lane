import { type Block } from "@/data/chapter-content";
import {
  Info,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Beaker,
  Play,
  Image as ImageIcon,
  Plus,
  Minus,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";

export function ChapterBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const H = block.level === 2 ? "h2" : "h3";
      return (
        <H
          id={block.id}
          className={`scroll-mt-28 font-display font-medium tracking-tight text-foreground ${
            block.level === 2 ? "mt-14 text-3xl sm:text-4xl" : "mt-10 text-2xl"
          }`}
        >
          {block.text}
        </H>
      );
    }
    case "paragraph":
      return <p className="mt-5 text-[17px] leading-[1.8] text-foreground/85">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-saffron pl-6 font-display text-xl italic leading-relaxed text-foreground/80">
          “{block.text}”
          {block.cite && (
            <cite className="mt-2 block font-sans text-sm not-italic text-muted-foreground">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      );
    case "definition":
      return (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Definition
          </div>
          <div className="mt-3 font-display text-xl font-medium text-foreground">
            {block.term}
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{block.body}</p>
        </div>
      );
    case "formula":
      return (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-ink text-ivory">
          <div className="flex items-center justify-between border-b border-ivory/10 px-5 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
              {block.label ?? "Formula"}
            </span>
            <span className="font-mono text-[10px] text-ivory/40">LaTeX</span>
          </div>
          <div className="px-5 py-8 text-center font-display text-3xl italic text-ivory sm:text-4xl">
            {block.latex}
          </div>
          {block.note && (
            <div className="border-t border-ivory/10 bg-ivory/[0.03] px-5 py-3 text-sm text-ivory/70">
              {block.note}
            </div>
          )}
        </div>
      );
    case "note":
      return (
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.06] p-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <Info className="h-3.5 w-3.5" /> {block.title ?? "Note"}
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{block.body}</p>
        </div>
      );
    case "warning":
      return (
        <div className="mt-8 rounded-2xl border border-clay/30 bg-clay/[0.08] p-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
            <AlertTriangle className="h-3.5 w-3.5" /> {block.title ?? "Watch out"}
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{block.body}</p>
        </div>
      );
    case "example":
      return (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border bg-parchment/60 px-6 py-3">
            <Beaker className="h-4 w-4 text-sage" />
            <span className="font-display text-sm font-semibold text-foreground">
              {block.title}
            </span>
          </div>
          <div className="p-6">
            <p className="text-[15px] leading-relaxed text-foreground/90">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Problem
              </span>
              <br />
              {block.problem}
            </p>
            <ol className="mt-5 space-y-2 border-l-2 border-primary/40 pl-5 text-[15px] leading-relaxed text-foreground/85">
              {block.solution.map((s, i) => (
                <li key={i}>
                  <span className="mr-2 font-mono text-xs text-primary">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      );
    case "table":
      return (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-parchment/50 text-left">
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  {r.map((c, j) => (
                    <td key={j} className="px-5 py-3 text-foreground/85">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "image":
      return (
        <figure className="mt-8">
          <div
            className={`grid place-items-center rounded-2xl border border-dashed border-border bg-parchment/50 text-muted-foreground ${
              block.ratio === "square"
                ? "aspect-square"
                : block.ratio === "wide"
                  ? "aspect-[21/9]"
                  : "aspect-video"
            }`}
          >
            <div className="text-center">
              <ImageIcon className="mx-auto h-6 w-6" />
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest">{block.alt}</p>
            </div>
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm italic text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "diagram":
      return (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-parchment to-card">
          <div className="grid aspect-[16/9] place-items-center">
            <div className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-base text-foreground">{block.label}</p>
              {block.hint && <p className="mt-1 text-xs text-muted-foreground">{block.hint}</p>}
            </div>
          </div>
          <div className="border-t border-border bg-card/60 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Diagram placeholder
          </div>
        </div>
      );
    case "animation":
      return (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-ink/95">
          <div className="grid aspect-[16/9] place-items-center text-ivory">
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-saffron text-ink">
                <Play className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-lg">{block.label}</p>
              {block.hint && <p className="mt-1 text-xs text-ivory/60">{block.hint}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-ivory/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ivory/50">
            <span>Interactive animation</span>
            <span>Coming soon</span>
          </div>
        </div>
      );
    case "accordion": {
      return <AccordionBlock items={block.items} />;
    }
    case "quiz":
      return <QuizBlock question={block.question} choices={block.choices} answer={block.answerIndex} />;
    default:
      return null;
  }
}

function AccordionBlock({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-6 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base font-medium text-foreground">{it.q}</span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border">
                {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </span>
            </button>
            {isOpen && (
              <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted-foreground animate-fade-in">
                {it.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuizBlock({
  question,
  choices,
  answer,
}: {
  question: string;
  choices: string[];
  answer: number;
}) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-saffron">
        <Sparkles className="h-3.5 w-3.5" /> Quick check
      </div>
      <p className="mt-3 font-display text-lg font-medium text-foreground">{question}</p>
      <div className="mt-4 grid gap-2">
        {choices.map((c, i) => {
          const chosen = pick === i;
          const correct = pick !== null && i === answer;
          const wrong = chosen && i !== answer;
          return (
            <button
              key={i}
              onClick={() => setPick(i)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                correct
                  ? "border-sage/50 bg-sage/10"
                  : wrong
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-border bg-background hover:bg-muted"
              }`}
            >
              <span>{c}</span>
              {correct && <Check className="h-4 w-4 text-sage" />}
              {wrong && <X className="h-4 w-4 text-destructive" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
