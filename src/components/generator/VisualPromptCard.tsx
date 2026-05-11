import { Link } from "react-router-dom";
import { Wand2, ArrowRight } from "lucide-react";
import ResultCard from "./ResultCard";

export default function VisualPromptCard({
  prompt, onRegenerate, regenerating,
}: {
  prompt: string; onRegenerate: () => void; regenerating: boolean;
}) {
  return (
    <ResultCard
      title="Visual prompt"
      icon={<Wand2 className="w-4 h-4" />}
      copyValue={prompt}
      onRegenerate={onRegenerate}
      regenerating={regenerating}
      delay={0.25}
      actions={
        <Link
          to={`/dashboard/image-studio?prompt=${encodeURIComponent(prompt)}`}
          className="ml-1 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          Open in Studio <ArrowRight className="w-3 h-3" />
        </Link>
      }
    >
      <p className="text-sm text-foreground/85 leading-relaxed bg-secondary/40 rounded-xl p-3">{prompt}</p>
    </ResultCard>
  );
}
