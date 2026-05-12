import type { ElementType } from "react";
import {
  Megaphone, Instagram, Sparkles, Search, Camera, Linkedin, Bot, Briefcase,
} from "lucide-react";

export type Track = {
  id: string;
  title: string;
  blurb: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  icon: ElementType;
  gradient: string; // tailwind from-x to-y
  accent: string;   // hsl color string for chips/rings
  courseIds: string[];
};

export const TRACKS: Track[] = [
  { id: "ai-advertising",  title: "AI Advertising",       blurb: "Run smarter, cheaper, sharper paid ads with AI.",        lessons: 24, level: "Intermediate", icon: Megaphone,  gradient: "from-orange-500 to-pink-500",  accent: "hsl(22 100% 55%)",  courseIds: ["ai-ads-fundamentals", "ai-campaign-strategy", "google-ads-mastery"] },
  { id: "social-growth",   title: "Social Media Growth",  blurb: "Turn followers into a movement, week after week.",       lessons: 30, level: "Beginner",     icon: Instagram,  gradient: "from-pink-500 to-fuchsia-500", accent: "hsl(330 80% 60%)",  courseIds: ["reels-growth-blueprint", "viral-hook-psychology"] },
  { id: "content-creation",title: "AI Content Creation",  blurb: "Ship a week of content in 30 minutes — without burnout.", lessons: 22, level: "Beginner",     icon: Sparkles,   gradient: "from-violet-500 to-indigo-500",accent: "hsl(258 85% 65%)",  courseIds: ["ai-content-engine", "viral-hook-psychology"] },
  { id: "google-ads",      title: "Google Ads Mastery",   blurb: "From keyword to conversion. The full machine.",          lessons: 28, level: "Advanced",     icon: Search,     gradient: "from-sky-500 to-blue-600",     accent: "hsl(212 90% 55%)",  courseIds: ["google-ads-mastery", "google-business-growth"] },
  { id: "instagram",       title: "Instagram Growth",     blurb: "Reels, hooks, hashtags — the modern IG playbook.",       lessons: 18, level: "Beginner",     icon: Camera,     gradient: "from-rose-500 to-orange-500",  accent: "hsl(12 90% 60%)",   courseIds: ["reels-growth-blueprint"] },
  { id: "linkedin",        title: "LinkedIn Branding",    blurb: "Authority posts that build a real audience.",            lessons: 16, level: "Intermediate", icon: Linkedin,   gradient: "from-blue-500 to-cyan-500",    accent: "hsl(200 90% 55%)",  courseIds: ["creator-monetization"] },
  { id: "automation",      title: "AI Automation",        blurb: "Set workflows that publish, reply, and grow for you.",   lessons: 20, level: "Advanced",     icon: Bot,        gradient: "from-emerald-500 to-teal-500", accent: "hsl(160 70% 45%)",  courseIds: ["ai-campaign-strategy", "ai-content-engine"] },
  { id: "creator-business",title: "Creator Business",     blurb: "Monetize, package, and scale your creator brand.",       lessons: 14, level: "Intermediate", icon: Briefcase,  gradient: "from-amber-500 to-orange-500", accent: "hsl(38 95% 55%)",   courseIds: ["creator-monetization"] },
];

export function getTrack(id: string) { return TRACKS.find((t) => t.id === id); }