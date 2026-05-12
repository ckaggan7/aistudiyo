import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { askMentor, type MentorReply } from "@/lib/academy/scoring";
import { toast } from "sonner";

type Turn =
  | { role: "user"; text: string }
  | { role: "assistant"; reply: MentorReply };

const SUGGESTED = [
  "How can I improve my Google Ads CTR?",
  "Write 3 hooks for a fitness reel.",
  "Why is my carousel underperforming?",
  "Plan a 7-day launch campaign.",
];

export default function AIMentorPanel({ embedded = false }: { embedded?: boolean }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setTurns((arr) => [...arr, { role: "user", text: t }]);
    setInput("");
    setBusy(true);
    try {
      const reply = await askMentor(t);
      setTurns((arr) => [...arr, { role: "assistant", reply }]);
    } catch (e) {
      toast.error("Mentor is taking a breath — try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] flex flex-col ${embedded ? "h-[520px]" : "h-[calc(100vh-260px)] min-h-[480px]"}`}>
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-pink-500 to-violet-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AI Mentor</p>
          <p className="text-[11px] text-white/50">Ask anything — get examples and a practice rep.</p>
        </div>
      </div>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
        {turns.length === 0 && (
          <div className="text-center py-6">
            <p className="text-white/60 text-sm mb-4">Try a question to get started</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
              {SUGGESTED.map((q) => (
                <button key={q} onClick={() => send(q)} className="text-left text-[12px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80">{q}</button>
              ))}
            </div>
          </div>
        )}

        {turns.map((t, i) => t.role === "user" ? (
          <div key={i} className="flex justify-end">
            <div className="max-w-[75%] rounded-2xl rounded-br-sm px-3.5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm">{t.text}</div>
          </div>
        ) : (
          <div key={i} className="space-y-2.5">
            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{t.reply.message}</p>
            {t.reply.examples?.length > 0 && (
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1.5">Examples</p>
                <ul className="space-y-1 text-[13px] text-white/80 list-disc list-inside">
                  {t.reply.examples.slice(0, 3).map((ex, j) => <li key={j}>{ex}</li>)}
                </ul>
              </div>
            )}
            {t.reply.exercises?.length > 0 && (
              <div className="space-y-1.5">
                {t.reply.exercises.map((ex, j) => (
                  <div key={j} className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200">Practice · {ex.difficulty}</span>
                    </div>
                    <p className="text-sm font-medium text-white">{ex.title}</p>
                    <p className="text-[12px] text-white/70 mt-0.5">{ex.prompt}</p>
                  </div>
                ))}
              </div>
            )}
            {t.reply.next_actions?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {t.reply.next_actions.map((a, j) => (
                  <button key={j} onClick={() => send(a)} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/80">{a}</button>
                ))}
              </div>
            )}
          </div>
        ))}

        {busy && (
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Mentor is thinking…
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
            placeholder="Ask the mentor anything…"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
          />
          <button onClick={() => send(input)} disabled={busy || !input.trim()} className="w-9 h-9 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 disabled:opacity-40 inline-flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}