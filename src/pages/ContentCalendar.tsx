import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const mockPosts: Record<string, { title: string; platform: string }[]> = {
  "2026-03-15": [{ title: "Product launch 🚀", platform: "Instagram" }],
  "2026-03-18": [{ title: "Behind the scenes", platform: "LinkedIn" }],
  "2026-03-22": [{ title: "Tips & tricks carousel", platform: "Instagram" }],
  "2026-03-25": [{ title: "Customer spotlight", platform: "Twitter" }],
};

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
        <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Schedule Post
        </Button>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-card rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prev} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">{MONTHS[month]} {year}</h2>
          <button onClick={next} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
          {cells.map((day, i) => {
            const dateKey = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
            const posts = dateKey ? mockPosts[dateKey] : undefined;
            return (
              <div
                key={i}
                className={`min-h-[80px] p-1.5 rounded-lg border border-transparent ${day ? "hover:border-border cursor-pointer" : ""} transition-colors`}
              >
                {day && (
                  <>
                    <span className="text-xs font-medium">{day}</span>
                    {posts?.map((post, j) => (
                      <div key={j} className="mt-1 text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 truncate">
                        {post.title}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
