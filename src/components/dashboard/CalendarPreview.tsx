import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { getSocialDate } from "@/lib/socialDates";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarPreview() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="card-bento h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-base">Next 7 days</h3>
        </div>
        <Link to="/dashboard/calendar" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          Open <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1.5 flex-1">
        {days.map((d, i) => {
          const iso = d.toISOString().slice(0, 10);
          const ev = getSocialDate(iso);
          const isToday = i === 0;
          return (
            <Link
              key={iso}
              to="/dashboard/calendar"
              className={`relative rounded-xl p-2 border border-border/60 bg-muted/30 hover:bg-white hover:border-primary/30 hover:shadow-sm transition-all text-center ${isToday ? "ring-1 ring-primary/40 bg-primary/5" : ""}`}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{DAYS[d.getDay()]}</p>
              <p className={`text-base font-semibold ${isToday ? "text-primary" : ""}`}>{d.getDate()}</p>
              {ev ? (
                <span title={ev.title} className="text-base leading-none">{ev.emoji}</span>
              ) : (
                <span className="block h-4 opacity-30 text-xs">·</span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
