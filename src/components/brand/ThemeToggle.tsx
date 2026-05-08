import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "relative inline-flex w-9 h-9 items-center justify-center rounded-full border border-border/60 hover:bg-secondary/60 transition-colors",
        className
      )}
    >
      <Sun className={cn("w-4 h-4 transition-all", theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0")} />
      <Moon className={cn("w-4 h-4 absolute transition-all", theme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90")} />
    </button>
  );
}
