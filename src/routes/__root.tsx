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
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Footer } from "@/components/footer";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-8xl font-bold gradient-text-accent">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Page not found</h2>
        <p className="mt-2 text-sm text-white/60">
          The title you're looking for has gone off the grid.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-glow)] hover:scale-105 transition">
            Back home
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-white">This page didn't load</h1>
        <p className="mt-2 text-sm text-white/60">Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >Try again</button>
          <a href="/" className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white">Go home</a>
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
      { title: "FlixWorld.fun — Stream Movies, Web Series, Anime & K-Drama" },
      { name: "description", content: "FlixWorld.fun — your premium destination for the latest movies, trending web series, anime and K-drama in HD & 4K." },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:site_name", content: "FlixWorld.fun" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "FlixWorld.fun — Stream Movies, Web Series, Anime & K-Drama" },
      { property: "og:description", content: "FlixWorld.fun — your premium destination for the latest movies, trending web series, anime and K-drama in HD & 4K." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FlixWorld.fun — Stream Movies, Web Series, Anime & K-Drama" },
      { name: "twitter:description", content: "FlixWorld.fun — your premium destination for the latest movies, trending web series, anime and K-drama in HD & 4K." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e802454a-3af7-40b5-86f7-563fa85a13d5" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e802454a-3af7-40b5-86f7-563fa85a13d5" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap" },
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
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 pb-20 lg:pb-0">
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
      </div>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </QueryClientProvider>
  );
}
