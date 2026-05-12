export type Mission = {
  id: string;
  title: string;
  blurb: string;
  xp: number;
  progress: number; // 0..1 default state
  emoji: string;
  cta: string;
  to: string;
};

export const MISSIONS: Mission[] = [
  { id: "m1", title: "Create your first AI campaign",  blurb: "Use Generator to ship a 7-day plan.",     xp: 120, progress: 0.0, emoji: "🚀", cta: "Start",     to: "/dashboard/generator" },
  { id: "m2", title: "Generate 10 viral hooks",        blurb: "Open Hook Lab and stack the wins.",       xp: 80,  progress: 0.4, emoji: "🎣", cta: "Continue",  to: "/dashboard/generator" },
  { id: "m3", title: "Publish your first content pack",blurb: "Caption + image + CTA — all in one flow.", xp: 100, progress: 0.2, emoji: "📦", cta: "Continue",  to: "/dashboard/image-studio" },
  { id: "m4", title: "Optimize your Google profile",   blurb: "Run the Growth audit and apply 3 fixes.",  xp: 150, progress: 0.0, emoji: "📍", cta: "Open",      to: "/dashboard/growth" },
  { id: "m5", title: "Score 90+ in Practice Lab",      blurb: "Polish an ad until the AI rates it gold.", xp: 200, progress: 0.0, emoji: "🥇", cta: "Try lab",   to: "/dashboard/academy/practice-lab" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Maya R.",  xp: 9840, emoji: "🥇" },
  { rank: 2, name: "Devon K.", xp: 8210, emoji: "🥈" },
  { rank: 3, name: "Aisha P.", xp: 7650, emoji: "🥉" },
  { rank: 4, name: "Leo S.",   xp: 6120, emoji: "✨" },
  { rank: 5, name: "Noor T.",  xp: 5440, emoji: "✨" },
];