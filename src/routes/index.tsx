import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SearchDialog } from "@/components/site/SearchDialog";
import {
  Hero,
  Subjects,
  Features,
  FeaturedChapters,
  Benefits,
  Journey,
  ComingSoon,
  Testimonials,
  FAQ,
  BottomCTA,
} from "@/components/site/HomeSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vidyana — Learn CBSE & ICSE, beautifully" },
      {
        name: "description",
        content:
          "Vidyana is a modern learning platform for Class 6–12 students. Read chapters designed like a great textbook, take interactive quizzes, and study with calm.",
      },
      { property: "og:title", content: "Vidyana — Learn CBSE & ICSE, beautifully" },
      {
        property: "og:description",
        content:
          "Vidyana is a modern learning platform for Class 6–12 students. Read chapters designed like a great textbook, take interactive quizzes, and study with calm.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader onOpenSearch={() => setSearchOpen(true)} />
      <main>
        <Hero />
        <Subjects />
        <Features />
        <FeaturedChapters />
        <Benefits />
        <Journey />
        <Testimonials />
        <ComingSoon />
        <FAQ />
        <BottomCTA />
      </main>
      <SiteFooter />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
