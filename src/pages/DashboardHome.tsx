import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import QuickCreateBar from "@/components/dashboard/QuickCreateBar";
import CoreActionCards from "@/components/dashboard/CoreActionCards";
import TrendingIdeasStrip from "@/components/dashboard/TrendingIdeasStrip";
import AISuggestions from "@/components/dashboard/AISuggestions";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import WhatsNewCarousel from "@/components/dashboard/WhatsNewCarousel";

type Generation = {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
};

export default function DashboardHome() {
  const [recent, setRecent] = useState<Generation[]>([]);

  useEffect(() => {
    supabase
      .from("generations")
      .select("id, image_url, prompt, created_at")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setRecent((data as Generation[]) ?? []));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <WelcomeHeader />
      <QuickCreateBar />
      <WhatsNewCarousel />
      <CoreActionCards />
      <AISuggestions />
      <TrendingIdeasStrip />

      {recent.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35 }}
          className="bg-card rounded-2xl p-5 md:p-6 border border-border/40 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Recent generations</h3>
              <p className="text-xs text-muted-foreground">Latest from the studio</p>
            </div>
            <Link
              to="/dashboard/media"
              className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {recent.map((g) => (
              <Link
                key={g.id}
                to="/dashboard/media"
                className="group relative aspect-square rounded-xl overflow-hidden bg-secondary"
              >
                <img
                  src={g.image_url}
                  alt={g.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
