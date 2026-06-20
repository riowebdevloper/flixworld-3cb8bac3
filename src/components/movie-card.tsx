import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import { useState } from "react";
import type { Movie } from "@/lib/data";
import { QuickView } from "./quick-view";

export function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
        className="group relative shrink-0 w-[150px] sm:w-[180px] md:w-[200px]"
      >
        <Link
          to="/movie/$id"
          params={{ id: movie.id }}
          className="block relative aspect-[2/3] overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
        >
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Top badges */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1 z-10">
            <span className="glass rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-gold text-gold" />
              {movie.rating.toFixed(1)}
            </span>
            <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              {movie.quality}
            </span>
          </div>
          {/* Bottom gradient + info */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-[var(--gradient-card)]">
            <h3 className="text-sm font-semibold text-white line-clamp-2">{movie.title}</h3>
            <p className="text-xs text-white/60 mt-0.5">{movie.year}</p>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              className="rounded-full bg-primary p-3 shadow-[var(--shadow-glow)] hover:scale-110 transition-transform"
              aria-label="Quick view"
            >
              <Play className="h-5 w-5 text-white fill-white" />
            </button>
          </div>
        </Link>
      </motion.div>
      {open && <QuickView movie={movie} onClose={() => setOpen(false)} />}
    </>
  );
}
