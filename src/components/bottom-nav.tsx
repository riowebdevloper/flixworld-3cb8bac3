import { Link } from "@tanstack/react-router";
import { Home, Film, Tv, Search, Bookmark } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} inactiveProps={{ className: "text-white/60" }} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium">
          <Home className="h-5 w-5" />Home
        </Link>
        <Link to="/movies" activeProps={{ className: "text-primary" }} inactiveProps={{ className: "text-white/60" }} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium">
          <Film className="h-5 w-5" />Movies
        </Link>
        <Link to="/web-series" activeProps={{ className: "text-primary" }} inactiveProps={{ className: "text-white/60" }} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium">
          <Tv className="h-5 w-5" />Series
        </Link>
        <Link to="/search" search={{ q: "", genre: "", year: "", rating: "", language: "" }} activeProps={{ className: "text-primary" }} inactiveProps={{ className: "text-white/60" }} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium">
          <Search className="h-5 w-5" />Search
        </Link>
        <Link to="/my-list" activeProps={{ className: "text-primary" }} inactiveProps={{ className: "text-white/60" }} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium">
          <Bookmark className="h-5 w-5" />My List
        </Link>
      </div>
    </nav>
  );
}
