import { Handle, Position, NodeProps } from "@xyflow/react";
import { Zap, Sparkles, Image as ImageIcon, GitBranch, Wand2, Send, Database } from "lucide-react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

export type NodeData = {
  nodeType: string;
  label?: string;
  description?: string;
  config?: {
    prompt?: string;
    template?: string;
    left?: string;
    [key: string]: unknown;
  };
};

const NODE_META: Record<string, { icon: ElementType; label: string; color: string }> = {
  trigger: { icon: Zap, label: "Trigger", color: "from-amber-500 to-orange-600" },
  "ai-text": { icon: Sparkles, label: "AI Text", color: "from-orange-500 to-rose-500" },
  "ai-image": { icon: ImageIcon, label: "AI Image", color: "from-fuchsia-500 to-orange-500" },
  "logic-condition": { icon: GitBranch, label: "Condition", color: "from-cyan-500 to-blue-600" },
  transform: { icon: Wand2, label: "Transform", color: "from-violet-500 to-purple-600" },
  output: { icon: Send, label: "Output", color: "from-emerald-500 to-teal-600" },
  asset: { icon: Database, label: "Asset", color: "from-zinc-500 to-zinc-700" },
};

function NodeShell({ data, selected, isEntry, isExit }: NodeProps & { isEntry?: boolean; isExit?: boolean }) {
  const d = data as NodeData;
  const meta = NODE_META[d.nodeType] ?? NODE_META.trigger;
  const Icon = meta.icon;
  const cfg = d.config ?? {};
  const summary =
    cfg.prompt?.slice(0, 60) ||
    cfg.template?.slice(0, 60) ||
    cfg.left ||
    d.description ||
    "Click to configure";

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card/80 backdrop-blur-xl min-w-[220px] transition-all",
        selected
          ? "border-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.4),0_0_40px_-5px_hsl(var(--primary)/0.5)]"
          : "border-border/60 hover:border-primary/40 shadow-elegant",
      )}
    >
      {!isEntry && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2.5 !h-2.5 !bg-primary !border-primary"
        />
      )}
      <div className={cn("flex items-center gap-2 px-3 py-2 rounded-t-2xl bg-gradient-to-r text-white", meta.color)}>
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{meta.label}</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground truncate">
          {d.label ?? meta.label}
        </p>
        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{summary}</p>
      </div>
      {!isExit && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5 !bg-primary !border-primary"
        />
      )}
    </div>
  );
}

export const TriggerNode = (p: NodeProps) => <NodeShell {...p} isEntry />;
export const AITextNode = (p: NodeProps) => <NodeShell {...p} />;
export const AIImageNode = (p: NodeProps) => <NodeShell {...p} />;
export const ConditionNode = (p: NodeProps) => <NodeShell {...p} />;
export const TransformNode = (p: NodeProps) => <NodeShell {...p} />;
export const OutputNode = (p: NodeProps) => <NodeShell {...p} isExit />;

export const nodeTypes = {
  trigger: TriggerNode,
  "ai-text": AITextNode,
  "ai-image": AIImageNode,
  "logic-condition": ConditionNode,
  transform: TransformNode,
  output: OutputNode,
};

export const PALETTE = [
  { type: "trigger", label: "Trigger", icon: Zap, description: "Start of the workflow" },
  { type: "ai-text", label: "AI Text", icon: Sparkles, description: "Generate text with AI" },
  { type: "ai-image", label: "AI Image", icon: ImageIcon, description: "Generate images with AI" },
  { type: "logic-condition", label: "Condition", icon: GitBranch, description: "Branch on a condition" },
  { type: "transform", label: "Transform", icon: Wand2, description: "Format strings using context" },
  { type: "output", label: "Output", icon: Send, description: "Final result" },
];