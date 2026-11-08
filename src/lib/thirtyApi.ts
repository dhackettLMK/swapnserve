import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import savedContent from "@/assets/thirty/content.json";

export type TalentContent = typeof savedContent;

export function useTalentContent() {
  return useQuery<TalentContent>({
    queryKey: ["talent-blog-content"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("thirty", { body: { action: "get" } });
      if (error) throw error;
      return data?.content ?? savedContent;
    },
    initialData: savedContent,
    staleTime: 60_000,
  });
}