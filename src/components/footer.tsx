import { Film } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-12 px-4 sm:px-6 lg:px-10 py-10 pb-28 lg:pb-10 text-sm text-white/60">
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
              <Film className="h-4 w-4 text-white" />
            </div>
            <span className="text-display text-xl font-bold text-white">FLIX<span className="text-primary">WORLD</span></span>
          </div>
          <p className="mt-3 leading-relaxed">Stream the universe of cinema. Movies, web series, anime & K-drama — all in one place.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Browse</h4>
          <ul className="space-y-1.5">
            <li><Link to="/movies" className="hover:text-white">Movies</Link></li>
            <li><Link to="/web-series" className="hover:text-white">Web Series</Link></li>
            <li><Link to="/anime" className="hover:text-white">Anime</Link></li>
            <li><Link to="/k-drama" className="hover:text-white">K-Drama</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Discover</h4>
          <ul className="space-y-1.5">
            <li><Link to="/trending" className="hover:text-white">Trending</Link></li>
            <li><Link to="/genres" className="hover:text-white">Genres</Link></li>
            <li><Link to="/search" className="hover:text-white">Search</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">FlixWorld.fun</h4>
          <p>For entertainment lovers. Built with ❤️</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-xs">
        © {new Date().getFullYear()} FlixWorld.fun — All posters & metadata are property of their respective owners.
      </div>
    </footer>
  );
}
