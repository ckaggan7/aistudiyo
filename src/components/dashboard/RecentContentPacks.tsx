import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Copy, RefreshCw, Pencil, Bookmark, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Generation = {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
};

const BLOCKS = ["Caption", "Hooks", "CTA", "Hashtags"];

export default function RecentContentPacks() {
  const [packs, setPacks] = useState<Generation[]>([]);

  useEffect(() => {
    supabase
      .from("generations")
      .select("id, image_url, prompt, created_at")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setPacks((data as Generation[]) ?? []));
  }, []);

  if (packs.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.25 }}
      className="surface-floating rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Recent content packs</h3>
        </div>
        <Link
          to="/dashboard/media"
          className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-1">
        {packs.map((p) => (
          <div
            key={p.id}
            className="group flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/40 transition-colors"
          >
            <Link to="/dashboard/media" className="shrink-0">
              <img
                src={p.image_url}
                alt={p.prompt}
                className="w-12 h-12 rounded-lg object-cover bg-secondary"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.prompt || "Untitled pack"}</p>
              <div className="flex gap-1 mt-1">
                {BLOCKS.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-background border border-border/40 text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(p.prompt);
                  toast.success("Copied");
                }}
                className="p-1.5 rounded-md hover:bg-primary/[0.08] text-muted-foreground hover:text-primary"
                aria-label="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <Link
                to={`/dashboard/generator?topic=${encodeURIComponent(p.prompt)}`}
                className="p-1.5 rounded-md hover:bg-primary/[0.08] text-muted-foreground hover:text-primary"
                aria-label="Regenerate"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/dashboard/media"
                className="p-1.5 rounded-md hover:bg-primary/[0.08] text-muted-foreground hover:text-primary"
                aria-label="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => toast.success("Saved")}
                className="p-1.5 rounded-md hover:bg-primary/[0.08] text-muted-foreground hover:text-primary"
                aria-label="Save"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}