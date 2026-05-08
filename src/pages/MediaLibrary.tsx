import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Eye, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4 } }),
};

type Item = {
  id: string;
  image_url: string;
  prompt: string;
  style: string | null;
  created_at: string;
};

export default function MediaLibrary() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("generations")
      .select("id, image_url, prompt, style, created_at")
      .order("created_at", { ascending: false });
    setItems((data as Item[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await supabase.from("generations").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-sm text-muted-foreground">All AI-generated images saved from your studio</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="border-2 border-dashed rounded-2xl p-12 text-center">
          <ImageOff className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium">No generations yet</p>
          <p className="text-sm text-muted-foreground">Create images in Image Studio — they'll show up here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m, i) => (
            <motion.div
              key={m.id}
              initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow"
            >
              <img src={m.image_url} alt={m.prompt} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <a href={m.image_url} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-background/90 hover:bg-background">
                  <Eye className="w-4 h-4" />
                </a>
                <button className="p-2 rounded-full bg-background/90 hover:bg-background" onClick={() => remove(m.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate" title={m.prompt}>{m.prompt}</p>
                <p className="text-xs text-muted-foreground">{m.style || "Custom"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
