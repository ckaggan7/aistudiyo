import { Zap } from "lucide-react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import ResultCard from "./ResultCard";

export default function HookCard({ hooks, onRegenerate, regenerating }: { hooks: string[]; onRegenerate: () => void; regenerating: boolean }) {
  const copyOne = (h: string) => { navigator.clipboard.writeText(h); toast.success("Copied"); };
  return (
    <ResultCard
      title="Hook variations"
      icon={<Zap className="w-4 h-4" />}
      badge={`${hooks.length}`}
      copyValue={hooks.join("\n")}
      onRegenerate={onRegenerate}
      regenerating={regenerating}
      delay={0.05}
    >
      <ul className="space-y-2">
        {hooks.map((h, i) => (
          <li key={i} className="group flex items-start gap-2 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors">
            <span className="text-[10px] font-bold text-muted-foreground mt-0.5 w-4">{i + 1}</span>
            <p className="flex-1 text-sm leading-snug text-foreground/90">{h}</p>
            <button onClick={() => copyOne(h)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background transition-all">
              <Copy className="w-3 h-3 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
    </ResultCard>
  );
}
