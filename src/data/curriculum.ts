// Curriculum catalog — extensible schema for boards → classes → subjects → chapters → topics.
// Add new entries here; UI reads from these arrays.

export type Board = "CBSE" | "ICSE";

export interface Topic {
  id: string;
  title: string;
}

export interface Chapter {
  id: string;
  slug: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // lucide icon name (kept as string to decouple data from components)
  accent: "indigo" | "saffron" | "sage" | "clay" | "ocean";
  chapters: Chapter[];
}

export interface ClassLevel {
  id: string; // e.g. "class-10"
  grade: number;
  label: string;
  subjects: Subject[];
}

export interface BoardCatalog {
  board: Board;
  classes: ClassLevel[];
}

// Sample structure — full-length demo focused on Class 10 Physics.
export const catalog: BoardCatalog[] = [
  {
    board: "CBSE",
    classes: [
      {
        id: "class-10",
        grade: 10,
        label: "Class 10",
        subjects: [
          {
            id: "physics",
            name: "Physics",
            icon: "Atom",
            accent: "indigo",
            chapters: [
              {
                id: "light",
                slug: "reflection-of-light",
                number: 10,
                title: "Reflection of Light",
                summary:
                  "How mirrors bend our world — laws of reflection, image formation, and the mathematics behind curved surfaces.",
                minutes: 24,
                topics: [
                  { id: "intro", title: "Introduction" },
                  { id: "nature", title: "The Nature of Light" },
                  { id: "laws", title: "Laws of Reflection" },
                  { id: "plane", title: "Plane Mirrors" },
                  { id: "spherical", title: "Spherical Mirrors" },
                  { id: "formula", title: "Mirror Formula & Magnification" },
                  { id: "uses", title: "Everyday Applications" },
                  { id: "summary", title: "Summary" },
                  { id: "practice", title: "Practice" },
                  { id: "faq", title: "FAQ" },
                ],
              },
              {
                id: "refraction",
                slug: "refraction-of-light",
                number: 11,
                title: "Refraction of Light",
                summary: "Why a straw looks broken in water — bending of light and the lens equation.",
                minutes: 28,
                topics: [{ id: "intro", title: "Introduction" }],
              },
              {
                id: "human-eye",
                slug: "human-eye-and-colourful-world",
                number: 12,
                title: "Human Eye & the Colourful World",
                summary: "From cornea to rainbow — how our eyes make sense of light.",
                minutes: 22,
                topics: [{ id: "intro", title: "Introduction" }],
              },
              {
                id: "electricity",
                slug: "electricity",
                number: 13,
                title: "Electricity",
                summary: "Charge, current, resistance and the circuits that light our lives.",
                minutes: 32,
                topics: [{ id: "intro", title: "Introduction" }],
              },
            ],
          },
          {
            id: "chemistry",
            name: "Chemistry",
            icon: "FlaskConical",
            accent: "sage",
            chapters: [
              {
                id: "acids",
                slug: "acids-bases-salts",
                number: 2,
                title: "Acids, Bases and Salts",
                summary: "The chemistry that lives in your kitchen and your bloodstream.",
                minutes: 26,
                topics: [{ id: "intro", title: "Introduction" }],
              },
            ],
          },
          {
            id: "biology",
            name: "Biology",
            icon: "Leaf",
            accent: "sage",
            chapters: [
              {
                id: "life-processes",
                slug: "life-processes",
                number: 6,
                title: "Life Processes",
                summary: "Nutrition, respiration, transport — the invisible engines of being alive.",
                minutes: 30,
                topics: [{ id: "intro", title: "Introduction" }],
              },
            ],
          },
          {
            id: "mathematics",
            name: "Mathematics",
            icon: "Sigma",
            accent: "indigo",
            chapters: [
              {
                id: "quadratic",
                slug: "quadratic-equations",
                number: 4,
                title: "Quadratic Equations",
                summary: "Parabolas, roots, and the elegance of the discriminant.",
                minutes: 34,
                topics: [{ id: "intro", title: "Introduction" }],
              },
            ],
          },
          {
            id: "english",
            name: "English",
            icon: "BookOpenText",
            accent: "clay",
            chapters: [],
          },
          {
            id: "history",
            name: "Social Science",
            icon: "Landmark",
            accent: "clay",
            chapters: [],
          },
        ],
      },
      { id: "class-9", grade: 9, label: "Class 9", subjects: [] },
      { id: "class-11", grade: 11, label: "Class 11", subjects: [] },
      { id: "class-12", grade: 12, label: "Class 12", subjects: [] },
    ],
  },
  {
    board: "ICSE",
    classes: [
      { id: "class-10", grade: 10, label: "Class 10", subjects: [] },
      { id: "class-9", grade: 9, label: "Class 9", subjects: [] },
    ],
  },
];

export function findChapterBySlug(slug: string) {
  for (const b of catalog) {
    for (const c of b.classes) {
      for (const s of c.subjects) {
        const ch = s.chapters.find((x) => x.slug === slug);
        if (ch) return { board: b.board, classLevel: c, subject: s, chapter: ch };
      }
    }
  }
  return null;
}

export function allChapters() {
  const out: {
    board: Board;
    classLevel: ClassLevel;
    subject: Subject;
    chapter: Chapter;
  }[] = [];
  for (const b of catalog) {
    for (const c of b.classes) {
      for (const s of c.subjects) {
        for (const ch of s.chapters) {
          out.push({ board: b.board, classLevel: c, subject: s, chapter: ch });
        }
      }
    }
  }
  return out;
}
