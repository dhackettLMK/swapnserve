// Editable content for the Talented Thirty Under Thirty page.
import { FunctionsHttpError } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

export interface Honouree {
  id: string;
  name: string;
  age: string;
  role: string;
  bio: string;
  photo: string;
}

export interface ThirtyContent {
  eyebrow: string;
  title: string;
  intro: string;
  coverImage: string;
  aboutTitle: string;
  aboutBody: string;
  honoureesTitle: string;
  honoureesIntro: string;
  honourees: Honouree[];
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  ctaLink: string;
}

export const DEFAULT_THIRTY: ThirtyContent = {
  eyebrow: "Swap'N'Serve presents",
  title: "Talented Thirty Under Thirty",
  intro:
    "Celebrating thirty young people under thirty who are making Limerick a better place to live, work and grow up.",
  coverImage: "",
  aboutTitle: "Why we are doing this",
  aboutBody:
    "Add a few lines here about the awards: who they are for, how people are chosen and what being named means.",
  honoureesTitle: "Meet the thirty",
  honoureesIntro: "Our honourees will be announced soon.",
  honourees: Array.from({ length: 30 }, (_, i) => ({
    id: `h${i + 1}`,
    name: `Honouree ${i + 1}`,
    age: "",
    role: "Announced soon",
    bio: "",
    photo: "",
  })),
  closingTitle: "Know someone who deserves a place?",
  closingBody: "Tell us about them and we will be in touch.",
  ctaLabel: "Nominate someone",
  ctaLink: "mailto:swapnserve@gmail.com?subject=Thirty%20Under%20Thirty%20nomination",
};

async function call<T>(body: unknown, pass?: string): Promise<T> {
  const { data, error } = await getSupabase().functions.invoke("thirty", {
    body,
    headers: pass ? { "x-admin-token": pass } : undefined,
  });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = await error.context.json().catch(() => null);
      if (payload?.error) throw new Error(payload.error);
    }
    throw new Error("Something went wrong. Please try again.");
  }
  return data as T;
}

export const thirtyApi = {
  get: async () => (await call<{ content: ThirtyContent | null }>({ action: "get" })).content,
  check: (pass: string) => call<{ ok: true }>({ action: "check" }, pass),
  save: (pass: string, content: ThirtyContent) => call<{ ok: true }>({ action: "save", content }, pass),
  uploadImage: async (pass: string, file: File): Promise<string> => {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const { path, token } = await call<{ path: string; token: string }>({ action: "upload-url", ext }, pass);
    const { error } = await getSupabase().storage.from("thirty").uploadToSignedUrl(path, token, file, {
      contentType: file.type || "image/jpeg",
    });
    if (error) throw new Error("Upload failed. Please try again.");
    const { url } = await call<{ url: string }>({ action: "image-url", path }, pass);
    return url;
  },
};
