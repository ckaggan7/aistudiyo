import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const engagementData = [
  { name: "Mon", likes: 240, comments: 45, shares: 20 },
  { name: "Tue", likes: 320, comments: 62, shares: 35 },
  { name: "Wed", likes: 180, comments: 38, shares: 15 },
  { name: "Thu", likes: 450, comments: 80, shares: 55 },
  { name: "Fri", likes: 380, comments: 70, shares: 42 },
  { name: "Sat", likes: 520, comments: 95, shares: 65 },
  { name: "Sun", likes: 490, comments: 88, shares: 58 },
];

const followersData = [
  { month: "Jan", followers: 1200 },
  { month: "Feb", followers: 1450 },
  { month: "Mar", followers: 1680 },
  { month: "Apr", followers: 2100 },
  { month: "May", followers: 2400 },
  { month: "Jun", followers: 2850 },
];

const topPosts = [
  { title: "Summer collection launch 🌊", engagement: "4.8K", rate: "8.2%" },
  { title: "Behind the scenes 🎬", engagement: "3.2K", rate: "6.5%" },
  { title: "Customer story spotlight ✨", engagement: "2.9K", rate: "5.8%" },
];

export default function Analytics() {
  return (
    <div>
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-2xl font-bold tracking-tight mb-6">
        Analytics
      </motion.h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: TrendingUp, label: "Total Engagement", value: "12.4K", change: "+18%" },
          { icon: Users, label: "Followers", value: "2,850", change: "+12%" },
          { icon: Star, label: "Avg. Engagement Rate", value: "5.4%", change: "+0.8%" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial="hidden" animate="visible" variants={fadeUp} custom={i + 1} className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-success">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="bg-card rounded-2xl p-6 shadow-card">
          <h3 className="font-semibold mb-4">Post Engagement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="likes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="hsl(var(--primary) / 0.5)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="bg-card rounded-2xl p-6 shadow-card">
          <h3 className="font-semibold mb-4">Followers Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={followersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Area type="monotone" dataKey="followers" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="font-semibold mb-4">Top Performing Posts</h3>
        <div className="space-y-3">
          {topPosts.map((post, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary">{i + 1}</span>
                <p className="text-sm font-medium">{post.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{post.engagement}</p>
                <p className="text-xs text-muted-foreground">{post.rate} rate</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
