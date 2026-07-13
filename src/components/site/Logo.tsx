import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`} aria-label="Vidyana home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
        <BookOpen className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">
        Vidyana
      </span>
    </Link>
  );
}
