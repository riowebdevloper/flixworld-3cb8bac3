import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const listKind = z.enum(["watchlist", "favorite", "recent"]);
const mediaKind = z.enum(["movie", "tv"]);

const addSchema = z.object({
  list_kind: listKind,
  media_type: mediaKind,
  media_id: z.number().int().positive(),
  title: z.string().min(1).max(300),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_year: z.number().int().nullable().optional(),
  rating: z.number().nullable().optional(),
});

const GENERIC_ERROR = "An error occurred. Please try again.";

export const addToList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => addSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("user_media")
      .upsert(
        { ...data, user_id: context.userId },
        { onConflict: "user_id,list_kind,media_type,media_id" },
      );
    if (error) {
      console.error("[user-lists] addToList", error);
      throw new Error(GENERIC_ERROR);
    }
    return { ok: true };
  });

const removeSchema = z.object({
  list_kind: listKind,
  media_type: mediaKind,
  media_id: z.number().int().positive(),
});

export const removeFromList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => removeSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("user_media")
      .delete()
      .eq("user_id", context.userId)
      .eq("list_kind", data.list_kind)
      .eq("media_type", data.media_type)
      .eq("media_id", data.media_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const listSchema = z.object({ list_kind: listKind });

export const getList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => listSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("user_media")
      .select("*")
      .eq("user_id", context.userId)
      .eq("list_kind", data.list_kind)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getMyLists = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_media")
      .select("list_kind, media_type, media_id")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
