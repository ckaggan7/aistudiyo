import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Send, Bot, User as UserIcon } from "lucide-react";
import GrowthPageShell from "@/components/growth/GrowthPageShell";
import { callGrowthAi } from "@/lib/growth/growthApi";
import { toast } from "@/hooks/use-toast";

const QUICK = [
  "Optimize my Google profile",
  "Generate a week of business posts",
  "Reply to all pending reviews",
  "Suggest a local ad campaign",
  "Audit my local SEO",
  "What should I post today?",
];

type Msg = { role: "user" | "agent"; text: string; actions?: string[] };

export default function GrowthAgent() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "agent", text: "Hey 👋 I'm your Growth Agent. I can run your Google profile, posts, reviews and ads on autopilot. What should we tackle first?", actions: QUICK.slice(0, 4) },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const user: Msg = { role: "user", text };
    setMessages((m) => [...m, user]);
    setInput("");
    setLoading(true);
    try {
      const res = await callGrowthAi("agent_chat", text, { history: messages.slice(-6) });
      setMessages((m) => [...m, { role: "agent", text: res.message, actions: res.next_actions }]);
    } catch (e) {
      toast({ title: "Agent error", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }

  return (
    <GrowthPageShell title="Local Business AI Agent" subtitle="Autonomous AI manager for your Google presence.">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
        <div className="lg:col-span-3 space-y-2">
          <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">Quick tasks</div>
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={loading}
              className="w-full text-left text-xs px-3 py-2 rounded-xl bg-white border border-border hover:shadow-elegant hover:border-primary/40 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9 bg-white border border-border rounded-2xl shadow-card flex flex-col h-[70vh]">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <div className="w-8 h-8 rounded-xl bg-gradient-hero shadow-glow flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold">Growth Agent</div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Online · learning your business
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "agent" && (
                  <div className="w-7 h-7 rounded-xl bg-orange-50 text-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`max-w-[80%] ${m.role === "user" ? "bg-foreground text-background" : "bg-muted/50"} rounded-2xl px-3.5 py-2.5 text-sm`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.actions.map((a, j) => (
                        <button
                          key={j}
                          onClick={() => send(a)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-white text-foreground border border-border hover:border-primary hover:text-primary transition-colors"
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-xl bg-orange-50 text-primary flex items-center justify-center">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-3.5 py-2.5 text-sm text-muted-foreground">Thinking…</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-3 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the agent anything about your growth…"
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-hero text-primary-foreground shadow-glow disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </GrowthPageShell>
  );
}