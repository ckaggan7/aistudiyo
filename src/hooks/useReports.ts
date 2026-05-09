import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AgentReport = {
  id: string; agent_id: string | null; title: string; type: string;
  content_md: string; pinned: boolean; created_at: string;
};

export function useReports(agentId?: string) {
  const [reports, setReports] = useState<AgentReport[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    let q = supabase.from("agent_reports").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false });
    if (agentId) q = q.eq("agent_id", agentId);
    const { data } = await q;
    setReports((data as AgentReport[]) ?? []);
    setLoading(false);
  }, [agentId]);

  useEffect(() => { refresh(); }, [refresh]);

  const togglePin = async (r: AgentReport) => {
    await supabase.from("agent_reports").update({ pinned: !r.pinned }).eq("id", r.id);
    refresh();
  };
  const remove = async (id: string) => {
    await supabase.from("agent_reports").delete().eq("id", id);
    refresh();
  };
  return { reports, loading, refresh, togglePin, remove };
}
