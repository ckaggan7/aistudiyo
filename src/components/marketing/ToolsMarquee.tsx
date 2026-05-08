import { Brain, Megaphone, MessageCircle, BadgeDollarSign, Users, Mic, Workflow, Magnet, ChartLine, Headset } from "lucide-react";

const tools = [
  { icon: Brain, label: "AI Caption Writer" },
  { icon: Megaphone, label: "AI Ad Generator" },
  { icon: MessageCircle, label: "AI WhatsApp Campaigns" },
  { icon: BadgeDollarSign, label: "AI Sales Assistant" },
  { icon: Users, label: "AI Community Manager" },
  { icon: Mic, label: "AI Voice Agent" },
  { icon: Workflow, label: "AI Workflow Builder" },
  { icon: Magnet, label: "AI Lead Engine" },
  { icon: ChartLine, label: "AI Analytics Brain" },
  { icon: Headset, label: "AI CRM Assistant" },
];

export function ToolsMarquee() {
  const row = [...tools, ...tools];
  return (
    <section id="stack" className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">AI Stack</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-3">10+ tools. One operating system.</h2>
      </div>

      <div className="group relative mask-fade-x">
        <div className="flex gap-4 animate-marquee pause-on-hover w-max">
          {row.map((t, i) => (
            <div key={i} className="flex items-center gap-3 glass glow-border rounded-2xl px-5 py-4 min-w-[260px]">
              <span className="w-10 h-10 rounded-xl bg-gradient-orange shadow-orange-glow inline-flex items-center justify-center flex-shrink-0">
                <t.icon className="w-4 h-4 text-white" />
              </span>
              <span className="font-medium text-sm">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
