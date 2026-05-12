import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: string;
  credits: number;
  status: string;
};

type Ctx = {
  workspaces: Workspace[];
  current: Workspace | null;
  loading: boolean;
  switchTo: (id: string) => void;
  refresh: () => Promise<void>;
  createWorkspace: (name: string) => Promise<Workspace | null>;
};

const WorkspaceCtx = createContext<Ctx | undefined>(undefined);
const KEY = "studiyo:current-workspace";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [current, setCurrent] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      setCurrent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: members } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id);
    const ids = (members ?? []).map((m: { workspace_id: string }) => m.workspace_id);
    if (!ids.length) {
      setWorkspaces([]);
      setCurrent(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("workspaces").select("*").in("id", ids);
    const list = (data ?? []) as Workspace[];
    setWorkspaces(list);
    const stored = localStorage.getItem(KEY);
    const next = list.find((w) => w.id === stored) ?? list[0] ?? null;
    setCurrent(next);
    if (next) localStorage.setItem(KEY, next.id);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const switchTo = (id: string) => {
    const w = workspaces.find((x) => x.id === id);
    if (!w) return;
    setCurrent(w);
    localStorage.setItem(KEY, w.id);
  };

  const createWorkspace = async (name: string) => {
    if (!user) return null;
    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32) +
      "-" +
      Math.random().toString(36).slice(2, 8);
    const { data, error } = await supabase
      .from("workspaces")
      .insert({ name, slug, owner_id: user.id })
      .select()
      .single();
    if (error || !data) return null;
    await supabase
      .from("workspace_members")
      .insert({ workspace_id: data.id, user_id: user.id, role: "owner" });
    await load();
    switchTo(data.id);
    return data as Workspace;
  };

  return (
    <WorkspaceCtx.Provider value={{ workspaces, current, loading, switchTo, refresh: load, createWorkspace }}>
      {children}
    </WorkspaceCtx.Provider>
  );
}

export const useWorkspace = () => {
  const c = useContext(WorkspaceCtx);
  if (!c) throw new Error("useWorkspace must be inside WorkspaceProvider");
  return c;
};