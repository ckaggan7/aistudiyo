import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CreditTxn = {
  id: string;
  amount: number;
  reason: string;
  type: string;
  created_at: string;
  agent_id: string | null;
  run_id: string | null;
  actor_id: string | null;
};

export function useWallet() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<CreditTxn[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) { setLoading(false); return; }

    let { data: w } = await supabase
      .from("wallet").select("balance").eq("user_id", uid).maybeSingle();
    if (!w) {
      const { data: created } = await supabase
        .from("wallet").insert({ user_id: uid, balance: 50 }).select().single();
      w = created;
    }
    setBalance(w?.balance ?? 0);

    const { data: txns } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(200);
    setTransactions((txns ?? []) as CreditTxn[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const spent = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const earned = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return { balance, transactions, loading, refresh, spent, earned };
}
