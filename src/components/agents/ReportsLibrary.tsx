import { useState } from "react";
import { FileText, Pin, Trash2, X } from "lucide-react";
import { useReports, type AgentReport } from "@/hooks/useReports";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

export function ReportsLibrary({ agentId }: { agentId?: string }) {
  const { reports, togglePin, remove } = useReports(agentId);
  const [open, setOpen] = useState<AgentReport | null>(null);

  if (reports.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-2xl p-8 text-center text-xs text-muted-foreground">
        No saved reports yet. Run an agent to generate one.
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {reports.map((r) => (
          <div key={r.id} className="group rounded-xl bg-card border border-border/40 hover:border-primary/40 p-4 transition-all">
            <button onClick={() => setOpen(r)} className="text-left w-full">
              <div className="flex items-start gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary mt-0.5" />
                <p className="text-sm font-semibold line-clamp-2 flex-1">{r.title}</p>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{r.content_md.slice(0, 120)}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
            </button>
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => togglePin(r)} className={`text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${r.pinned ? "bg-amber-500/10 text-amber-600" : "bg-secondary text-muted-foreground"}`}>
                <Pin className="w-3 h-3" /> {r.pinned ? "Pinned" : "Pin"}
              </button>
              <button onClick={() => remove(r.id)} className="text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpen(null)}>
            <motion.div initial={{ y: 12 }} animate={{ y: 0 }} className="bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-auto border" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <h3 className="font-bold text-lg">{open.title}</h3>
                <button onClick={() => setOpen(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{open.content_md}</ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
