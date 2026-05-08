import { motion } from "framer-motion";
import { User, Bell, Palette, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold tracking-tight mb-6">
        Settings
      </motion.h1>

      <div className="space-y-6">
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
