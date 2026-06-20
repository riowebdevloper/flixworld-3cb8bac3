import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Play, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import type { Movie } from "@/lib/data";

export function QuickView({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-3xl glass rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 rounded-full glass p-2 hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="relative aspect-video">
            <img src={movie.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>
          <div className="p-6 -mt-20 relative">
            <h2 className="text-3xl text-display font-bold text-white">{movie.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" />{movie.rating}</span>
              <span>{movie.year}</span>
              <span>{movie.duration}</span>
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">{movie.quality}</span>
            </div>
            <p className="mt-4 text-white/80 leading-relaxed">{movie.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g} className="rounded-full glass px-3 py-1 text-xs text-white/80">{g}</span>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                to="/movie/$id"
                params={{ id: movie.id }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] hover:scale-[1.03] transition"
              >
                <Play className="h-4 w-4 fill-white" /> Watch Now
              </Link>
              <button className="inline-flex items-center gap-2 rounded-lg glass px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                <Plus className="h-4 w-4" /> My List
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
