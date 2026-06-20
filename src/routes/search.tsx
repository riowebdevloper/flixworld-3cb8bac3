import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { MovieGrid } from "@/components/movie-grid";
import { movies, allGenres, allLanguages, allYears } from "@/lib/data";

const searchSchema = z.object({
  q: z.string().optional().default(""),
  genre: z.string().optional().default(""),
  year: z.string().optional().default(""),
  rating: z.string().optional().default(""),
  language: z.string().optional().default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Search — FlixWorld.fun" },
      { name: "description", content: "Find movies, web series, anime and K-drama on FlixWorld.fun." },
      { property: "og:title", content: "Search — FlixWorld.fun" },
      { property: "og:url", content: "/search" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const sp = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(sp.q);

  const update = (patch: Partial<typeof sp>) =>
    navigate({ search: (prev: typeof sp) => ({ ...prev, ...patch }) });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return movies.filter((m) => {
      if (query && !m.title.toLowerCase().includes(query)) return false;
      if (sp.genre && !m.genres.includes(sp.genre)) return false;
      if (sp.year && m.year !== parseInt(sp.year, 10)) return false;
      if (sp.rating && m.rating < parseFloat(sp.rating)) return false;
      if (sp.language && m.language !== sp.language) return false;
      return true;
    });
  }, [q, sp.genre, sp.year, sp.rating, sp.language]);

  return (
    <div className="pt-6">
      <div className="px-4 sm:px-6 lg:px-10">
        <h1 className="text-display text-4xl sm:text-5xl font-bold text-white">Search</h1>
        <div className="mt-6 relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); update({ q: e.target.value }); }}
            placeholder="Search for movies, series, anime..."
            className="w-full glass rounded-full pl-12 pr-4 py-3 text-base text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Select label="Genre" value={sp.genre} onChange={(v) => update({ genre: v })} options={allGenres} />
          <Select label="Year" value={sp.year} onChange={(v) => update({ year: v })} options={allYears.map(String)} />
          <Select label="Min Rating" value={sp.rating} onChange={(v) => update({ rating: v })} options={["7", "8", "8.5", "9"]} />
          <Select label="Language" value={sp.language} onChange={(v) => update({ language: v })} options={allLanguages} />
          {(sp.genre || sp.year || sp.rating || sp.language) && (
            <button
              onClick={() => update({ genre: "", year: "", rating: "", language: "" })}
              className="rounded-full px-4 py-1.5 text-sm text-primary hover:bg-primary/10 transition"
            >Clear filters</button>
          )}
        </div>
        <p className="mt-4 text-sm text-white/60">{filtered.length} result{filtered.length === 1 ? "" : "s"}</p>
      </div>
      <MovieGrid movies={filtered} />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="glass rounded-full px-4 py-1.5 text-sm text-white outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
    >
      <option value="" className="bg-card">{label}: All</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-card">{label}: {o}</option>
      ))}
    </select>
  );
}
