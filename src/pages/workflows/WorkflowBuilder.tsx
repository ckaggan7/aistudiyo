import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Play, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { nodeTypes, PALETTE, type NodeData } from "./nodes/WorkflowNodes";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

function uid() {
  return "n_" + Math.random().toString(36).slice(2, 9);
}

function BuilderInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { screenToFlowPosition } = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [name, setName] = useState("Untitled Workflow");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<Node | null>(null);
  const [runOutput, setRunOutput] = useState<{ status: string; output?: unknown; error?: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        toast.error("Workflow not found");
        navigate("/dashboard/workflows");
        return;
      }
      setName(data.name);
      setDescription(data.description ?? "");
      setStatus(data.status);
      const g = (data.graph as unknown as { nodes?: Node[]; edges?: Edge[] }) ?? { nodes: [], edges: [] };
      setNodes(g.nodes ?? []);
      setEdges(g.edges ?? []);
      setLoading(false);
    })();
  }, [id, navigate]);

  const onNodesChange = useCallback((c: NodeChange[]) => setNodes((nds) => applyNodeChanges(c, nds)), []);
  const onEdgesChange = useCallback((c: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(c, eds)), []);
  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge({ ...c, animated: true, style: { stroke: "hsl(var(--primary))", strokeWidth: 2 } }, eds)),
    [],
  );

  const addNode = (type: string) => {
    const center = wrapperRef.current?.getBoundingClientRect();
    const pos = center
      ? screenToFlowPosition({ x: center.left + 300, y: center.top + 200 })
      : { x: 200, y: 200 };
    const id = uid();
    setNodes((ns) => [
      ...ns,
      {
        id,
        type,
        position: pos,
        data: { nodeType: type, label: PALETTE.find((p) => p.type === type)?.label ?? type, config: {} },
      },
    ]);
  };

  const updateSelected = (patch: Record<string, unknown>) => {
    if (!selected) return;
    const patchConfig = (patch.config as Record<string, unknown> | undefined) ?? {};
    setNodes((ns) =>
      ns.map((n) =>
        n.id === selected.id
          ? { ...n, data: { ...n.data, ...patch, config: { ...((n.data as NodeData).config ?? {}), ...patchConfig } } }
          : n,
      ),
    );
    setSelected((s) => (s ? { ...s, data: { ...s.data, ...patch, config: { ...((s.data as NodeData).config ?? {}), ...patchConfig } } } : s));
  };

  const deleteSelected = () => {
    if (!selected) return;
    setNodes((ns) => ns.filter((n) => n.id !== selected.id));
    setEdges((es) => es.filter((e) => e.source !== selected.id && e.target !== selected.id));
    setSelected(null);
  };

  const save = async () => {
    if (!id || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("workflows")
      .update({ name, description, status, graph: { nodes, edges } as unknown as Json })
      .eq("id", id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const run = async () => {
    if (!id) return;
    setRunning(true);
    setRunOutput(null);
    await save();
    try {
      const { data, error } = await supabase.functions.invoke("workflow-execute", {
        body: { workflowId: id, input: {} },
      });
      if (error) throw error;
      setRunOutput(data);
      if (data?.status === "success") toast.success("Run completed");
      else toast.error(data?.error ?? "Run failed");
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Run failed");
    } finally {
      setRunning(false);
    }
  };

  const selectedData = selected?.data as NodeData | undefined;
  const cfg = (selectedData?.config ?? {}) as Record<string, string | undefined>;
  const nodeType = selectedData?.nodeType;

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="-m-6 h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-14 px-4 border-b border-border/60 bg-card/40 backdrop-blur-xl flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard/workflows">
            <ArrowLeft className="w-4 h-4 mr-1" /> Workflows
          </Link>
        </Button>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm h-8 bg-transparent border-transparent focus-visible:border-border focus-visible:bg-background text-sm font-semibold"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
          Save
        </Button>
        <Button size="sm" onClick={run} disabled={running} className="bg-gradient-hero text-primary-foreground">
          {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
          Run
        </Button>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left palette */}
        <aside className="w-56 shrink-0 border-r border-border/60 bg-card/30 backdrop-blur-xl p-3 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-1 mb-2">Add node</p>
          <div className="space-y-1.5">
            {PALETTE.map((p) => (
              <button
                key={p.type}
                onClick={() => addNode(p.type)}
                className="w-full flex items-start gap-2 px-2.5 py-2 rounded-xl border border-border/40 bg-background/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <p.icon className="w-3.5 h-3.5 mt-0.5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{p.label}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{p.description}</p>
                </div>
                <Plus className="w-3 h-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <div ref={wrapperRef} className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_e, n) => setSelected(n)}
            onPaneClick={() => setSelected(null)}
            fitView
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="!bg-background" />
            <MiniMap pannable zoomable maskColor="hsl(var(--background) / 0.85)" className="!bg-card/80 !border !border-border/60 !rounded-xl" />
            <Controls className="!bg-card/80 !border !border-border/60 !rounded-xl" />
          </ReactFlow>
          {/* Run output overlay */}
          {runOutput && (
            <div className="absolute bottom-4 left-4 right-4 max-h-60 overflow-auto rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xl p-4 shadow-elevated">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Last run · {runOutput.status}
                </p>
                <button onClick={() => setRunOutput(null)} className="text-xs text-muted-foreground hover:text-foreground">
                  Close
                </button>
              </div>
              <pre className="text-[11px] font-mono whitespace-pre-wrap break-words text-foreground/80">
                {JSON.stringify(runOutput.output ?? runOutput.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right inspector */}
        <aside className="w-80 shrink-0 border-l border-border/60 bg-card/30 backdrop-blur-xl p-4 overflow-y-auto">
          {!selected ? (
            <div className="text-center pt-8">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Inspector</p>
              <p className="text-xs text-muted-foreground">Select a node to configure it.</p>
              <div className="mt-6 space-y-2 text-left">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this workflow does"
                  className="text-xs min-h-[80px]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
                  {nodeType}
                </p>
                <button onClick={deleteSelected} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Label</Label>
                <Input
                  value={(selected.data as NodeData).label ?? ""}
                  onChange={(e) => updateSelected({ label: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              {(nodeType === "ai-text" || nodeType === "ai-image") && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Prompt</Label>
                    <Textarea
                      value={cfg.prompt ?? ""}
                      onChange={(e) => updateSelected({ config: { prompt: e.target.value } })}
                      placeholder="Use {{input.x}} or {{prev.text}}"
                      className="text-xs font-mono min-h-[120px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Model</Label>
                    <Select
                      value={cfg.model ?? (nodeType === "ai-image" ? "google/gemini-2.5-flash-image-preview" : "google/gemini-3-flash-preview")}
                      onValueChange={(v) => updateSelected({ config: { model: v } })}
                    >
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {nodeType === "ai-text" ? (
                          <>
                            <SelectItem value="google/gemini-3-flash-preview">Gemini 3 Flash</SelectItem>
                            <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                            <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                            <SelectItem value="openai/gpt-5">GPT-5</SelectItem>
                            <SelectItem value="openai/gpt-5-mini">GPT-5 Mini</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="google/gemini-2.5-flash-image-preview">Nano Banana</SelectItem>
                            <SelectItem value="google/gemini-3-pro-image-preview">Gemini 3 Pro Image</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {nodeType === "logic-condition" && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Left</Label>
                    <Input value={cfg.left ?? ""} onChange={(e) => updateSelected({ config: { left: e.target.value } })} placeholder="{{prev.text}}" className="h-8 text-xs font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Operator</Label>
                    <Select value={cfg.op ?? "equals"} onValueChange={(v) => updateSelected({ config: { op: v } })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="not_empty">Not empty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Right</Label>
                    <Input value={cfg.right ?? ""} onChange={(e) => updateSelected({ config: { right: e.target.value } })} className="h-8 text-xs font-mono" />
                  </div>
                </>
              )}

              {(nodeType === "transform" || nodeType === "output") && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Template</Label>
                  <Textarea
                    value={cfg.template ?? ""}
                    onChange={(e) => updateSelected({ config: { template: e.target.value } })}
                    placeholder="{{prev.text}}"
                    className="text-xs font-mono min-h-[100px]"
                  />
                </div>
              )}

              {nodeType === "trigger" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Source</Label>
                  <Select value={cfg.source ?? "manual"} onValueChange={(v) => updateSelected({ config: { source: v } })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <BuilderInner />
    </ReactFlowProvider>
  );
}