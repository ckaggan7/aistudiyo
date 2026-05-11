import { useState } from "react";
import { Layers, ChevronDown } from "lucide-react";
import ResultCard from "./ResultCard";

type Slide = { headline: string; body: string };

export default function CarouselCard({
  title, slides, onRegenerate, regenerating,
}: {
  title: string; slides: Slide[]; onRegenerate: () => void; regenerating: boolean;
}) {
  const [open, setOpen] = useState(true);
  const copyValue = [`# ${title}`, ...slides.map((s, i) => `\nSlide ${i + 1}: ${s.headline}\n${s.body}`)].join("\n");

  return (
    <ResultCard
      title={`Carousel: ${title || "Untitled"}`}
      icon={<Layers className="w-4 h-4" />}
      badge={`${slides.length} slides`}
      copyValue={copyValue}
      onRegenerate={onRegenerate}
      regenerating={regenerating}
      delay={0.2}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
      >
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "" : "-rotate-90"}`} />
        {open ? "Hide slides" : "Show slides"}
      </button>
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {slides.map((s, i) => (
            <div key={i} className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/40 p-3">
              <div className="text-[10px] font-bold text-primary tracking-wider mb-1">SLIDE {i + 1}</div>
              <p className="text-sm font-semibold leading-snug mb-1">{s.headline}</p>
              <p className="text-xs text-muted-foreground leading-snug">{s.body}</p>
            </div>
          ))}
        </div>
      )}
    </ResultCard>
  );
}
