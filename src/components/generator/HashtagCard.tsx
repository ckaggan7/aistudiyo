import { Hash } from "lucide-react";
import ResultCard from "./ResultCard";

type Sets = { broad: string[]; niche: string[]; branded: string[] };

function normalize(tags: string[] = []) {
  return tags.map((t) => (t.startsWith("#") ? t : `#${t}`));
}

export default function HashtagCard({ sets, onRegenerate, regenerating }: { sets: Sets; onRegenerate: () => void; regenerating: boolean }) {
  const tiers: { label: string; color: string; tags: string[] }[] = [
    { label: "Broad",   color: "bg-primary/10 text-primary",            tags: normalize(sets.broad) },
    { label: "Niche",   color: "bg-emerald-500/10 text-emerald-600",    tags: normalize(sets.niche) },
    { label: "Branded", color: "bg-fuchsia-500/10 text-fuchsia-600",    tags: normalize(sets.branded) },
  ];
  const allText = tiers.flatMap((t) => t.tags).join(" ");

  return (
    <ResultCard
      title="Hashtag sets"
      icon={<Hash className="w-4 h-4" />}
      copyValue={allText}
      onRegenerate={onRegenerate}
      regenerating={regenerating}
      delay={0.15}
    >
      <div className="space-y-3">
        {tiers.map((t) => (
          <div key={t.label}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{t.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {t.tags.map((tag) => (
                <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${t.color}`}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ResultCard>
  );
}
