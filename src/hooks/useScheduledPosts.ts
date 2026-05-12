import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export type ScheduledPost = {
  id: string;
  title: string;
  caption: string | null;
  image_url: string | null;
  platform: string;
  scheduled_for: string;
  status: string;
  campaign_id: string | null;
};

export function useScheduledPosts() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("scheduled_posts")
      .select("id, title, caption, image_url, platform, scheduled_for, status, campaign_id")
      .order("scheduled_for", { ascending: true });
    setPosts((data as ScheduledPost[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const update = async (id: string, patch: Partial<ScheduledPost>) => {
    await supabase.from("scheduled_posts").update(patch).eq("id", id);
    refresh();
  };
  const remove = async (id: string) => {
    await supabase.from("scheduled_posts").delete().eq("id", id);
    refresh();
  };
  const create = async (post: Partial<ScheduledPost>) => {
    await supabase.from("scheduled_posts").insert(post as TablesInsert<"scheduled_posts">);
    refresh();
  };

  return { posts, loading, refresh, update, remove, create };
}
