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
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Next 7 days</h3>
        </div>
        <Link to="/dashboard/calendar" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          Full calendar <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const iso = d.toISOString().slice(0, 10);
          const ev = getSocialDate(iso);
          const isToday = i === 0;
          return (
            <Link
              key={iso}
              to="/dashboard/calendar"
              className={`relative rounded-xl p-2.5 surface-floating hover-lift text-center ${isToday ? "ring-1 ring-primary/40" : ""}`}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{DAYS[d.getDay()]}</p>
              <p className={`text-lg font-semibold ${isToday ? "text-primary" : ""}`}>{d.getDate()}</p>
              {ev ? (
                <span title={ev.title} className="text-base leading-none">{ev.emoji}</span>
              ) : (
                <span className="block h-4" />
              )}
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
