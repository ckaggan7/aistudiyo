import { Target, Copy } from "lucide-react";
import { toast } from "sonner";
import ResultCard from "./ResultCard";

export default function CtaCard({ ctas, onRegenerate, regenerating }: { ctas: string[]; onRegenerate: () => void; regenerating: boolean }) {
  return (
    <ResultCard
      title="CTA options"
      icon={<Target className="w-4 h-4" />}
      badge={`${ctas.length}`}
      copyValue={ctas.join("\n")}
      onRegenerate={onRegenerate}
      regenerating={regenerating}
      delay={0.1}
    >
      <div className="flex flex-wrap gap-2">
        {ctas.map((c, i) => (
          <button
            key={i}
            onClick={() => { navigator.clipboard.writeText(c); toast.success("Copied"); }}
            className="group inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border/50 bg-background/40 hover:border-primary/40 hover:text-primary transition-colors"
          >
            {c}
            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </ResultCard>
  );
}
