import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function WorkspaceSwitcher() {
  const { workspaces, current, switchTo, createWorkspace, loading } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    const w = await createWorkspace(name.trim());
    if (w) {
      toast.success("Workspace created");
      setName("");
      setCreating(false);
      setOpen(false);
    } else {
      toast.error("Could not create workspace");
    }
  };

  if (loading) {
    return <div className="h-9 w-44 rounded-lg bg-muted animate-pulse" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="h-9 gap-2 max-w-[220px] justify-between bg-background/60 border-border/60"
        >
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate text-sm font-medium">
            {current?.name ?? "No workspace"}
          </span>
          <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1.5">
          Workspaces
        </div>
        <div className="max-h-64 overflow-y-auto">
          {workspaces.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                switchTo(w.id);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-left hover:bg-accent transition-colors",
              )}
            >
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="flex-1 truncate">{w.name}</span>
              <span className="text-[10px] uppercase text-muted-foreground">{w.plan}</span>
              {current?.id === w.id && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
        <div className="border-t border-border/60 mt-2 pt-2">
          {creating ? (
            <div className="flex gap-2 px-2 pb-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workspace name"
                className="h-9"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <Button size="sm" onClick={handleCreate} className="h-9">
                Create
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-primary hover:bg-primary/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New workspace</span>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}