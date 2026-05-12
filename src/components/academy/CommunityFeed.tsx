import { useEffect, useState } from "react";
import { MessageCircle, Heart, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Post = { id: string; user_id: string; kind: string; body: string; created_at: string; display_name?: string };

const SEED = [
  { user: "Maya R.", emoji: "🔥", text: "First viral reel using the Hook Lab! 412k views in 36h.", kudos: 184 },
  { user: "Devon K.", emoji: "🚀", text: "Cut my Google Ads CPC from $1.80 → $0.92 with AI variants.", kudos: 96 },
  { user: "Aisha P.", emoji: "🎯", text: "Closed 3 brand deals after redoing my LinkedIn pillars.", kudos: 142 },
  { user: "Leo S.",   emoji: "📈", text: "Ran the 7-day Reels challenge — gained 4.2k followers.", kudos: 210 },
];

const KIND_EMOJI: Record<string, string> = { campaign: "🎯", story: "🔥", prompt: "🪄", experiment: "🧪" };

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [authed, setAuthed] = useState(false);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setAuthed(!!user);
    if (!user) { setPosts([]); return; }
    const { data } = await supabase.from("community_posts").select("id, user_id, kind, body, created_at").order("created_at", { ascending: false }).limit(8);
    if (!data) return;
    const ids = Array.from(new Set(data.map((p) => p.user_id)));
    const { data: profs } = await supabase.from("profiles").select("user_id, display_name").in("user_id", ids);
    const map = new Map((profs ?? []).map((p) => [p.user_id, p.display_name as string]));
    setPosts(data.map((p) => ({ ...p, display_name: map.get(p.user_id) ?? "Creator" })));
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    const t = body.trim(); if (!t || busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in to share a win"); setBusy(false); return; }
    const { error } = await supabase.from("community_posts").insert({ user_id: user.id, kind: "story", body: t });
    if (error) toast.error(error.message);
    else { setBody(""); toast.success("Shared with the community"); load(); }
    setBusy(false);
  };

  const showSeed = posts.length === 0;
  return (
    <section className="px-6 md:px-12 pb-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Community</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Creator wins, in real time.</h2>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-violet-500/15 text-violet-200 border border-violet-500/30">Live</span>
      </div>
      {authed && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
          <input value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} placeholder="Share a win, a prompt, or an experiment…" className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40 px-3 py-2" />
          <button onClick={submit} disabled={busy || !body.trim()} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[12px] font-semibold disabled:opacity-40">
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Post
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {showSeed && SEED.map((p, i) => (
          <div key={i} className="rounded-2xl p-4 border border-white/10 bg-white/[0.04]">
            <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-violet-500 flex items-center justify-center text-sm">{p.emoji}</div><p className="text-sm font-semibold text-white">{p.user}</p></div>
            <p className="text-[13px] text-white/80 leading-snug">{p.text}</p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-white/50"><span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" /> {p.kudos}</span><span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Reply</span></div>
          </div>
        ))}
        {!showSeed && posts.map((p) => (
          <div key={p.id} className="rounded-2xl p-4 border border-white/10 bg-white/[0.04]">
            <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-violet-500 flex items-center justify-center text-sm">{KIND_EMOJI[p.kind] ?? "✨"}</div><p className="text-sm font-semibold text-white truncate">{p.display_name}</p></div>
            <p className="text-[13px] text-white/80 leading-snug">{p.body}</p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-white/50"><span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" /> 0</span><span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Reply</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}