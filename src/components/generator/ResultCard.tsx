import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type ResultCardProps = {
  title: string;
  icon?: ReactNode;
  badge?: string;
  copyValue?: string;
  onRegenerate?: () => void | Promise<void>;
  regenerating?: boolean;
  actions?: ReactNode;
  children: ReactNode;
  delay?: number;
};

export default function ResultCard({
  title, icon, badge, copyValue, onRegenerate, regenerating, actions, children, delay = 0,
}: ResultCardProps) {
  const handleCopy = () => {
    if (!copyValue) return;
    navigator.clipboard.writeText(copyValue);
    toast.success("Copied");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-card rounded-2xl border border-border/40 p-4 md:p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="text-primary shrink-0">{icon}</div>}
        <h3 className="font-semibold text-sm flex-1">{title}</h3>
        {badge && (
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {badge}
          </span>
        )}
        <div className="flex items-center gap-1">
          {copyValue !== undefined && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={regenerating}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors disabled:opacity-40"
              title="Regenerate"
            >
              {regenerating
                ? <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                : <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          )}
          {actions}
        </div>
      </div>
      {children}
    </motion.section>
  );
}
