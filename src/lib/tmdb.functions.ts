import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { CategoryKey, Media, MediaDetail, MediaType, PagedMedia } from "./tmdb";

const BASE = "https://api.themoviedb.org/3";

async function tmdb<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY not configured");
  const isV4Token = key.startsWith("eyJ"); // v4 Read Access Token (JWT)
  const url = new URL(BASE + path);
  url.searchParams.set("language", "en-US");
  if (!isV4Token) url.searchParams.set("api_key", key);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const headers: Record<string, string> = { accept: "application/json" };
  if (isV4Token) headers.authorization = `Bearer ${key}`;
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[tmdb] ${path} → ${res.status}${body ? `: ${body.slice(0, 160)}` : ""}`);
    throw new Error("Could not fetch media data");
  }
  return (await res.json()) as T;
}

const TV_KINDS = new Set<CategoryKey>(["popular_tv", "anime", "kdrama", "web_series"]);

const normalize = (defaultType: MediaType) =>
  (r: any): Media => ({
    id: r.id,
    media_type: (r.media_type as MediaType) ?? defaultType,
    title: r.title ?? r.name ?? "Untitled",
    overview: r.overview ?? "",
    poster_path: r.poster_path ?? null,
    backdrop_path: r.backdrop_path ?? null,
    release_date: r.release_date ?? r.first_air_date ?? null,
    vote_average: typeof r.vote_average === "number" ? r.vote_average : 0,
    original_language: r.original_language,
  });

const categorySchema = z.object({
  kind: z.enum([
    "trending", "popular_movies", "now_playing", "top_rated",
    "popular_tv", "anime", "kdrama", "web_series", "upcoming",
  ]),
  page: z.number().int().min(1).max(500).optional().default(1),
});

export const fetchCategory = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => categorySchema.parse(d))
  .handler(async ({ data }): Promise<PagedMedia> => {
    const page = data.page;
    type Raw = { page?: number; total_pages?: number; results?: any[] };
    let raw: Raw;
    switch (data.kind) {
      case "trending": raw = await tmdb<Raw>("/trending/all/week", { page }); break;
      case "popular_movies": raw = await tmdb<Raw>("/movie/popular", { page }); break;
      case "now_playing": raw = await tmdb<Raw>("/movie/now_playing", { page }); break;
      case "top_rated": raw = await tmdb<Raw>("/movie/top_rated", { page }); break;
      case "upcoming": raw = await tmdb<Raw>("/movie/upcoming", { page }); break;
      case "popular_tv": raw = await tmdb<Raw>("/tv/popular", { page }); break;
      case "anime":
        raw = await tmdb<Raw>("/discover/tv", {
          page, with_genres: 16, with_original_language: "ja", sort_by: "popularity.desc",
        }); break;
      case "kdrama":
        raw = await tmdb<Raw>("/discover/tv", {
          page, with_original_language: "ko", sort_by: "popularity.desc",
        }); break;
      case "web_series":
        raw = await tmdb<Raw>("/discover/tv", { page, sort_by: "popularity.desc" }); break;
    }
    const defaultType: MediaType = TV_KINDS.has(data.kind) ? "tv" : "movie";
    return {
      page: raw.page ?? 1,
      total_pages: raw.total_pages ?? 1,
      results: (raw.results ?? []).map(normalize(defaultType)).filter((m) => m.poster_path),
    };
  });

const detailSchema = z.object({
  type: z.enum(["movie", "tv"]),
  id: z.number().int().positive(),
});

export const fetchDetail = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => detailSchema.parse(d))
  .handler(async ({ data }): Promise<MediaDetail> => {
    const json: any = await tmdb(`/${data.type}/${data.id}`, {
      append_to_response: "videos,credits,similar",
    });
    return {
      id: json.id,
      media_type: data.type,
      title: json.title ?? json.name ?? "Untitled",
      overview: json.overview ?? "",
      poster_path: json.poster_path ?? null,
      backdrop_path: json.backdrop_path ?? null,
      release_date: json.release_date ?? json.first_air_date ?? null,
      vote_average: typeof json.vote_average === "number" ? json.vote_average : 0,
      original_language: json.original_language,
      genres: json.genres ?? [],
      runtime: json.runtime ?? (Array.isArray(json.episode_run_time) ? json.episode_run_time[0] ?? null : null),
      number_of_seasons: json.number_of_seasons,
      number_of_episodes: json.number_of_episodes,
      tagline: json.tagline,
      videos: ((json.videos?.results ?? []) as any[]).filter((v) => v.site === "YouTube"),
      cast: ((json.credits?.cast ?? []) as any[]).slice(0, 12).map((c) => ({
        id: c.id, name: c.name, character: c.character, profile_path: c.profile_path ?? null,
      })),
      similar: ((json.similar?.results ?? []) as any[]).map(normalize(data.type)).filter((m) => m.poster_path).slice(0, 18),
    };
  });

const searchSchema = z.object({
  q: z.string().max(120),
  page: z.number().int().min(1).max(100).optional().default(1),
  year: z.string().optional(),
});

export const searchMedia = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => searchSchema.parse(d))
  .handler(async ({ data }): Promise<PagedMedia> => {
    if (!data.q.trim()) return { page: 1, total_pages: 0, results: [] };
    const json: any = await tmdb("/search/multi", {
      query: data.q, page: data.page, include_adult: "false",
      ...(data.year ? { year: data.year } : {}),
    });
    const results: Media[] = ((json.results ?? []) as any[])
      .filter((r) => (r.media_type === "movie" || r.media_type === "tv") && r.poster_path)
      .map(normalize("movie"));
    return { page: json.page ?? 1, total_pages: json.total_pages ?? 1, results };
  });

const discoverSchema = z.object({
  type: z.enum(["movie", "tv"]).optional().default("movie"),
  genre: z.string().optional(),
  year: z.string().optional(),
  language: z.string().optional(),
  rating: z.string().optional(),
  page: z.number().int().min(1).max(100).optional().default(1),
});

export const discoverMedia = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => discoverSchema.parse(d))
  .handler(async ({ data }): Promise<PagedMedia> => {
    const params: Record<string, string | number> = {
      page: data.page,
      sort_by: "popularity.desc",
      include_adult: "false",
    };
    if (data.genre) params.with_genres = data.genre;
    if (data.language) params.with_original_language = data.language;
    if (data.rating) params["vote_average.gte"] = data.rating;
    if (data.year) {
      if (data.type === "movie") params.primary_release_year = data.year;
      else params.first_air_date_year = data.year;
    }
    const json: any = await tmdb(`/discover/${data.type}`, params);
    return {
      page: json.page ?? 1,
      total_pages: json.total_pages ?? 1,
      results: ((json.results ?? []) as any[]).map(normalize(data.type)).filter((m) => m.poster_path),
    };
  });
