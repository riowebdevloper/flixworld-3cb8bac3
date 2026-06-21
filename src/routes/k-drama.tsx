import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { MovieGrid } from "@/components/movie-grid";
import { fetchCategory } from "@/lib/tmdb.functions";
import { CategoryPageSkeleton } from "@/components/skeletons";

const q = queryOptions({
  queryKey: ["category", "kdrama"],
  queryFn: () => fetchCategory({ data: { kind: "kdrama", page: 1 } }),
  staleTime: 1000 * 60 * 30,
});

export const Route = createFileRoute("/k-drama")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  head: () => ({
    meta: [
      { title: "K-Drama — FlixWorld.fun" },
      { name: "description", content: "The best Korean dramas streaming on FlixWorld.fun." },
      { property: "og:title", content: "K-Drama — FlixWorld.fun" },
      { property: "og:url", content: "/k-drama" },
    ],
    links: [{ rel: "canonical", href: "/k-drama" }],
  }),
  component: Page,
  pendingComponent: CategoryPageSkeleton,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="pt-24 text-center text-white/70">
        <p>Could not load this page. Please try again.</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded bg-primary px-4 py-2 text-white">Retry</button>
      </div>
    );
  },
});

function Page() {
  const { data } = useSuspenseQuery(q);
  return (
    <div className="pt-6">
      <h1 className="px-4 sm:px-6 lg:px-10 text-display text-4xl sm:text-5xl font-bold text-white">K-Drama</h1>
      <p className="px-4 sm:px-6 lg:px-10 mt-2 text-white/60">Romance, thrillers and prestige drama from Korea.</p>
      <MovieGrid items={data.results} />
    </div>
  );
}
