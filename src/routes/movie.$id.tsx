import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Play, Plus, Star, Share2, ChevronLeft } from "lucide-react";
import { getById, movies, type Movie } from "@/lib/data";
import { Row } from "@/components/row";

export const Route = createFileRoute("/movie/$id")({
  loader: ({ params }): { movie: Movie } => {
    const m = getById(params.id);
    if (!m) throw notFound();
    return { movie: m };
  },
  head: ({ loaderData, params }) => {
    const m = loaderData?.movie;
    const title = m ? `${m.title} (${m.year}) — Watch on FlixWorld` : "Movie — FlixWorld.fun";
    const desc = m?.description ?? "Watch on FlixWorld.fun";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "video.movie" },
        { property: "og:image", content: m?.backdrop ?? "" },
        { property: "og:url", content: `/movie/${params.id}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: m?.backdrop ?? "" },
      ],
      links: [{ rel: "canonical", href: `/movie/${params.id}` }],
      scripts: m ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Movie",
          name: m.title,
          description: m.description,
          image: m.poster,
          datePublished: String(m.year),
          genre: m.genres,
          actor: m.cast.map((a) => ({ "@type": "Person", name: a })),
          aggregateRating: { "@type": "AggregateRating", ratingValue: m.rating, bestRating: 10, ratingCount: 1000 },
        }),
      }] : [],
    };
  },
  component: MoviePage,
  notFoundComponent: () => (
    <div className="pt-24 text-center text-white/70">Title not found.</div>
  ),
});

function MoviePage() {
  const { movie: m } = Route.useLoaderData() as { movie: Movie };
  const related = movies.filter((x) => x.id !== m.id && x.genres.some((g) => m.genres.includes(g))).slice(0, 12);

  return (
    <div className="-mt-16">
      {/* Backdrop */}
      <div className="relative h-[60vh] min-h-[420px] sm:h-[75vh] w-full overflow-hidden">
        <img src={m.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <Link to="/" className="absolute top-20 left-4 sm:left-6 lg:left-10 z-10 glass rounded-full p-2 hover:bg-white/10 transition">
          <ChevronLeft className="h-5 w-5 text-white" />
        </Link>
      </div>

      {/* Content */}
      <div className="relative -mt-48 sm:-mt-64 px-4 sm:px-6 lg:px-10 z-10">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] md:grid-cols-[260px_1fr] max-w-6xl mx-auto">
          <img
            src={m.poster}
            alt={`${m.title} poster`}
            className="rounded-2xl shadow-[var(--shadow-card)] w-full max-w-[200px] sm:max-w-none"
          />
          <div className="min-w-0">
            <h1 className="text-display text-4xl sm:text-6xl font-bold text-white drop-shadow-2xl">{m.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" />{m.rating} / 10</span>
              <span>{m.year}</span>
              <span>{m.duration}</span>
              <span>{m.language}</span>
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">{m.quality}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.genres.map((g) => (
                <span key={g} className="rounded-full glass px-3 py-1 text-xs text-white/80">{g}</span>
              ))}
            </div>
            <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed max-w-3xl">{m.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#trailer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:scale-105 transition">
                <Play className="h-5 w-5 fill-white" /> Watch Trailer
              </a>
              <button className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition">
                <Plus className="h-5 w-5" /> My List
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition">
                <Share2 className="h-5 w-5" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        <section className="max-w-6xl mx-auto mt-12">
          <h2 className="text-display text-2xl font-bold text-white">Cast</h2>
          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {m.cast.map((c) => (
              <div key={c} className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-primary font-bold shrink-0">
                  {c.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <span className="text-sm text-white/90 truncate">{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trailer */}
        <section id="trailer" className="max-w-6xl mx-auto mt-12">
          <h2 className="text-display text-2xl font-bold text-white">Trailer</h2>
          <div className="mt-4 aspect-video rounded-2xl overflow-hidden glass">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${m.trailerId}`}
              title={`${m.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <Row title="More Like This" movies={related} />
        </div>
      )}
    </div>
  );
}
