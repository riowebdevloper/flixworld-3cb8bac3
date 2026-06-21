import { Link } from "@tanstack/react-router";
import { Star, Play } from "lucide-react";
import { posterUrl, year, detailPath, type Media } from "@/lib/tmdb";

export function MovieCard({ media, index = 0 }: { media: Media; index?: number }) {
  const yr = year(media.release_date);
  const path = detailPath(media);
  // Eager-load only the first few cards in the viewport; rest lazy
  const eager = index < 4;

  return (
    <div className="group relative shrink-0 w-[150px] sm:w-[180px] md:w-[200px]">
      <Link
        to={path}
        className="block relative aspect-[2/3] overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
      >
        <img
          src={posterUrl(media.poster_path, "w342")}
          alt={`${media.title} poster`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "low"}
          width={342}
          height={513}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1 z-10">
          <span className="glass rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
            <Star className="h-2.5 w-2.5 fill-gold text-gold" />
            {media.vote_average.toFixed(1)}
          </span>
          <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground uppercase">
            {media.media_type === "tv" ? "Series" : "Movie"}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 bg-[var(--gradient-card)]">
          <h3 className="text-sm font-semibold text-white line-clamp-2">{media.title}</h3>
          {yr && <p className="text-xs text-white/60 mt-0.5">{yr}</p>}
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="rounded-full bg-primary p-3 shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
            <Play className="h-5 w-5 text-white fill-white" />
          </span>
        </div>
      </Link>
    </div>
  );
}
