import type { Movie } from "@/lib/data";
import { MovieCard } from "./movie-card";

export function MovieGrid({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-20 text-center text-white/60">
        No results found.
      </div>
    );
  }
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center">
      {movies.map((m, i) => (
        <MovieCard key={m.id} movie={m} index={i} />
      ))}
    </div>
  );
}
