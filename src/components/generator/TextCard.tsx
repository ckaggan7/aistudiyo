import { ReactNode } from "react";
import ResultCard from "./ResultCard";

export default function TextCard({
  title, icon, value, onRegenerate, regenerating, actions, delay,
}: {
  title: string; icon?: ReactNode; value: string;
  onRegenerate?: () => void; regenerating?: boolean; actions?: ReactNode; delay?: number;
}) {
  return (
    <ResultCard
      title={title}
      icon={icon}
      copyValue={value}
      onRegenerate={onRegenerate}
      regenerating={regenerating}
      actions={actions}
      delay={delay}
    >
      <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap bg-secondary/40 rounded-xl p-3">{value}</p>
    </ResultCard>
  );
}
