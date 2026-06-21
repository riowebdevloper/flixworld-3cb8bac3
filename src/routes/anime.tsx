import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { MovieGrid } from "@/components/movie-grid";
import { fetchCategory } from "@/lib/tmdb.functions";
import { CategoryPageSkeleton } from "@/components/skeletons";

const q = queryOptions({
  queryKey: ["category", "anime"],
  queryFn: () => fetchCategory({ data: { kind: "anime", page: 1 } }),
  staleTime: 1000 * 60 * 30,
});

export const Route = createFileRoute("/anime")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  head: () => ({
    meta: [
      { title: "Anime — FlixWorld.fun" },
      { name: "description", content: "Watch the best anime series and movies on FlixWorld.fun." },
      { property: "og:title", content: "Anime — FlixWorld.fun" },
      { property: "og:url", content: "/anime" },
    ],
    links: [{ rel: "canonical", href: "/anime" }],
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
      <h1 className="px-4 sm:px-6 lg:px-10 text-display text-4xl sm:text-5xl font-bold text-white">Anime</h1>
      <p className="px-4 sm:px-6 lg:px-10 mt-2 text-white/60">From Shonen to Seinen — the full anime spectrum.</p>
      <MovieGrid items={data.results} />
    </div>
  );
}
