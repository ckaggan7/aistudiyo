export type ThemePreset = {
  id: string;
  name: string;
  swatch: string; // gradient for the picker chip
  vars: Record<string, string>;
};

/**
 * Each theme overrides only chroma tokens — backgrounds, foregrounds and
 * text colors stay untouched so readability is preserved across themes.
 */
export const THEMES: ThemePreset[] = [
  {
    id: "orange-blaze",
    name: "Orange Blaze",
    swatch: "linear-gradient(135deg, hsl(22 95% 55%), hsl(280 80% 58%))",
    vars: {
      "--primary": "22 95% 55%",
      "--primary-glow": "30 100% 65%",
      "--accent": "270 80% 60%",
      "--ring": "22 95% 55%",
      "--sidebar-primary": "22 95% 55%",
      "--sidebar-ring": "22 95% 55%",
      "--gradient-hero": "linear-gradient(135deg, hsl(22 95% 55%), hsl(280 80% 58%))",
      "--gradient-accent": "linear-gradient(135deg, hsl(30 100% 65%), hsl(280 80% 60%))",
      "--shadow-glow": "0 0 50px -10px hsl(22 95% 55% / 0.4)",
      "--edge-gradient": "radial-gradient(60% 80% at 0% 0%, hsl(22 95% 55% / 0.10), transparent 60%), radial-gradient(50% 70% at 100% 100%, hsl(280 80% 58% / 0.10), transparent 60%)",
    },
  },
  {
    id: "neon-purple",
    name: "Neon Purple",
    swatch: "linear-gradient(135deg, hsl(280 90% 60%), hsl(200 95% 60%))",
    vars: {
      "--primary": "280 90% 62%",
      "--primary-glow": "295 100% 72%",
      "--accent": "200 95% 60%",
      "--ring": "280 90% 62%",
      "--sidebar-primary": "280 90% 62%",
      "--sidebar-ring": "280 90% 62%",
      "--gradient-hero": "linear-gradient(135deg, hsl(280 90% 62%), hsl(200 95% 60%))",
      "--gradient-accent": "linear-gradient(135deg, hsl(295 100% 72%), hsl(200 95% 60%))",
      "--shadow-glow": "0 0 50px -10px hsl(280 90% 62% / 0.45)",
      "--edge-gradient": "radial-gradient(60% 80% at 0% 0%, hsl(280 90% 62% / 0.12), transparent 60%), radial-gradient(50% 70% at 100% 100%, hsl(200 95% 60% / 0.10), transparent 60%)",
    },
  },
  {
    id: "cyber-blue",
    name: "Cyber Blue",
    swatch: "linear-gradient(135deg, hsl(212 95% 58%), hsl(180 90% 55%))",
    vars: {
      "--primary": "212 95% 58%",
      "--primary-glow": "190 95% 65%",
      "--accent": "180 90% 55%",
      "--ring": "212 95% 58%",
      "--sidebar-primary": "212 95% 58%",
      "--sidebar-ring": "212 95% 58%",
      "--gradient-hero": "linear-gradient(135deg, hsl(212 95% 58%), hsl(180 90% 55%))",
      "--gradient-accent": "linear-gradient(135deg, hsl(190 95% 65%), hsl(212 95% 58%))",
      "--shadow-glow": "0 0 50px -10px hsl(212 95% 58% / 0.45)",
      "--edge-gradient": "radial-gradient(60% 80% at 0% 0%, hsl(212 95% 58% / 0.12), transparent 60%), radial-gradient(50% 70% at 100% 100%, hsl(180 90% 55% / 0.10), transparent 60%)",
    },
  },
  {
    id: "emerald-flow",
    name: "Emerald Flow",
    swatch: "linear-gradient(135deg, hsl(160 80% 45%), hsl(180 80% 50%))",
    vars: {
      "--primary": "160 80% 45%",
      "--primary-glow": "150 80% 55%",
      "--accent": "180 80% 50%",
      "--ring": "160 80% 45%",
      "--sidebar-primary": "160 80% 45%",
      "--sidebar-ring": "160 80% 45%",
      "--gradient-hero": "linear-gradient(135deg, hsl(160 80% 45%), hsl(180 80% 50%))",
      "--gradient-accent": "linear-gradient(135deg, hsl(150 80% 55%), hsl(180 80% 50%))",
      "--shadow-glow": "0 0 50px -10px hsl(160 80% 45% / 0.4)",
      "--edge-gradient": "radial-gradient(60% 80% at 0% 0%, hsl(160 80% 45% / 0.12), transparent 60%), radial-gradient(50% 70% at 100% 100%, hsl(180 80% 50% / 0.10), transparent 60%)",
    },
  },
  {
    id: "crimson-red",
    name: "Crimson Red",
    swatch: "linear-gradient(135deg, hsl(0 85% 58%), hsl(340 85% 58%))",
    vars: {
      "--primary": "0 85% 58%",
      "--primary-glow": "10 90% 65%",
      "--accent": "340 85% 58%",
      "--ring": "0 85% 58%",
      "--sidebar-primary": "0 85% 58%",
      "--sidebar-ring": "0 85% 58%",
      "--gradient-hero": "linear-gradient(135deg, hsl(0 85% 58%), hsl(340 85% 58%))",
      "--gradient-accent": "linear-gradient(135deg, hsl(10 90% 65%), hsl(340 85% 58%))",
      "--shadow-glow": "0 0 50px -10px hsl(0 85% 58% / 0.45)",
      "--edge-gradient": "radial-gradient(60% 80% at 0% 0%, hsl(0 85% 58% / 0.12), transparent 60%), radial-gradient(50% 70% at 100% 100%, hsl(340 85% 58% / 0.10), transparent 60%)",
    },
  },
  {
    id: "sunset-gold",
    name: "Sunset Gold",
    swatch: "linear-gradient(135deg, hsl(42 95% 55%), hsl(15 90% 58%))",
    vars: {
      "--primary": "42 95% 55%",
      "--primary-glow": "32 100% 62%",
      "--accent": "15 90% 58%",
      "--ring": "42 95% 55%",
      "--sidebar-primary": "42 95% 55%",
      "--sidebar-ring": "42 95% 55%",
      "--gradient-hero": "linear-gradient(135deg, hsl(42 95% 55%), hsl(15 90% 58%))",
      "--gradient-accent": "linear-gradient(135deg, hsl(32 100% 62%), hsl(15 90% 58%))",
      "--shadow-glow": "0 0 50px -10px hsl(42 95% 55% / 0.45)",
      "--edge-gradient": "radial-gradient(60% 80% at 0% 0%, hsl(42 95% 55% / 0.12), transparent 60%), radial-gradient(50% 70% at 100% 100%, hsl(15 90% 58% / 0.10), transparent 60%)",
    },
  },
  {
    id: "frost-white",
    name: "Frost White",
    swatch: "linear-gradient(135deg, hsl(210 30% 90%), hsl(220 40% 70%))",
    vars: {
      "--primary": "220 35% 55%",
      "--primary-glow": "210 50% 75%",
      "--accent": "220 30% 65%",
      "--ring": "220 35% 55%",
      "--sidebar-primary": "220 35% 55%",
      "--sidebar-ring": "220 35% 55%",
      "--gradient-hero": "linear-gradient(135deg, hsl(220 35% 55%), hsl(210 50% 75%))",
      "--gradient-accent": "linear-gradient(135deg, hsl(210 50% 75%), hsl(220 30% 65%))",
      "--shadow-glow": "0 0 50px -10px hsl(220 35% 55% / 0.35)",
      "--edge-gradient": "radial-gradient(60% 80% at 0% 0%, hsl(220 35% 55% / 0.10), transparent 60%), radial-gradient(50% 70% at 100% 100%, hsl(210 50% 75% / 0.10), transparent 60%)",
    },
  },
  {
    id: "midnight-graphite",
    name: "Midnight Graphite",
    swatch: "linear-gradient(135deg, hsl(220 15% 35%), hsl(240 20% 55%))",
    vars: {
      "--primary": "220 20% 45%",
      "--primary-glow": "230 25% 60%",
      "--accent": "240 20% 55%",
      "--ring": "220 20% 45%",
      "--sidebar-primary": "220 20% 45%",
      "--sidebar-ring": "220 20% 45%",
      "--gradient-hero": "linear-gradient(135deg, hsl(220 20% 45%), hsl(240 20% 55%))",
      "--gradient-accent": "linear-gradient(135deg, hsl(230 25% 60%), hsl(240 20% 55%))",
      "--shadow-glow": "0 0 50px -10px hsl(220 20% 45% / 0.4)",
      "--edge-gradient": "radial-gradient(60% 80% at 0% 0%, hsl(220 20% 45% / 0.14), transparent 60%), radial-gradient(50% 70% at 100% 100%, hsl(240 20% 55% / 0.10), transparent 60%)",
    },
  },
];

export const DEFAULT_THEME_ID = "orange-blaze";
export const THEME_STORAGE_KEY = "aistudiyo.theme";
