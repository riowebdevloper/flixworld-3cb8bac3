import { Link } from "@tanstack/react-router";
import { Home, Film, Tv, Search, TrendingUp } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/movies", label: "Movies", icon: Film, exact: false },
  { to: "/web-series", label: "Series", icon: Tv, exact: false },
  { to: "/trending", label: "Trending", icon: TrendingUp, exact: false },
  { to: "/search", label: "Search", icon: Search, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.exact }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-white/60" }}
              className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium"
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
