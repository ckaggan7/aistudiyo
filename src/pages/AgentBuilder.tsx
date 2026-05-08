import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Sparkles, Search, BarChart3, Plus, Play, Loader2, Check,
  ArrowLeft, Clock, Wand2, Calendar, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type AgentType = "publisher" | "researcher" | "analyst";
type Agent = {
  id: string;
  name: string;
  type: AgentType;
  goal: string | null;
  system_prompt: string | null;
  schedule_cron: string | null;
  tools: string[];
  enabled: boolean;
};
type Run = {
  id: string;
  agent_id: string;
  status: string;
  output: string | null;
  logs: { t: string; msg: string }[];
  started_at: string;
  finished_at: string | null;
};

const TEMPLATES: { type: AgentType; name: string; icon: any; color: string; goal: string; system: string; tools: string[] }[] = [
  {
    type: "publisher", name: "Publisher Agent", icon: Wand2, color: "from-violet-500 to-fuchsia-500",
    goal: "Plan and schedule a week of on-brand Instagram posts",
    system: "You are a senior social media strategist. Craft scroll-stopping hooks and on-brand captions. Always end with a CTA.",
    tools: ["generate_caption", "generate_image", "schedule_post", "publish_to_meta"],
  },
  {
    type: "researcher", name: "Researcher Agent", icon: Search, color: "from-cyan-500 to-blue-500",
    goal: "Find emerging trends and competitor moves",
    system: "You are a culture and trend analyst. Surface non-obvious insights, cite evidence, prioritize action.",
    tools: ["web_search", "competitor_scan", "hashtag_trends", "summarize"],
  },
  {
    type: "analyst", name: "Analyst Agent", icon: BarChart3, color: "from-amber-500 to-rose-500",
    goal: "Audit performance and propose next-week experiments",
    system: "You are an analytics-driven growth marketer. Be numeric, blunt, and prescriptive.",
    tools: ["fetch_meta_insights", "compute_engagement", "generate_report", "post_to_calendar"],
  },
];

export default function AgentBuilder() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = async () => {
    const { data } = await supabase.from("agents").select("*").order("created_at", { ascending: false });
    setAgents((data as Agent[]) ?? []);
  };
  useEffect(() => { refresh(); }, []);

  const createFromTemplate = async (tpl: typeof TEMPLATES[number]) => {
    const { data } = await supabase.from("agents").insert({
      name: tpl.name, type: tpl.type, goal: tpl.goal, system_prompt: tpl.system,
      tools: tpl.tools, enabled: true,
    }).select().single();
    if (data) {
      toast.success(`${tpl.name} created`);
      refresh();
      setSelected(data as Agent);
    }
    setCreating(false);
  };

  if (selected) return <AgentDetail agent={selected} onBack={() => { setSelected(null); refresh(); }} onDelete={async () => {
    await supabase.from("agents").delete().eq("id", selected.id);
    toast.success("Agent deleted");
    setSelected(null);
    refresh();
  }} />;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agent Builder</h1>
            <p className="text-sm text-muted-foreground">Autonomous workers that publish, research, and analyze for you</p>
          </div>
        </div>
        <Button onClick={() => setCreating(true)} className="bg-gradient-hero text-primary-foreground rounded-xl">
          <Plus className="w-4 h-4" /> New agent
        </Button>
      </motion.div>

      {/* Templates always visible */}
      <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Templates</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {TEMPLATES.map((tpl) => (
          <button key={tpl.type} onClick={() => createFromTemplate(tpl)}
            className="text-left rounded-2xl bg-card border border-border/40 hover:border-primary/40 p-5 transition-all group">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tpl.color} flex items-center justify-center mb-3 shadow-glow`}>
              <tpl.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold mb-1">{tpl.name}</p>
            <p className="text-xs text-muted-foreground mb-3">{tpl.goal}</p>
            <div className="flex flex-wrap gap-1">
              {tpl.tools.slice(0, 3).map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
              ))}
              {tpl.tools.length > 3 && <span className="text-[10px] text-muted-foreground">+{tpl.tools.length - 3}</span>}
            </div>
          </button>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Your agents</h2>
      {agents.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No agents yet. Pick a template above to get started.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {agents.map((a) => (
            <button key={a.id} onClick={() => setSelected(a)}
              className="text-left flex items-center gap-3 rounded-xl bg-card border border-border/40 hover:border-primary/40 p-4 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{a.name}</p>
                <p className="text-xs text-muted-foreground truncate">{a.goal}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${a.enabled ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                {a.enabled ? "active" : "off"}
              </span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {creating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setCreating(false)}>
            <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-elevated border" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold mb-3">Pick a template</h3>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <button key={t.type} onClick={() => createFromTemplate(t)}
                    className="w-full text-left rounded-xl bg-secondary/40 hover:bg-secondary p-3 flex items-center gap-3">
                    <t.icon className="w-4 h-4 text-primary" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.goal}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgentDetail({ agent, onBack, onDelete }: { agent: Agent; onBack: () => void; onDelete: () => void }) {
  const [a, setA] = useState<Agent>(agent);
  const [runs, setRuns] = useState<Run[]>([]);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);

  const loadRuns = async () => {
    const { data } = await supabase.from("agent_runs").select("*").eq("agent_id", agent.id).order("started_at", { ascending: false }).limit(10);
    setRuns((data as Run[]) ?? []);
  };
  useEffect(() => { loadRuns(); }, [agent.id]);

  const save = async () => {
    await supabase.from("agents").update({
      name: a.name, goal: a.goal, system_prompt: a.system_prompt,
      schedule_cron: a.schedule_cron, enabled: a.enabled,
    }).eq("id", a.id);
    toast.success("Agent saved");
  };

  const run = async () => {
    setRunning(true);
    setOutput(null);
    setLiveLogs(["Starting agent…", "Loading brand context…", "Calling AI gateway…"]);
    const { data, error } = await supabase.functions.invoke("agent-runner", { body: { agent_id: a.id } });
    setRunning(false);
    if (error) { toast.error(error.message); return; }
    setOutput(data.output);
    setLiveLogs((data.logs ?? []).map((l: any) => l.msg));
    toast.success("Run complete");
    loadRuns();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to agents
      </button>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Config */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-2xl p-5 border border-border/40 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <Input className="font-semibold" value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Goal</label>
              <Textarea rows={2} value={a.goal ?? ""} onChange={(e) => setA({ ...a, goal: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">System prompt</label>
              <Textarea rows={4} value={a.system_prompt ?? ""} onChange={(e) => setA({ ...a, system_prompt: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Schedule (cron, optional)</label>
              <Input placeholder="0 9 * * 1" value={a.schedule_cron ?? ""} onChange={(e) => setA({ ...a, schedule_cron: e.target.value })} />
            </div>
            <div>
              <p className="text-xs font-medium mb-1.5">Tools</p>
              <div className="flex flex-wrap gap-1">
                {a.tools.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={save} variant="outline" className="flex-1">Save</Button>
              <Button onClick={run} disabled={running} className="flex-1 bg-gradient-hero text-primary-foreground">
                {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                {running ? "Running" : "Run now"}
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={onDelete} className="w-full text-destructive hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" /> Delete agent
            </Button>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border/40">
            <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted-foreground">Connect Meta</p>
            <p className="text-xs text-muted-foreground mb-3">Required for live publish to Instagram & Facebook. Add META_APP_ID and META_APP_SECRET in backend secrets, then complete OAuth.</p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Connect Instagram (coming soon)
            </Button>
          </div>
        </div>

        {/* Runs / output */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-card rounded-2xl p-5 border border-border/40">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">Run console</p>
              {running && <span className="text-xs text-primary inline-flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> running</span>}
            </div>
            <div className="bg-secondary/40 rounded-xl p-3 font-mono text-[11px] space-y-1 max-h-40 overflow-auto">
              {liveLogs.length === 0 ? (
                <p className="text-muted-foreground">No active run. Click "Run now" to start.</p>
              ) : liveLogs.map((l, i) => (
                <p key={i} className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-500" />{l}</p>
              ))}
            </div>
            {output && (
              <div className="mt-4 prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border/40">
            <p className="font-semibold mb-3">Run history</p>
            {runs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No runs yet.</p>
            ) : (
              <ul className="divide-y divide-border/40">
                {runs.map((r) => (
                  <li key={r.id} className="py-2 flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{new Date(r.started_at).toLocaleString()}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded-full ${r.status === "succeeded" ? "bg-emerald-500/10 text-emerald-600" : r.status === "running" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
