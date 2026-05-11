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
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarHeart className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Trending social dates</h3>
        </div>
        <Link to="/dashboard/calendar" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          Open calendar <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((it) => (
          <Link
            key={it.date}
            to={`/dashboard/generator?topic=${encodeURIComponent(it.title + " — " + it.blurb)}`}
            className="group shrink-0 w-[220px] rounded-xl surface-floating p-3 hover-lift"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{it.emoji}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                {daysUntil(it.date)}
              </span>
            </div>
            <p className="font-semibold text-sm mt-2">{it.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{it.blurb}</p>
            <p className="text-[10px] text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Generate post →
            </p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
