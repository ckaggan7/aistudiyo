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
      className="surface-floating rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarHeart className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Upcoming moments</h3>
        </div>
        <Link to="/dashboard/calendar" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          Open calendar <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-1 px-1">
        {items.map((it) => (
          <Link
            key={it.date}
            to={`/dashboard/generator?topic=${encodeURIComponent(it.title + " — " + it.blurb)}`}
            className="group shrink-0 w-[200px] rounded-xl border border-border/40 bg-background/40 p-3 hover-lift"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{it.emoji}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                {daysUntil(it.date)}
              </span>
            </div>
            <p className="font-semibold text-sm mt-2">{it.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{it.blurb}</p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
