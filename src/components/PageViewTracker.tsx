import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

/** Records an anonymous page view (random visitor id, no personal data). */
export default function PageViewTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!isSupabaseConfigured || pathname.includes("admin")) return;
    let id = localStorage.getItem("sns_vid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("sns_vid", id);
    }
    getSupabase()
      .from("page_views")
      .insert({ path: pathname.slice(0, 200), visitor_id: id })
      .then(() => undefined, () => undefined);
  }, [pathname]);
  return null;
}
