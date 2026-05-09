import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useWallet() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    let { data } = await supabase.from("wallet").select("balance").limit(1).maybeSingle();
    if (!data) {
      const { data: created } = await supabase.from("wallet").insert({ balance: 50 }).select().single();
      data = created;
    }
    setBalance(data?.balance ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { balance, loading, refresh };
}
