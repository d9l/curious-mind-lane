import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import "katex/dist/katex.min.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";


function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Error 404</p>
        <h1 className="mt-4 font-display text-6xl font-medium text-foreground">Lost the thread.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page isn't in our syllabus. Let's get you back to the library.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-medium tracking-tight text-foreground">
          Something interrupted the lesson
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again — or head back to the home page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Vidyana — Learn CBSE & ICSE, beautifully",
      },
      {
        name: "description",
        content:
          "Vidyana is a modern learning platform for Class 6–12 students. Read chapters designed like a great textbook, take interactive quizzes, and study with calm.",
      },
      { name: "author", content: "Vidyana" },
      { name: "theme-color", content: "#f7f2e6" },
      { property: "og:title", content: "Vidyana — Learn CBSE & ICSE, beautifully" },
      {
        property: "og:description",
        content:
          "Vidyana is a modern learning platform for Class 6–12 students. Read chapters designed like a great textbook, take interactive quizzes, and study with calm.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Vidyana — Learn CBSE & ICSE, beautifully" },
      { name: "twitter:description", content: "Vidyana is a modern learning platform for Class 6–12 students. Read chapters designed like a great textbook, take interactive quizzes, and study with calm." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/af6ee0f7-a4d3-4158-b3b3-914986274d27/id-preview-b040ffb1--7e7e7630-2a35-46e8-9fc7-287ce2dda0f5.lovable.app-1783959134044.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/af6ee0f7-a4d3-4158-b3b3-914986274d27/id-preview-b040ffb1--7e7e7630-2a35-46e8-9fc7-287ce2dda0f5.lovable.app-1783959134044.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    import("@/integrations/supabase/client").then(({ supabase }) => {
      if (!mounted) return;
      const { data: sub } = supabase.auth.onAuthStateChange((event) => {
        if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      });
      (window as unknown as { __authSub?: { unsubscribe: () => void } }).__authSub = sub.subscription;
    });
    return () => {
      mounted = false;
      const w = window as unknown as { __authSub?: { unsubscribe: () => void } };
      w.__authSub?.unsubscribe();
    };
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <SonnerToaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

