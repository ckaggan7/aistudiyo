import { Link } from "react-router-dom";
import {
  Bot, Workflow, Palette, Calendar, ImageIcon, Sparkles,
} from "lucide-react";

const items = [
  { label: "Agents", to: "/dashboard/agents", icon: Bot },
  { label: "Workflow", to: "/dashboard/workflows", icon: Workflow },
  { label: "Branding CRM", to: "/dashboard/branding", icon: Palette },
  { label: "Calendar", to: "/dashboard/calendar", icon: Calendar },
  { label: "New Image Gen Engine", to: "/dashboard/image-studio", icon: ImageIcon },
  { label: "ChatGPT 2.0", to: "/dashboard/agents", icon: Sparkles },
];

export default function AnnouncementBanner() {
  const track = (
    <div className="flex items-center gap-6 px-6 shrink-0">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <div key={i} className="flex items-center gap-6">
            <Link
              to={it.to}
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              <Icon className="w-3.5 h-3.5 text-primary/80 group-hover:text-primary" />
              <span>{it.label}</span>
            </Link>
            <span className="w-1 h-1 rounded-full bg-border" />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur mb-4">
      <style>{`
        @keyframes ann-scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ann-marquee { animation: ann-scroll-x 30s linear infinite; }
        .ann-marquee-wrap:hover .ann-marquee { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .ann-marquee { animation: none; } }
      `}</style>
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
      <div className="flex items-center h-10">
        <div className="flex items-center gap-2 px-4 shrink-0 z-10 bg-card/80 border-r border-border/40 h-full">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[10px] font-bold tracking-wider text-primary">NEW</span>
        </div>
        <div className="ann-marquee-wrap relative flex-1 overflow-hidden">
          <div className="ann-marquee flex w-max">
            {track}
            {track}
          </div>
        </div>
      </div>
    </div>
  );
}