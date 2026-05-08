import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: result.data });

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast.info("You're already on the waitlist!");
        setJoined(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return;
    }

    setJoined(true);
    toast.success("You're on the list!");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Early Access
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Join the <span className="text-gradient-hero">Waitlist</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Be the first to experience AI STUDIYO when we launch.
        </p>

        {joined ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-primary/5 border border-primary/20"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
            <p className="font-semibold text-lg">You're on the list!</p>
            <p className="text-sm text-muted-foreground">
              We'll notify you as soon as we launch.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base flex-1"
              disabled={loading}
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-gradient-hero text-primary-foreground hover:opacity-90 transition-opacity h-12 px-6 text-base whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Waitlist"}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
