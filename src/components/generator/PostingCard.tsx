import { Link } from "react-router-dom";
import { Clock, CalendarPlus } from "lucide-react";
import ResultCard from "./ResultCard";

export default function PostingCard({
  time, rationale, caption,
}: {
  time: string; rationale: string; caption?: string;
}) {
  const params = new URLSearchParams();
  if (caption) params.set("caption", caption);
  if (time) params.set("time", time);

  return (
    <ResultCard
      title="Best posting time"
      icon={<Clock className="w-4 h-4" />}
      delay={0.35}
      actions={
        <Link
          to={`/dashboard/calendar?${params.toString()}`}
          className="ml-1 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <CalendarPlus className="w-3 h-3" /> Schedule
        </Link>
      }
    >
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-xl font-bold tracking-tight">{time}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-snug">{rationale}</p>
    </ResultCard>
  );
}
