import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socialDatesInMonth, getSocialDate, type SocialDate } from "@/lib/socialDates";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const mockPosts: Record<string, { title: string; platform: string }[]> = {
  "2026-05-15": [{ title: "Product launch 🚀", platform: "Instagram" }],
  "2026-05-18": [{ title: "Behind the scenes", platform: "LinkedIn" }],
  "2026-05-22": [{ title: "Tips & tricks carousel", platform: "Instagram" }],
  "2026-05-25": [{ title: "Customer spotlight", platform: "Twitter" }],
};

export default function ContentCalendar() {
  const navigate = useNavigate();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<SocialDate | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthEvents = socialDatesInMonth(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-display">Content Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">Plan, schedule, and let AI fill the gaps.</p>
        </div>
        <Button className="btn-premium">
          <Plus className="w-4 h-4 mr-1.5" /> Schedule Post
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="surface-floating rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prev} className="p-2 rounded-lg hover:bg-secondary/60 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-semibold tracking-tight">{MONTHS[month]} {year}</h2>
            <button onClick={next} className="p-2 rounded-lg hover:bg-secondary/60 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] uppercase tracking-wider font-medium text-muted-foreground py-1.5">{d}</div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={i} className="min-h-[78px]" />;
              const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const posts = mockPosts[dateKey];
              const ev = getSocialDate(dateKey);
              const isToday = dateKey === todayISO;
              return (
                <button
                  key={i}
                  onClick={() => ev && setSelected(ev)}
                  className={`min-h-[78px] p-1.5 rounded-xl text-left border transition-all
                    ${isToday ? "border-primary/50 bg-primary/[0.06]" : "border-border/40 hover:border-primary/30 bg-background/40"}
                    ${ev ? "hover-lift" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${isToday ? "text-primary" : ""}`}>{day}</span>
                    {ev && <span className="text-sm leading-none">{ev.emoji}</span>}
                  </div>
                  {posts?.map((post, j) => (
                    <div key={j} className="mt-1 text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 truncate">
                      {post.title}
                    </div>
                  ))}
                  {ev && !posts && (
                    <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">{ev.title}</p>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.aside initial="hidden" animate="visible" variants={fadeUp} className="space-y-4">
          <div className="surface-floating rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">AI suggestions</h3>
            </div>
            {selected ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selected.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{selected.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{selected.category}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{selected.blurb}</p>
                <button
                  onClick={() => navigate(`/dashboard/generator?topic=${encodeURIComponent(selected.title + " — " + selected.blurb)}`)}
                  className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg btn-premium text-xs font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate post
                </button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Tap an event marker to get AI post ideas tailored to that moment.</p>
            )}
          </div>

          <div className="surface-floating rounded-2xl p-4">
            <h3 className="text-sm font-semibold mb-3">This month's moments</h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin pr-1">
              {monthEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">No trending dates this month.</p>
              ) : monthEvents.map((ev) => (
                <button
                  key={ev.date}
                  onClick={() => setSelected(ev)}
                  className="w-full text-left rounded-xl p-2 hover:bg-secondary/60 transition-colors flex items-center gap-2"
                >
                  <span className="text-base">{ev.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{ev.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(ev.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
