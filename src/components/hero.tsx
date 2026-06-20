import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Play, Info, Star } from "lucide-react";
import { heroSlides } from "@/lib/data";

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(id);
  }, []);
  const m = heroSlides[i];

  return (
    <section className="relative h-[70vh] min-h-[500px] sm:h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={m.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img src={m.backdrop} alt="" className="h-full w-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />

      <div className="relative z-10 h-full flex items-end sm:items-center">
        <div className="px-4 sm:px-6 lg:px-10 max-w-2xl pb-24 sm:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block mb-3 rounded-full glass px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                ⚡ Featured Now
              </span>
              <h1 className="text-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl">
                {m.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" />{m.rating}</span>
                <span>{m.year}</span>
                <span>{m.duration}</span>
                <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold">{m.quality}</span>
                {m.genres.slice(0, 2).map((g) => (
                  <span key={g} className="rounded-full border border-white/20 px-2 py-0.5 text-xs">{g}</span>
                ))}
              </div>
              <p className="mt-4 text-base sm:text-lg text-white/85 line-clamp-3 max-w-xl">
                {m.description}
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/movie/$id"
                  params={{ id: m.id }}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm sm:text-base font-bold text-white shadow-[var(--shadow-glow)] hover:scale-105 transition"
                >
                  <Play className="h-5 w-5 fill-white" /> Watch Now
                </Link>
                <Link
                  to="/movie/$id"
                  params={{ id: m.id }}
                  className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3 text-sm sm:text-base font-bold text-white hover:bg-white/10 transition"
                >
                  <Info className="h-5 w-5" /> More Info
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        {heroSlides.map((_, idx) => (
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
