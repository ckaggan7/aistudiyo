import { useEffect, useState } from "react";
import { Check, X, Calendar as CalIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Pending = {
  id: string; title: string; caption: string | null; image_url: string | null;
  scheduled_for: string; platform: string;
};

export function ApprovalInbox() {
  const [posts, setPosts] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const refresh = async () => {
    const { data } = await supabase.from("scheduled_posts")
      .select("id, title, caption, image_url, scheduled_for, platform")
      .eq("approval_status", "pending_approval")
      .order("scheduled_for", { ascending: true });
    setPosts((data as Pending[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const approve = async (id: string) => {
    await supabase.from("scheduled_posts").update({ approval_status: "approved", status: "scheduled" }).eq("id", id);
    toast.success("Approved & scheduled");
    refresh();
  };
  const reject = async (id: string) => {
    await supabase.from("scheduled_posts").update({ approval_status: "rejected", status: "draft" }).eq("id", id);
    toast.success("Rejected");
    refresh();
  };
  const saveCaption = async (id: string) => {
    await supabase.from("scheduled_posts").update({ caption: draft }).eq("id", id);
    setEditingId(null);
    toast.success("Caption updated");
    refresh();
  };
  const approveAll = async () => {
    const ids = posts.map(p => p.id);
    if (ids.length === 0) return;
    await supabase.from("scheduled_posts").update({ approval_status: "approved", status: "scheduled" }).in("id", ids);
    toast.success(`Approved ${ids.length} posts`);
    refresh();
  };

  if (loading) return <div className="p-6 text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto" /></div>;

  if (posts.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-2xl p-8 text-center text-xs text-muted-foreground">
        No posts awaiting approval. Run the Publisher to generate a content plan.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{posts.length} pending</p>
        <Button size="sm" variant="outline" onClick={approveAll}>
          <Check className="w-3.5 h-3.5" /> Approve all
        </Button>
      </div>
      {posts.map((p) => (
        <div key={p.id} className="rounded-xl bg-card border border-border/40 p-4 flex gap-3">
          <div className="w-16 h-16 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
            {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-hero opacity-30" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-sm font-semibold truncate">{p.title}</p>
              <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1 flex-shrink-0">
                <CalIcon className="w-3 h-3" /> {new Date(p.scheduled_for).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            {editingId === p.id ? (
              <div className="space-y-2">
                <Textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} className="text-xs" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveCaption(p.id)}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.caption ?? "—"}</p>
            )}
            {editingId !== p.id && (
              <div className="flex gap-1.5">
                <Button size="sm" className="h-7 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => approve(p.id)}>
                  <Check className="w-3 h-3" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="h-7" onClick={() => { setEditingId(p.id); setDraft(p.caption ?? ""); }}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => reject(p.id)}>
                  <X className="w-3 h-3" /> Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
