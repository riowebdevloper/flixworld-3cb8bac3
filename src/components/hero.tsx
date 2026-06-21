import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Info, Star } from "lucide-react";
import { backdropUrl, detailPath, year, type Media } from "@/lib/tmdb";

export function Hero({ slides }: { slides: Media[] }) {
  const list = slides.slice(0, 6);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % list.length), 6500);
    return () => clearInterval(id);
  }, [list.length]);

  if (!list.length) {
    return <section className="h-[70vh] min-h-[500px] w-full bg-surface animate-pulse" />;
  }
  const m = list[i];

  return (
    <section className="relative h-[70vh] min-h-[500px] sm:h-[85vh] w-full overflow-hidden">
      <img
        key={`${m.media_type}-${m.id}`}
        src={backdropUrl(m.backdrop_path)}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover animate-[fadeIn_700ms_ease-out]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />

      <div className="relative z-10 h-full flex items-end sm:items-center">
        <div className="px-4 sm:px-6 lg:px-10 max-w-2xl pb-24 sm:pb-0">
          <div key={`${m.media_type}-${m.id}`} className="animate-[slideUp_500ms_ease-out]">
            <span className="inline-block mb-3 rounded-full glass px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              ⚡ Featured Now
            </span>
            <h1 className="text-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl">
              {m.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" />{m.vote_average.toFixed(1)}</span>
              {year(m.release_date) && <span>{year(m.release_date)}</span>}
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase">
                {m.media_type === "tv" ? "Series" : "Movie"}
              </span>
            </div>
            <p className="mt-4 text-base sm:text-lg text-white/85 line-clamp-3 max-w-xl">{m.overview}</p>
            <div className="mt-6 flex gap-3">
              <Link to={detailPath(m)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm sm:text-base font-bold text-white shadow-[var(--shadow-glow)] hover:scale-105 transition">
                <Play className="h-5 w-5 fill-white" /> Watch Trailer
              </Link>
              <Link to={detailPath(m)} className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3 text-sm sm:text-base font-bold text-white hover:bg-white/10 transition">
                <Info className="h-5 w-5" /> More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        {list.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-4 bg-white/30"}`}
          />
        ))}
      </div>
    </section>
  );
}
