import { ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";

export type FeedItem = {
  id: string;
  icon?: ReactNode;
  title: string;
  meta?: string;
  time: string | Date;
  tone?: "default" | "success" | "warning" | "error";
};

const toneClass: Record<NonNullable<FeedItem["tone"]>, string> = {
  default: "bg-muted-foreground/20 text-muted-foreground",
  success: "bg-emerald-500/15 text-emerald-500",
  warning: "bg-amber-500/15 text-amber-500",
  error: "bg-destructive/15 text-destructive",
};

export function RealtimeFeed({ items, empty = "No recent activity." }: { items: FeedItem[]; empty?: string }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground py-4 text-center">{empty}</p>;
  }
  return (
    <ul className="space-y-1">
      {items.map((it) => (
        <li key={it.id} className="flex items-start gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-accent/40 transition-colors">
          <span className={`w-7 h-7 rounded-full grid place-items-center text-xs shrink-0 ${toneClass[it.tone ?? "default"]}`}>
            {it.icon ?? "•"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate">{it.title}</div>
            {it.meta && <div className="text-[11px] text-muted-foreground truncate">{it.meta}</div>}
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
            {formatDistanceToNow(new Date(it.time), { addSuffix: true })}
          </span>
        </li>
      ))}
    </ul>
  );
}