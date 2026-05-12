import { useEffect, useState } from "react";
import { Instagram, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Connection = { id: string; provider: string; ig_user_id: string | null };
export function InstagramConnectCard() {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [handle, setHandle] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const { data } = await supabase.from("meta_connections").select("*").eq("provider", "instagram").maybeSingle();
    setConnection((data as Connection | null) ?? null);
  };
  useEffect(() => { refresh(); }, []);

  const connect = async () => {
    if (!handle.trim()) return toast.error("Enter your Instagram handle");
    setBusy(true);
    await supabase.from("meta_connections").insert({
      provider: "instagram",
      ig_user_id: handle.replace("@", "").trim(),
    });
    setBusy(false);
    toast.success(`Connected @${handle.replace("@", "")} (test mode)`);
    refresh();
  };
  const disconnect = async () => {
    if (!connection) return;
    await supabase.from("meta_connections").delete().eq("id", connection.id);
    setConnection(null);
    toast.success("Disconnected");
  };

  return (
    <div className="rounded-2xl bg-card border border-border/40 p-5 flex items-center gap-4 flex-wrap">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-glow">
        <Instagram className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-[200px]">
        <p className="font-semibold text-sm">Instagram</p>
        {connection ? (
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-500" />
            Connected as <span className="font-medium text-foreground">@{connection.ig_user_id}</span> · test mode
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Connect your public Instagram to test and train agents</p>
        )}
      </div>
      {connection ? (
        <Button variant="outline" size="sm" onClick={disconnect}>Disconnect</Button>
      ) : (
        <div className="flex gap-2">
          <Input placeholder="@yourhandle" value={handle} onChange={(e) => setHandle(e.target.value)} className="w-40 h-9" />
          <Button size="sm" onClick={connect} disabled={busy} className="bg-gradient-hero text-primary-foreground">
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Connect"}
          </Button>
        </div>
      )}
    </div>
  );
}
