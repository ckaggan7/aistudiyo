export type Certificate = {
  id: string;
  name: string;
  tagline: string;
  xpRequired: number;
  color: string;
  emoji: string;
};

export const CERTIFICATES: Certificate[] = [
  { id: "beginner-creator",        name: "Beginner Creator",        tagline: "You shipped your first content pack.",        xpRequired: 200,   color: "from-emerald-500 to-teal-500",   emoji: "🌱" },
  { id: "growth-marketer",         name: "Growth Marketer",         tagline: "You can run a campaign without breaking it.", xpRequired: 600,   color: "from-sky-500 to-blue-600",       emoji: "📈" },
  { id: "ai-campaign-expert",      name: "AI Campaign Expert",      tagline: "AI does the heavy lifting, you steer.",       xpRequired: 1200,  color: "from-violet-500 to-fuchsia-500", emoji: "🎯" },
  { id: "social-media-strategist", name: "Social Media Strategist", tagline: "Your feed has a system. And it works.",       xpRequired: 2000,  color: "from-rose-500 to-orange-500",    emoji: "📡" },
  { id: "ai-ads-specialist",       name: "AI Ads Specialist",       tagline: "You build the engine. AI scales it.",         xpRequired: 3500,  color: "from-amber-500 to-pink-500",     emoji: "🏆" },
];

export function getCertificate(id: string) { return CERTIFICATES.find((c) => c.id === id); }