import { Coins, Plus } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function WalletBadge() {
  const { balance } = useWallet();
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-card px-3 py-1.5">
      <Coins className="w-3.5 h-3.5 text-amber-500" />
      <span className="text-sm font-semibold tabular-nums">{balance}</span>
      <span className="text-xs text-muted-foreground">credits</span>
      <Button asChild size="sm" variant="ghost" className="h-6 px-2 -mr-1">
        <Link to="/dashboard/credits"><Plus className="w-3 h-3" /> Top up</Link>
      </Button>
    </div>
  );
}
