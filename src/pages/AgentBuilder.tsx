import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot, Send, Search, Plus, Play, Loader2, Check, ArrowLeft, Clock, Trash2, FileText, Inbox, Settings,
  Instagram, Linkedin, Flame, TrendingUp, MessageCircle, Repeat, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { WalletBadge } from "@/components/agents/WalletBadge";
import { InstagramConnectCard } from "@/components/agents/InstagramConnectCard";
import { ReportsLibrary } from "@/components/agents/ReportsLibrary";
import { ApprovalInbox } from "@/components/agents/ApprovalInbox";
import { useWallet } from "@/hooks/useWallet";

type AgentType = "publisher" | "insights";
type Agent = {
  id: string; name: string; type: AgentType; goal: string | null;
  system_prompt: string | null; schedule_cron: string | null;
  tools: string[]; enabled: boolean;
};
type Run = { id: string; agent_id: string; status: string; started_at: string };

type Category = "growth" | "content" | "strategy" | "research";

const TEMPLATES: { type: AgentType; category: Category; name: string; icon: any; color: string; goal: string; system: string; tools: string[]; cost: number; desc: string }[] = [
  {
    type: "publisher", category: "growth", name: "Instagram Growth", icon: Instagram, color: "from-pink-500 to-fuchsia-500",
    goal: "Plan, post, and hashtag-optimize for Instagram growth",
    system: "You are an Instagram growth strategist. Craft scroll-stopping hooks, on-brand captions, and trend-aware hashtags. Always end with a CTA.",
    tools: ["generate_caption", "generate_image", "schedule_post", "request_approval", "publish_to_meta"],
    cost: 5, desc: "Plans a week of IG posts, optimizes for reach, queues for approval and publishes.",
  },
  {
    type: "publisher", category: "growth", name: "LinkedIn Branding", icon: Linkedin, color: "from-blue-500 to-cyan-500",
    goal: "Authority posts and thought-leadership for LinkedIn",
    system: "You are a personal branding strategist for executives and founders. Write authority-driven LinkedIn posts with strong hooks, narrative arcs, and clear takeaways.",
    tools: ["generate_caption", "schedule_post", "request_approval"],
    cost: 4, desc: "Builds an authority voice on LinkedIn — long-form posts, story-driven hooks, weekly cadence.",
  },
  {
    type: "publisher", category: "content", name: "Viral Content", icon: Flame, color: "from-orange-500 to-red-500",
    goal: "Hook hunter and scroll-stop caption writer",
    system: "You are a viral content engineer. Generate 10 hook variants per topic, score them, and rewrite the top 3 into full captions.",
    tools: ["generate_caption", "generate_image", "request_approval"],
    cost: 4, desc: "Pumps out hook variants, scores them, expands the winners into full posts.",
  },
  {
    type: "insights", category: "research", name: "AI Research", icon: Search, color: "from-cyan-500 to-blue-500",
    goal: "Topic and competitor research",
    system: "You are a research analyst. Pull facts, examples, statistics, and competitor moves on a topic. Cite sources.",
    tools: ["web_search", "competitor_scan", "summarize"],
    cost: 3, desc: "Researches a topic or competitor deeply, returns a structured brief with sources.",
  },
  {
    type: "insights", category: "research", name: "Trend Hunter", icon: TrendingUp, color: "from-emerald-500 to-cyan-500",
    goal: "Surface emerging trends daily",
    system: "You are a culture analyst. Scan the web for emerging trends in the user's niche and rank them by velocity and relevance.",
    tools: ["web_search", "summarize"],
    cost: 3, desc: "Daily scan of emerging trends in your niche, ranked by velocity.",
  },
  {
    type: "publisher", category: "growth", name: "Engagement", icon: MessageCircle, color: "from-violet-500 to-pink-500",
    goal: "Reply drafts and DM ideas",
    system: "You are a community manager. Draft warm, on-brand reply variants to comments and DMs.",
    tools: ["generate_caption", "request_approval"],
    cost: 2, desc: "Drafts on-brand replies to comments and DMs — never sounds like a bot.",
  },
  {
    type: "publisher", category: "content", name: "Repurposing", icon: Repeat, color: "from-amber-500 to-orange-500",
    goal: "One post into carousel, reel, blog",
    system: "You are a content repurposer. Take a single post and reshape it into 5 formats: carousel, reel script, LinkedIn post, X thread, blog intro.",
    tools: ["generate_caption", "generate_image", "request_approval"],
    cost: 3, desc: "Turn one piece of content into a week's worth across platforms.",
  },
  {
    type: "insights", category: "strategy", name: "Campaign Strategist", icon: Target, color: "from-fuchsia-500 to-purple-500",
    goal: "Multi-week campaign plans",
    system: "You are a campaign strategist. Build week-by-week campaign plans with objectives, content pillars, hooks, and KPIs.",
    tools: ["web_search", "summarize"],
    cost: 4, desc: "Plans multi-week campaigns with content pillars, hooks, and KPIs.",
  },
];

const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "growth", label: "Growth" },
  { id: "content", label: "Content" },
  { id: "strategy", label: "Strategy" },
  { id: "research", label: "Research" },
];

export default function AgentBuilder() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<Agent | null>(null);

  const refresh = async () => {
    const { data } = await supabase.from("agents").select("*").order("created_at", { ascending: false });
    setAgents((data as Agent[]) ?? []);
  };
  useEffect(() => { refresh(); }, []);

  const createFromTemplate = async (tpl: typeof TEMPLATES[number]) => {
    const existing = agents.find((a) => a.type === tpl.type);
    if (existing) { setSelected(existing); return; }
    const { data } = await supabase.from("agents").insert({
      name: tpl.name, type: tpl.type, goal: tpl.goal, system_prompt: tpl.system,
      tools: tpl.tools, enabled: true,
    }).select().single();
    if (data) {
      toast.success(`${tpl.name} ready`);
      refresh();
      setSelected(data as Agent);
    }
  };

  if (selected) return <AgentDetail agent={selected} onBack={() => { setSelected(null); refresh(); }} onDelete={async () => {
    await supabase.from("agents").delete().eq("id", selected.id);
    toast.success("Agent deleted");
    setSelected(null);
    refresh();
  }} />;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
            <p className="text-sm text-muted-foreground">Autonomous workers powered by your wallet credits</p>
          </div>
        </div>
        <WalletBadge />
      </motion.div>

      <div className="mb-6"><InstagramConnectCard /></div>

      <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Your agents</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {TEMPLATES.map((tpl) => {
          const existing = agents.find((a) => a.type === tpl.type);
          return (
            <button key={tpl.type} onClick={() => createFromTemplate(tpl)}
              className="text-left rounded-2xl bg-card border border-border/40 hover:border-primary/40 p-6 transition-all group relative overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${tpl.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${tpl.color} flex items-center justify-center mb-4 shadow-glow`}>
                <tpl.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-base">{tpl.name}</p>
                {existing && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">active</span>}
              </div>
              <p className="text-xs text-muted-foreground mb-4">{tpl.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {tpl.tools.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                  ))}
                  {tpl.tools.length > 3 && <span className="text-[10px] text-muted-foreground self-center">+{tpl.tools.length - 3}</span>}
                </div>
                <span className="text-[11px] text-muted-foreground">{tpl.cost} credits/run</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Saved reports</h2>
      </div>
      <ReportsLibrary />
    </div>
  );
}

function AgentDetail({ agent, onBack, onDelete }: { agent: Agent; onBack: () => void; onDelete: () => void }) {
  const [a, setA] = useState<Agent>(agent);
  const [runs, setRuns] = useState<Run[]>([]);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [tab, setTab] = useState(agent.type === "publisher" ? "run" : "run");
  const { balance, refresh: refreshWallet } = useWallet();

  // Publisher inputs
  const [posts, setPosts] = useState(3);
  const [days, setDays] = useState(7);
  // Insights inputs
  const [mode, setMode] = useState<"research" | "analyze" | "blend">("blend");

  const cost = agent.type === "publisher" ? 5 : 3;

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
    toast.success("Saved");
  };

  const run = async () => {
    if (balance < cost) {
      toast.error(`Need ${cost} credits — wallet has ${balance}`);
      return;
    }
    setRunning(true);
    setOutput(null);
    setLogs(["Checking wallet…", `Reserving ${cost} credits…`, "Loading brand context…", "Calling AI gateway…"]);
    const { data, error } = await supabase.functions.invoke("agent-runner", {
      body: { agent_id: a.id, params: { posts, days, mode } },
    });
    setRunning(false);
    if (error) { toast.error(error.message); return; }
    setOutput(data.output);
    setLogs((data.logs ?? []).map((l: any) => l.msg));
    toast.success(`Run complete · -${cost} credits`);
    refreshWallet();
    loadRuns();
    if (agent.type === "publisher") setTab("approvals");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <WalletBadge />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <Input className="font-semibold text-lg border-0 px-0 h-auto focus-visible:ring-0" value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} />
          <p className="text-xs text-muted-foreground">{cost} credits per run</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="run"><Play className="w-3.5 h-3.5" /> Run</TabsTrigger>
          {agent.type === "publisher" && <TabsTrigger value="approvals"><Inbox className="w-3.5 h-3.5" /> Approvals</TabsTrigger>}
          <TabsTrigger value="reports"><FileText className="w-3.5 h-3.5" /> Reports</TabsTrigger>
          <TabsTrigger value="config"><Settings className="w-3.5 h-3.5" /> Configure</TabsTrigger>
        </TabsList>

        <TabsContent value="run" className="mt-4 space-y-4">
          <div className="bg-card rounded-2xl p-5 border border-border/40">
            {agent.type === "publisher" ? (
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-medium mb-1 block">Posts to plan</label>
                  <Input type="number" min={1} max={14} value={posts} onChange={(e) => setPosts(+e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Spread over (days)</label>
                  <Input type="number" min={1} max={30} value={days} onChange={(e) => setDays(+e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="text-xs font-medium mb-2 block">Mode</label>
                <div className="flex gap-2">
                  {(["research", "analyze", "blend"] as const).map((m) => (
                    <button key={m} onClick={() => setMode(m)} className={`flex-1 text-xs px-3 py-2 rounded-lg border ${mode === m ? "bg-primary/10 border-primary/40 text-primary" : "bg-secondary/40 border-transparent text-muted-foreground"}`}>
                      {m === "research" ? "Trends" : m === "analyze" ? "My performance" : "Blend both"}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={run} disabled={running} className="w-full bg-gradient-hero text-primary-foreground">
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {running ? "Running" : `Run now · ${cost} credits`}
            </Button>
          </div>

          {(logs.length > 0 || output) && (
            <div className="bg-card rounded-2xl p-5 border border-border/40">
              <div className="bg-secondary/40 rounded-xl p-3 font-mono text-[11px] space-y-1 max-h-40 overflow-auto mb-3">
                {logs.map((l, i) => <p key={i} className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-500" />{l}</p>)}
              </div>
              {output && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {agent.type === "publisher" && (
          <TabsContent value="approvals" className="mt-4">
            <ApprovalInbox />
          </TabsContent>
        )}

        <TabsContent value="reports" className="mt-4">
          <ReportsLibrary agentId={agent.id} />
        </TabsContent>

        <TabsContent value="config" className="mt-4 space-y-4">
          <div className="bg-card rounded-2xl p-5 border border-border/40 space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Goal</label>
              <Textarea rows={2} value={a.goal ?? ""} onChange={(e) => setA({ ...a, goal: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">System prompt</label>
              <Textarea rows={4} value={a.system_prompt ?? ""} onChange={(e) => setA({ ...a, system_prompt: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Schedule (cron)</label>
              <Input placeholder="0 9 * * 1" value={a.schedule_cron ?? ""} onChange={(e) => setA({ ...a, schedule_cron: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={save} variant="outline" className="flex-1">Save</Button>
              <Button onClick={onDelete} variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border/40">
            <p className="font-semibold text-sm mb-2">Run history</p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
