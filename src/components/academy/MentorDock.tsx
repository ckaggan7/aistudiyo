import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, X, Send, Loader2, Mic, MessageSquarePlus } from "lucide-react";
import { askMentor, type MentorReply } from "@/lib/academy/scoring";
import { useXp } from "@/lib/academy/progress";
import { tierForXp } from "@/lib/academy/levels";
import { toast } from "sonner";

type Turn =
  | { role: "user"; text: string }
  | { role: "assistant"; reply: MentorReply };

const ROUTE_PROMPTS: Record<string, string[]> = {
  "/dashboard/studio":     ["Review my latest caption", "Make this hook more viral", "Suggest a CTA for sales"],
  "/dashboard/image-studio": ["Refine this image prompt", "Suggest a thumbnail style"],
  "/dashboard/growth":     ["Audit my Google profile", "Improve my CTR", "What should I fix first?"],
  "/dashboard/analytics":  ["Explain my drop in reach", "Which post deserves a boost?"],
  "/dashboard/calendar":   ["Plan a 7-day content sprint", "Suggest posting times"],
  "/dashboard/agents":     ["Which agent should I launch?", "Build me a growth agent"],
  "/dashboard/academy":    ["Recommend my next lesson", "What's my weak spot?"],
};

const DEFAULT_PROMPTS = ["Coach me for the next 7 days", "Give me a viral hook", "Score my last post"];

const HIDDEN_ON = ["/", "/login", "/signup", "/contact", "/pricing"];

export default function MentorDock() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<unknown>(null);
  const { xp } = useXp();
  const tier = tierForXp(xp);

  const isHidden = HIDDEN_ON.some((p) => location.pathname === p) || location.pathname.startsWith("/superadmin") || location.pathname.startsWith("/c/");

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  const promptsForRoute = (() => {
    const key = Object.keys(ROUTE_PROMPTS).find((k) => location.pathname === k || location.pathname.startsWith(k + "/"));
    return key ? ROUTE_PROMPTS[key] : DEFAULT_PROMPTS;
  })();

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setTurns((arr) => [...arr, { role: "user", text: t }]);
    setInput("");
    setBusy(true);
    try {
      const reply = await askMentor(t, { route: location.pathname, xp, tier: tier.name });
      setTurns((arr) => [...arr, { role: "assistant", reply }]);
    } catch {
      toast.error("Mentor is taking a breath — try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  const startVoice = () => {
    type SR = { new (): { start: () => void; stop: () => void; onresult: (e: { results: { 0: { transcript: string } }[] }) => void; onend: () => void; lang: string; interimResults: boolean } };
    const w = window as unknown as { webkitSpeechRecognition?: SR; SpeechRecognition?: SR };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) { toast.info("Voice input isn't supported in this browser."); return; }
    if (listening) { (recRef.current as { stop?: () => void } | null)?.stop?.(); setListening(false); return; }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => setInput((prev) => (prev ? prev + " " : "") + e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  if (isHidden) return null;

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-5 lg:bottom-6 lg:right-6 z-40 group flex items-center gap-2 h-12 pl-3 pr-4 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 text-white shadow-[0_15px_50px_-15px_rgba(236,72,153,0.7)] hover:scale-[1.03] transition-transform"
          aria-label="Open AI Mentor"
        >
          <span className="relative w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </span>
          <span className="text-sm font-semibold">Ask Mentor</span>
        </button>
      )}

      {/* Slide-over panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="h-full bg-[#0b0b14] border-l border-white/10 flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">AI Creator Mentor</p>
              <p className="text-[11px] text-white/50 truncate">{tier.name} · {xp.toLocaleString()} XP</p>
            </div>
            <button onClick={() => { setTurns([]); }} className="text-white/40 hover:text-white/80" aria-label="New chat">
              <MessageSquarePlus className="w-4 h-4" />
            </button>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white/80" aria-label="Close mentor">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {turns.length === 0 && (
              <>
                <p className="text-sm text-white/70">Hey, I'm your AI mentor — I see what page you're on and coach you in real time.</p>
                <div className="grid grid-cols-1 gap-2">
                  {promptsForRoute.map((q) => (
                    <button key={q} onClick={() => send(q)} className="text-left text-[13px] px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/85">
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}

            {turns.map((t, i) => t.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm">{t.text}</div>
              </div>
            ) : (
              <div key={i} className="space-y-2">
                <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{t.reply.message}</p>
                {t.reply.examples?.length > 0 && (
                  <details className="rounded-xl bg-white/[0.03] border border-white/10 p-3 group">
                    <summary className="text-[10px] uppercase tracking-wider text-white/40 font-semibold cursor-pointer">Examples ({t.reply.examples.length})</summary>
                    <ul className="mt-2 space-y-1 text-[13px] text-white/80 list-disc list-inside">
                      {t.reply.examples.slice(0, 4).map((ex, j) => <li key={j}>{ex}</li>)}
                    </ul>
                  </details>
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
              <button onClick={startVoice} className={`w-7 h-7 rounded-md flex items-center justify-center ${listening ? "text-rose-300 animate-pulse" : "text-white/50 hover:text-white"}`} aria-label="Voice input">
                <Mic className="w-4 h-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
                placeholder="Ask the mentor anything…"
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
              />
              <button onClick={() => send(input)} disabled={busy || !input.trim()} className="w-9 h-9 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 disabled:opacity-40 inline-flex items-center justify-center" aria-label="Send">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
