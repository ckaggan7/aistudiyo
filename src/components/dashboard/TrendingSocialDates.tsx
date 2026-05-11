import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarHeart, ChevronRight } from "lucide-react";
import { nextSocialDates } from "@/lib/socialDates";

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - new Date().setHours(0, 0, 0, 0);
  const d = Math.round(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "tomorrow";
  if (d < 7) return `in ${d}d`;
  if (d < 30) return `in ${Math.round(d / 7)}w`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TrendingSocialDates() {
  const items = nextSocialDates(8);
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="card-bento h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarHeart className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-base">Upcoming moments</h3>
        </div>
        <Link to="/dashboard/calendar" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          Open calendar <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin -mx-1 px-1 snap-x">
        {items.map((it) => (
          <Link
            key={it.date}
            to={`/dashboard/generator?topic=${encodeURIComponent(it.title + " — " + it.blurb)}`}
            className="group snap-start shrink-0 w-[220px] rounded-2xl border border-border/60 bg-muted/30 hover:bg-white hover:border-primary/30 hover:shadow-md p-4 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{it.emoji}</span>
              <span className="chip text-primary bg-primary/10">
                {daysUntil(it.date)}
              </span>
            </div>
            <p className="font-semibold text-sm mt-3">{it.title}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.blurb}</p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
