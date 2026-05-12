import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { Megaphone, Bot, Plug, ArrowRight } from "lucide-react";
import GrowthPageShell from "@/components/growth/GrowthPageShell";
import KpiTile from "@/components/growth/KpiTile";
import GoogleInsightsDock from "@/components/growth/GoogleInsightsDock";
import { KPIS, VISIBILITY_SERIES, isGrowthConnected } from "@/lib/growth/mockData";

export default function GrowthHub() {
  const connected = isGrowthConnected();
  return (
    <GrowthPageShell
      title="Business Command Center"
      subtitle="AI-native Google growth — ads, analytics, profile, reviews, SEO. All in one place."
      actions={
        <div className="flex items-center gap-2">
          {!connected && (
            <Link to="/dashboard/growth/connect" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-hero text-primary-foreground text-sm font-medium shadow-glow">
              <Plug className="w-4 h-4" /> Connect Google
            </Link>
          )}
          <Link to="/dashboard/growth/agent" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-border text-sm font-medium hover:shadow-elegant">
            <Bot className="w-4 h-4" /> Ask Growth Agent
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 auto-rows-min">
        {/* KPI row */}
        <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {KPIS.map((k, i) => <KpiTile key={k.label} kpi={k} index={i} />)}
        </div>

        {/* Insights dock */}
        <div className="lg:col-span-4 lg:row-span-2">
          <GoogleInsightsDock />
        </div>

        {/* Visibility trend */}
        <div className="lg:col-span-8 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-semibold">Visibility trend</div>
              <div className="text-[11px] text-muted-foreground">Profile reach · last 7 days</div>
            </div>
            <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VISIBILITY_SERIES}>
                <defs>
                  <linearGradient id="vis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(22 100% 55%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(22 100% 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="hsl(22 100% 55%)" strokeWidth={2} fill="url(#vis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick links */}
        {[
          { to: "/dashboard/growth/ads", icon: Megaphone, title: "Launch an AI Ads campaign", body: "Headlines, keywords, audience — generated in 10s." },
          { to: "/dashboard/growth/profile", icon: Plug, title: "Generate a Google Business post", body: "Offer, event or update — optimized for local SEO." },
          { to: "/dashboard/growth/reviews", icon: Bot, title: "Reply to reviews with AI", body: "Warm, professional or apologetic — on brand voice." },
        ].map(({ to, icon: Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="lg:col-span-4 bg-white border border-border rounded-2xl p-4 shadow-card hover:shadow-elegant transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-primary flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground mt-1">{body}</div>
          </Link>
        ))}
      </div>
    </GrowthPageShell>
  );
}