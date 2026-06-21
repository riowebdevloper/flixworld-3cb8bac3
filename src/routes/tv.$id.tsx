import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Play, ChevronLeft, Star } from "lucide-react";
import { fetchDetail } from "@/lib/tmdb.functions";
import { backdropUrl, posterUrl, profileUrl, year, officialTrailer } from "@/lib/tmdb";
import { Row } from "@/components/row";
import { MyListButtons } from "@/components/my-list-buttons";
import { AdSlot } from "@/components/ad-slot";
import { DetailPageSkeleton } from "@/components/skeletons";

const detailQ = (id: number) =>
  queryOptions({
    queryKey: ["detail", "tv", id],
    queryFn: () => fetchDetail({ data: { type: "tv", id } }),
    staleTime: 1000 * 60 * 60,
  });

export const Route = createFileRoute("/tv/$id")({
  loader: async ({ params, context }) => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) throw notFound();
    await context.queryClient.ensureQueryData(detailQ(id));
    return { id };
  },
  head: ({ loaderData, params }) => {
    const id = loaderData?.id ?? Number(params.id);
    return {
      meta: [
        { title: "Series — FlixWorld.fun" },
        { property: "og:url", content: `/tv/${id}` },
      ],
      links: [{ rel: "canonical", href: `/tv/${id}` }],
    };
  },
  component: TvPage,
  pendingComponent: DetailPageSkeleton,
  notFoundComponent: () => <div className="pt-24 text-center text-white/70">Title not found.</div>,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="pt-24 text-center text-white/70">
        <p>Could not load this title. Please try again.</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded bg-primary px-4 py-2 text-white">Retry</button>
      </div>
    );
  },
});

function TvPage() {
  const { id } = Route.useLoaderData();
  const { data: m } = useSuspenseQuery(detailQ(id));
  const trailer = officialTrailer(m.videos);
  const yr = year(m.release_date);

  return (
    <div className="-mt-16">
      <div className="relative h-[60vh] min-h-[420px] sm:h-[75vh] w-full overflow-hidden">
        <img src={backdropUrl(m.backdrop_path)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <Link to="/" className="absolute top-20 left-4 sm:left-6 lg:left-10 z-10 glass rounded-full p-2 hover:bg-white/10 transition">
          <ChevronLeft className="h-5 w-5 text-white" />
        </Link>
      </div>

      <div className="relative -mt-48 sm:-mt-64 px-4 sm:px-6 lg:px-10 z-10">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] md:grid-cols-[260px_1fr] max-w-6xl mx-auto">
          <img src={posterUrl(m.poster_path)} alt={`${m.title} poster`}
            className="rounded-2xl shadow-[var(--shadow-card)] w-full max-w-[200px] sm:max-w-none" />
          <div className="min-w-0">
            <h1 className="text-display text-4xl sm:text-6xl font-bold text-white drop-shadow-2xl">{m.title}</h1>
            {m.tagline && <p className="mt-2 text-white/60 italic">{m.tagline}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" />{m.vote_average.toFixed(1)} / 10</span>
              {yr && <span>{yr}</span>}
              {m.number_of_seasons ? <span>{m.number_of_seasons} Season{m.number_of_seasons > 1 ? "s" : ""}</span> : null}
              {m.number_of_episodes ? <span>{m.number_of_episodes} Episodes</span> : null}
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-white uppercase">Series</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.genres.map((g) => (
                <span key={g.id} className="rounded-full glass px-3 py-1 text-xs text-white/80">{g.name}</span>
              ))}
            </div>
            <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed max-w-3xl">{m.overview || "No description available."}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {trailer && (
                <a href="#trailer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:scale-105 transition">
                  <Play className="h-5 w-5 fill-white" /> Watch Trailer
                </a>
              )}
              <MyListButtons media={m} />
            </div>
          </div>
        </div>

        {m.cast.length > 0 && (
          <section className="max-w-6xl mx-auto mt-12">
            <h2 className="text-display text-2xl font-bold text-white">Cast</h2>
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {m.cast.map((c) => (
                <div key={c.id} className="glass rounded-xl p-3 flex items-center gap-3">
                  <img src={profileUrl(c.profile_path)} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-white/90 truncate">{c.name}</div>
                    <div className="text-xs text-white/50 truncate">{c.character}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {trailer && (
          <section id="trailer" className="max-w-6xl mx-auto mt-12">
            <h2 className="text-display text-2xl font-bold text-white">Official Trailer</h2>
            <div className="mt-4 aspect-video rounded-2xl overflow-hidden glass">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                title={`${m.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <AdSlot size="rectangle" />
      </div>

      {m.similar.length > 0 && (
        <div className="mt-6">
          <Row title="More Like This" items={m.similar} />
        </div>
      )}
    </div>
  );
}
