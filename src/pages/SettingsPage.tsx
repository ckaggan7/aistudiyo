import { motion } from "framer-motion";
import { User, Bell, Palette, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
  const { balance } = useWallet();
  return (
    <div className="max-w-2xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold tracking-tight mb-6">
        Settings
      </motion.h1>

      <div className="space-y-6">
        {/* Credits */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold">Credits & Usage</h3>
                <p className="text-xs text-muted-foreground">Balance: <span className="font-semibold text-foreground tabular-nums">{balance}</span> credits</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard/credits" className="gap-1.5">Manage <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </motion.div>

        {/* Profile */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input defaultValue="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input defaultValue="john@example.com" />
            </div>
            <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90">Save Changes</Button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {["Email notifications", "Push notifications", "Weekly digest"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <Switch />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
            <Switch onCheckedChange={(checked) => {
              document.documentElement.classList.toggle("dark", checked);
            }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
