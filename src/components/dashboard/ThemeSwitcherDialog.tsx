import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

function ThemeGrid({ onPicked }: { onPicked?: () => void }) {
  const { themes, themeId, setTheme } = useTheme();
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
      {themes.map((t) => {
        const active = themeId === t.id;
        return (
          <button
            key={t.id}
            onMouseEnter={() => { setHover(t.id); /* preview */ const root = document.documentElement; Object.entries(t.vars).forEach(([k,v]) => root.style.setProperty(k, v)); }}
            onMouseLeave={() => { if (hover) { setHover(null); const cur = themes.find(x => x.id === themeId)!; const root = document.documentElement; Object.entries(cur.vars).forEach(([k,v]) => root.style.setProperty(k, v)); } }}
            onClick={() => { setTheme(t.id); onPicked?.(); }}
            className={cn(
              "group relative rounded-xl border p-3 text-left transition-all overflow-hidden",
              active ? "border-primary shadow-glow" : "border-border/50 hover:border-primary/40"
            )}
          >
            <div className="h-14 w-full rounded-lg mb-2" style={{ background: t.swatch }} />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium truncate">{t.name}</span>
              {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function ThemeSwitcherDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Change theme</SheetTitle>
            <SheetDescription>Pick a vibe. Your whole workspace recolors instantly.</SheetDescription>
          </SheetHeader>
          <ThemeGrid onPicked={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Change theme</DialogTitle>
          <DialogDescription>Pick a vibe. Your whole workspace recolors instantly. Hover to preview.</DialogDescription>
        </DialogHeader>
        <ThemeGrid onPicked={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
