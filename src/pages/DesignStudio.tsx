import { motion } from "framer-motion";
import { Palette, Plus, Type, Image, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const templates = [
  { name: "Instagram Post", size: "1080 × 1080", color: "bg-gradient-hero" },
  { name: "Instagram Reel Cover", size: "1080 × 1920", color: "bg-gradient-accent" },
  { name: "Carousel Slide", size: "1080 × 1080", color: "bg-gradient-hero" },
  { name: "LinkedIn Post", size: "1200 × 628", color: "bg-gradient-accent" },
];

const tools = [
  { icon: Type, label: "Add Text" },
  { icon: Image, label: "Upload Image" },
  { icon: Wand2, label: "AI Background" },
  { icon: Plus, label: "Add Element" },
];

export default function DesignStudio() {
  return (
    <div>
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-2xl font-bold tracking-tight mb-6">
        Design Studio
      </motion.h1>

      {/* Tools */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="flex flex-wrap gap-2 mb-6">
        {tools.map((tool) => (
          <Button key={tool.label} variant="outline" size="sm" className="gap-2">
            <tool.icon className="w-4 h-4" /> {tool.label}
          </Button>
        ))}
      </motion.div>

      {/* Canvas Area */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="bg-card rounded-2xl shadow-card p-8 mb-8">
        <div className="aspect-square max-w-lg mx-auto rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-secondary/30">
          <div className="text-center">
            <Palette className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm mb-4">Select a template or start from scratch</p>
            <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" /> New Design
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Templates */}
      <h2 className="text-lg font-semibold mb-4">Templates</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template, i) => (
          <motion.button
            key={template.name}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 3}
            className="bg-card rounded-2xl p-4 shadow-card hover:shadow-elevated transition-shadow text-left"
          >
            <div className={`w-full aspect-square rounded-xl ${template.color} mb-3 opacity-80`} />
            <p className="text-sm font-medium">{template.name}</p>
            <p className="text-xs text-muted-foreground">{template.size}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
