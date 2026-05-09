import { Search, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  placeholder?: string;
  children?: ReactNode;
  onClear?: () => void;
  className?: string;
};

export function FilterBar({ query, onQueryChange, placeholder = "Search…", children, onClear, className }: Props) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2", className)}>
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 h-10 bg-background/60 border-border/60"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          Reset
        </Button>
      )}
    </div>
  );
}