import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

  useEffect(() => {
    if (!authLoading && user) navigate(redirectTo, { replace: true });
  }, [authLoading, user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name || undefined },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Block suspended users
        const uid = data.user?.id;
        if (uid) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("status")
            .eq("user_id", uid)
            .maybeSingle();
          if (prof?.status === "suspended") {
            await supabase.auth.signOut();
            throw new Error("This account has been suspended. Contact support.");
          }
        }
        toast.success("Welcome back");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (!result.redirected) setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070707] relative overflow-hidden flex items-center justify-center px-6">
      {/* Soft orange edge lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[680px] h-[420px] rounded-full blur-[120px]"
             style={{ background: "radial-gradient(ellipse, rgba(255,122,26,0.18), transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(22_100%_55%)]/30 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-semibold tracking-tight text-white">
            AI <span className="text-[hsl(22_100%_55%)]">STUDIYO</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0F0F10]/80 backdrop-blur-xl p-7">
          <h1 className="text-[22px] font-semibold tracking-tight text-center mb-1 text-white">
            {mode === "signin" ? "Welcome back" : "Start creating with AI"}
          </h1>
          <p className="text-sm text-[#A1A1AA] text-center mb-7">
            {mode === "signin" ? "Create smarter with AI." : "Your AI content workspace is ready."}
          </p>

          <div className="grid grid-cols-2 gap-1 p-1 mb-5 rounded-xl bg-white/[0.04] text-sm">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`h-9 rounded-lg font-medium transition-colors ${
                  mode === m ? "bg-[hsl(22_100%_55%)]/15 text-[hsl(22_100%_60%)]" : "text-white/55 hover:text-white"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-white/55 mb-1.5 block">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl bg-white/[0.03] border-white/[0.06] text-sm focus-visible:border-[hsl(22_100%_55%)]/40 focus-visible:ring-[hsl(22_100%_55%)]/15"
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-white/55 mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-white/[0.03] border-white/[0.06] text-sm focus-visible:border-[hsl(22_100%_55%)]/40 focus-visible:ring-[hsl(22_100%_55%)]/15"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/55 mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-white/[0.03] border-white/[0.06] text-sm pr-11 focus-visible:border-[hsl(22_100%_55%)]/40 focus-visible:ring-[hsl(22_100%_55%)]/15"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-b from-[hsl(22_100%_60%)] to-[hsl(22_100%_50%)] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_4px_14px_-6px_rgba(255,122,26,0.4)] hover:brightness-110 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> {mode === "signin" ? "Sign In" : "Create account"}
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-white/40 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <Button
            variant="outline"
            type="button"
            disabled={loading}
            className="w-full h-11 text-sm rounded-xl border-white/[0.06] bg-white/[0.03] text-white hover:bg-white/[0.05]"
            onClick={handleGoogle}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-xs text-white/45 mt-6">
          By continuing, you agree to our terms.{" "}
          <Link to="/signup" className="text-[hsl(22_100%_60%)] font-medium hover:underline">
            Or join the waitlist
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
