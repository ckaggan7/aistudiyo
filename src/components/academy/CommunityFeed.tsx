import { MessageCircle, Heart } from "lucide-react";
const POSTS = [
  { user: "Maya R.", emoji: "🔥", text: "First viral reel using the Hook Lab! 412k views in 36h.", kudos: 184 },
  { user: "Devon K.", emoji: "🚀", text: "Cut my Google Ads CPC from $1.80 → $0.92 with AI variants.", kudos: 96 },
  { user: "Aisha P.", emoji: "🎯", text: "Closed 3 brand deals after redoing my LinkedIn pillars.", kudos: 142 },
  { user: "Leo S.",   emoji: "📈", text: "Ran the 7-day Reels challenge — gained 4.2k followers.", kudos: 210 },
];
export default function CommunityFeed() {
  return (
    <section className="px-6 md:px-12 pb-14">
      <div className="flex items-end justify-between mb-6"><div><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Community</p><h2 className="text-3xl md:text-4xl font-bold tracking-tight">Creator wins, in real time.</h2></div><span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-violet-500/15 text-violet-200 border border-violet-500/30">Preview</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">{POSTS.map((p, i) => (<div key={i} className="rounded-2xl p-4 border border-white/10 bg-white/[0.04]"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-violet-500 flex items-center justify-center text-sm">{p.emoji}</div><p className="text-sm font-semibold text-white">{p.user}</p></div><p className="text-[13px] text-white/80 leading-snug">{p.text}</p><div className="mt-3 flex items-center gap-3 text-[11px] text-white/50"><span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" /> {p.kudos}</span><span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Reply</span></div></div>))}</div>
    </section>
  );
}
