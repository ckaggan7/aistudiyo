import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Workflow, Play, Clock, History, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type Wf = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  run_count: number;
  last_run_at: string | null;
  created_at: string;
  is_template: boolean;
};

const TEMPLATES = [
  {
    name: "Caption + Image",
    description: "Generate a caption then an image from it",
    graph: {
      nodes: [
        { id: "n1", type: "trigger", position: { x: 40, y: 80 }, data: { nodeType: "trigger", label: "Manual Trigger", config: { source: "manual" } } },
        { id: "n2", type: "ai-text", position: { x: 320, y: 80 }, data: { nodeType: "ai-text", label: "Caption", config: { prompt: "Write a punchy 2-line Instagram caption for: {{input.topic}}" } } },
        { id: "n3", type: "ai-image", position: { x: 600, y: 80 }, data: { nodeType: "ai-image", label: "Cover Image", config: { prompt: "Cinematic flat-lay image for: {{prev.text}}" } } },
        { id: "n4", type: "output", position: { x: 880, y: 80 }, data: { nodeType: "output", label: "Result", config: { template: "{{nodes.n2.text}}" } } },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
      ],
    },
  },
  {
    name: "Trend Briefing",
    description: "Summarize a topic into a content brief",
    graph: {
      nodes: [
        { id: "n1", type: "trigger", position: { x: 40, y: 80 }, data: { nodeType: "trigger", label: "Trigger" } },
        { id: "n2", type: "ai-text", position: { x: 320, y: 80 }, data: { nodeType: "ai-text", label: "Brief", config: { prompt: "Create a 5-bullet content brief for: {{input.topic}}" } } },
        { id: "n3", type: "output", position: { x: 600, y: 80 }, data: { nodeType: "output", label: "Brief Result", config: { template: "{{prev.text}}" } } },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
      ],
    },
  },
];

export default function WorkflowsList() {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<Wf[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("workflows")
      .select("id,name,description,status,run_count,last_run_at,created_at,is_template")
      .order("created_at", { ascending: false });
    setWorkflows((data ?? []) as Wf[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createBlank = async () => {
    if (!user) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("workflows")
      .insert({
        user_id: user.id,
        name: "Untitled Workflow",
        graph: {
          nodes: [
            { id: "n1", type: "trigger", position: { x: 80, y: 100 }, data: { nodeType: "trigger", label: "Trigger" } },
          ],
          edges: [],
        },
      })
      .select("id")
      .single();
    setCreating(false);
    if (error) return toast.error(error.message);
    navigate(`/dashboard/workflows/${data.id}`);
  };

  const createFromTemplate = async (tpl: (typeof TEMPLATES)[number]) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("workflows")
      .insert({
        user_id: user.id,
        name: tpl.name,
        description: tpl.description,
        graph: tpl.graph,
      })
      .select("id")
      .single();
    if (error) return toast.error(error.message);
    navigate(`/dashboard/workflows/${data.id}`);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Workflows</p>
          <h1 className="text-3xl font-bold tracking-tight">AI Workflow Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Compose AI chains visually. Trigger → AI → Logic → Output.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard/workflows/runs">
              <History className="w-4 h-4 mr-2" /> Runs
            </Link>
          </Button>
          <Button onClick={createBlank} disabled={creating} className="bg-gradient-hero text-primary-foreground">
            {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            New workflow
          </Button>
        </div>
      </header>

      {/* Templates */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Start from a template
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              onClick={() => createFromTemplate(t)}
              className="text-left rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-4 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.5)] transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground">
                  <Workflow className="w-4 h-4" />
                </div>
                <p className="font-semibold text-sm">{t.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* My workflows */}
      <section>
        <h2 className="text-sm font-semibold mb-3">Your workflows</h2>
        {loading ? (
          <div className="h-40 grid place-items-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : workflows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
            <Workflow className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No workflows yet. Build your first AI chain.</p>
            <Button onClick={createBlank} className="bg-gradient-hero text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> New workflow
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workflows.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/dashboard/workflows/${w.id}`}
                  className="block rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm truncate flex-1">{w.name}</p>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold",
                        w.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {w.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                    {w.description ?? "—"}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" /> {w.run_count} runs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {w.last_run_at ? new Date(w.last_run_at).toLocaleDateString() : "Never"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}