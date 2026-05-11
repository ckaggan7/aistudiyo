import { useState } from "react";
import { Repeat } from "lucide-react";
import { toast } from "sonner";
import ResultCard from "./ResultCard";

export default function RepurposeCard({
  thread, reel, onRegenerate, regenerating,
}: {
  thread: string[]; reel: string; onRegenerate: () => void; regenerating: boolean;
}) {
  const [tab, setTab] = useState<"thread" | "reel">("thread");
  const value = tab === "thread" ? thread.join("\n\n") : reel;

  return (
    <ResultCard
      title="Repurpose"
      icon={<Repeat className="w-4 h-4" />}
      copyValue={value}
      onRegenerate={onRegenerate}
      regenerating={regenerating}
      delay={0.3}
    >
      <div className="flex gap-1 mb-3 p-1 rounded-lg bg-secondary/40 w-fit">
        {[
          { id: "thread", label: "X / Twitter thread" },
          { id: "reel", label: "Reel script" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "thread" ? (
        <ol className="space-y-2">
          {thread.map((t, i) => (
            <li key={i} className="text-sm text-foreground/85 leading-snug bg-secondary/40 rounded-xl p-3 flex gap-2">
              <span className="text-[10px] font-bold text-muted-foreground mt-0.5">{i + 1}/{thread.length}</span>
              <span className="flex-1">{t}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed bg-secondary/40 rounded-xl p-3">{reel}</p>
      )}
    </ResultCard>
  );
}
