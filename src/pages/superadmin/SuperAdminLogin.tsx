import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlowCard } from "@/components/ui/glow-card";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootstrapMode, setBootstrapMode] = useState(false);

  // Detect if any super_admin already exists. If not, expose a "claim" flow.
  useEffect(() => {
    (async () => {
      const { count } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "super_admin");
      setBootstrapMode((count ?? 0) === 0);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const uid = data.user?.id;
      if (!uid) throw new Error("No session");

      // If bootstrap mode (no super_admin exists yet), claim it for this user.
      if (bootstrapMode) {
        const { count } = await supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "super_admin");
        if ((count ?? 0) === 0) {
          // Allowed because RLS lets users insert their own row; super_admin policy permits it during open bootstrap.
          const { error: insErr } = await supabase
            .from("user_roles")
            .insert({ user_id: uid, role: "super_admin" as const });
          if (insErr) {
            await supabase.auth.signOut();
            throw new Error(
              "Bootstrap blocked by security policy. Ask the platform owner to grant super_admin manually.",
            );
          }
          toast.success("Super admin claimed for this account");
        }
      }

      // Verify role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "super_admin");
      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        throw new Error("Access denied — this account is not a super admin.");
      }
      toast.success("Welcome, Super Admin");
      navigate("/superadmin", { replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-destructive/10 blur-3xl" />
      </div>
      <GlowCard className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-destructive font-bold">Restricted</p>
            <h1 className="text-xl font-bold tracking-tight">Super Admin Portal</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {bootstrapMode
            ? "No super admin exists yet. Sign in with your account to claim ownership."
            : "Sign in with your super admin credentials to monitor users."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {bootstrapMode ? "Claim Super Admin" : "Sign in"}
          </Button>
        </form>
      </GlowCard>
    </div>
  );
}