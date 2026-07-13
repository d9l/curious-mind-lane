// Reusable content-block schema for chapter reading. Add new block types by
// extending the union and handling them in ChapterBlock.tsx.

export type Block =
  | { type: "heading"; level: 2 | 3; id?: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; caption?: string; alt: string; ratio?: "video" | "square" | "wide" }
  | { type: "formula"; latex: string; label?: string; note?: string }
  | { type: "definition"; term: string; body: string }
  | { type: "note"; title?: string; body: string }
  | { type: "warning"; title?: string; body: string }
  | { type: "example"; title: string; problem: string; solution: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "accordion"; items: { q: string; a: string }[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "diagram"; label: string; hint?: string }
  | { type: "animation"; label: string; hint?: string }
  | { type: "quiz"; question: string; choices: string[]; answerIndex: number };

export interface ChapterContent {
  slug: string;
  objectives: string[];
  blocks: Block[];
  summary: string[];
  keyTakeaways: string[];
  practice: { q: string; hint?: string }[];
  faq: { q: string; a: string }[];
}

// Original demonstration content — Class 10 Physics: Reflection of Light.
// Written from scratch; do not copy from any textbook.
export const chapterContent: Record<string, ChapterContent> = {
  "reflection-of-light": {
    slug: "reflection-of-light",
    objectives: [
      "Explain what light is and why it can bounce off surfaces.",
      "State and apply the two laws of reflection.",
      "Distinguish real from virtual images with confidence.",
      "Derive the mirror formula and use it to solve numerical problems.",
      "Recognise real-world uses of concave and convex mirrors.",
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "intro",
        text: "Introduction",
      },
      {
        type: "paragraph",
        text: "Every morning, before you notice it, light is already at work — bouncing off the walls, off your notebook, off the face in the mirror. Reflection is the quiet trick that makes seeing possible. This chapter unpacks that trick with the precision of geometry and the curiosity of a first observation.",
      },
      {
        type: "quote",
        text: "The camera obscura, mirrors of polished bronze, the still surface of a lake — for thousands of years, humans have been asking the same question: why can I see myself?",
      },
      {
        type: "heading",
        level: 2,
        id: "nature",
        text: "The Nature of Light",
      },
      {
        type: "paragraph",
        text: "Light travels in straight lines through a uniform medium. We call this the rectilinear propagation of light. When those straight rays meet a surface, three things can happen: they can pass through (transmission), be absorbed (absorption), or bounce back (reflection). Most surfaces do a mixture of all three; a good mirror is unusual in how strongly it prefers to reflect.",
      },
      {
        type: "definition",
        term: "Reflection",
        body: "The phenomenon in which light rays incident on a surface bounce back into the same medium, obeying a strict geometrical rule at the point of contact.",
      },
      {
        type: "heading",
        level: 2,
        id: "laws",
        text: "The Two Laws of Reflection",
      },
      {
        type: "paragraph",
        text: "Reflection is not chaotic. It follows two remarkably simple laws that you can verify with a torch, a mirror and a protractor on your desk.",
      },
      {
        type: "note",
        title: "First Law",
        body: "The angle of incidence is always equal to the angle of reflection. Both are measured from the normal — the imaginary line perpendicular to the surface at the point where the ray strikes.",
      },
      {
        type: "note",
        title: "Second Law",
        body: "The incident ray, the reflected ray, and the normal at the point of incidence all lie in the same plane.",
      },
      {
        type: "diagram",
        label: "Incident ray, normal and reflected ray on a plane mirror",
        hint: "Two equal angles measured from the normal, both rays in one plane.",
      },
      {
        type: "heading",
        level: 2,
        id: "plane",
        text: "Plane Mirrors",
      },
      {
        type: "paragraph",
        text: "A plane mirror is the mirror you already know — flat, silvered on the back. When you stand in front of one, the image you see is virtual (it cannot be caught on a screen), the same size as you, laterally inverted (your left hand appears as the image's right), and it appears to be as far behind the mirror as you are in front of it.",
      },
      {
        type: "table",
        headers: ["Property", "Plane mirror image"],
        rows: [
          ["Nature", "Virtual and erect"],
          ["Size", "Same size as object"],
          ["Position", "As far behind as object is in front"],
          ["Inversion", "Laterally inverted"],
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "spherical",
        text: "Spherical Mirrors",
      },
      {
        type: "paragraph",
        text: "A spherical mirror is a small slice cut from a hollow sphere with one side polished. If the polished side is on the inside of the curve, we get a concave mirror; if it is on the outside, we get a convex mirror. Concave mirrors converge parallel rays to a single focus; convex mirrors make them appear to diverge from a focus behind the mirror.",
      },
      {
        type: "definition",
        term: "Principal focus (F)",
        body: "The point on the principal axis where parallel rays either converge (concave) or appear to diverge from (convex) after reflection.",
      },
      {
        type: "definition",
        term: "Centre of curvature (C)",
        body: "The centre of the imaginary sphere of which the mirror is a part. For a concave mirror, C lies in front; for a convex mirror, it lies behind.",
      },
      {
        type: "animation",
        label: "Ray diagram: object moving through F, C on a concave mirror",
        hint: "Interactive scrubber showing image size and inversion changing with position.",
      },
      {
        type: "heading",
        level: 2,
        id: "formula",
        text: "The Mirror Formula & Magnification",
      },
      {
        type: "paragraph",
        text: "For any spherical mirror, the object distance (u), image distance (v) and focal length (f) are related by a single, beautiful equation.",
      },
      {
        type: "formula",
        latex: "1/v + 1/u = 1/f",
        label: "Mirror formula",
        note: "Use the New Cartesian Sign Convention: distances measured against the direction of incident light are negative.",
      },
      {
        type: "formula",
        latex: "m = -v/u = h'/h",
        label: "Linear magnification",
        note: "A positive m means the image is virtual and erect; a negative m means real and inverted.",
      },
      {
        type: "example",
        title: "Example — Locating an image",
        problem:
          "An object is placed 20 cm in front of a concave mirror of focal length 15 cm. Find the position, nature and size of the image.",
        solution: [
          "Given u = -20 cm, f = -15 cm.",
          "Using 1/v + 1/u = 1/f, we get 1/v = 1/(-15) - 1/(-20) = -1/60.",
          "So v = -60 cm. The image is 60 cm in front of the mirror.",
          "Magnification m = -v/u = -(-60)/(-20) = -3.",
          "The negative sign shows the image is real and inverted; its size is 3× the object.",
        ],
      },
      {
        type: "warning",
        title: "Sign conventions matter",
        body: "Half of all mirror-formula errors come from mishandling signs. Always draw the axis first, mark the direction of incident light as positive, and only then substitute values.",
      },
      {
        type: "heading",
        level: 2,
        id: "uses",
        text: "Everyday Applications",
      },
      {
        type: "paragraph",
        text: "Concave mirrors gather light — that is why they sit behind torch bulbs and inside solar cookers, and why dentists use small ones to enlarge a tooth. Convex mirrors spread the view — the reason they appear as rear-view mirrors on scooters, blind-spot mirrors in shops, and along winding hill roads.",
      },
      {
        type: "accordion",
        items: [
          {
            q: "Why is the image in a spoon upside-down?",
            a: "The inside of a spoon acts as a concave mirror. When your face is farther than its focal length, the image formed is real and inverted.",
          },
          {
            q: "Why do convex mirrors always show a smaller image?",
            a: "Because they diverge reflected rays, the image is always virtual, erect and diminished — which is exactly why they give you a wider field of view.",
          },
        ],
      },
      {
        type: "image",
        alt: "Diagram placeholder — reflection on a curved mirror",
        caption: "Diagrams and illustrations will render here once assets are wired in.",
        ratio: "video",
      },
    ],
    summary: [
      "Light travels in straight lines and reflects off surfaces following two simple laws.",
      "Plane mirrors form virtual, erect, laterally inverted images of the same size as the object.",
      "Spherical mirrors come in two flavours: converging (concave) and diverging (convex).",
      "The mirror formula 1/v + 1/u = 1/f, paired with the New Cartesian sign convention, solves nearly every image-location problem you will meet.",
    ],
    keyTakeaways: [
      "Angle of incidence equals angle of reflection — always measured from the normal.",
      "Concave mirrors can produce real or virtual images depending on where the object sits.",
      "Convex mirrors only produce virtual, diminished, erect images — perfect for wide field-of-view.",
      "Magnification tells you both the size ratio and the orientation of the image.",
    ],
    practice: [
      {
        q: "State the two laws of reflection and illustrate them with a labelled ray diagram.",
      },
      {
        q: "An object 4 cm tall is placed 25 cm in front of a concave mirror of focal length 10 cm. Find the position, size and nature of the image.",
        hint: "Use the mirror formula, then the magnification formula.",
      },
      {
        q: "Why do we prefer convex mirrors as rear-view mirrors in vehicles?",
      },
      {
        q: "Define the principal focus of a concave mirror. What is its focal length in terms of the radius of curvature?",
      },
    ],
    faq: [
      {
        q: "Is the image in a plane mirror really the same distance behind it?",
        a: "Yes — for an ideal plane mirror. You can verify this by placing an object near the mirror and measuring both distances; they always match.",
      },
      {
        q: "Why does the mirror formula use negative signs?",
        a: "The New Cartesian sign convention treats distances measured against the direction of incident light as negative. This keeps a single formula valid for both concave and convex mirrors.",
      },
      {
        q: "Can a convex mirror ever form a real image?",
        a: "No. Regardless of where you place the object, a convex mirror always forms a virtual, erect, diminished image behind it.",
      },
    ],
  },
};
