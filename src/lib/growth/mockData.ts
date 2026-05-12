export type KpiDelta = { label: string; value: string; delta: number; hint?: string };

export const KPIS: KpiDelta[] = [
  { label: "Profile views", value: "12,847", delta: 12, hint: "Last 7 days" },
  { label: "Calls", value: "284", delta: 18, hint: "Tap-to-call" },
  { label: "Website clicks", value: "1,932", delta: 8 },
  { label: "Direction requests", value: "412", delta: -3 },
  { label: "Reviews", value: "4.7★ · 312", delta: 6, hint: "Avg rating" },
  { label: "Local SEO score", value: "78/100", delta: 4 },
];

export const VISIBILITY_SERIES = [
  { day: "Mon", value: 62 }, { day: "Tue", value: 64 }, { day: "Wed", value: 71 },
  { day: "Thu", value: 69 }, { day: "Fri", value: 76 }, { day: "Sat", value: 82 }, { day: "Sun", value: 78 },
];

export type MockCampaign = {
  id: string; name: string; status: "active" | "paused" | "draft";
  cpc: number; ctr: number; conversions: number; spend: number; ai_score: number;
};

export const CAMPAIGNS: MockCampaign[] = [
  { id: "c1", name: "Weekend Brunch Promo", status: "active", cpc: 0.92, ctr: 4.8, conversions: 47, spend: 142, ai_score: 88 },
  { id: "c2", name: "Local Discovery — Brand", status: "active", cpc: 0.41, ctr: 7.2, conversions: 112, spend: 220, ai_score: 92 },
  { id: "c3", name: "Diwali Festive Offer", status: "paused", cpc: 1.32, ctr: 3.1, conversions: 19, spend: 84, ai_score: 71 },
  { id: "c4", name: "Premium Tasting Night", status: "draft", cpc: 0, ctr: 0, conversions: 0, spend: 0, ai_score: 0 },
];

export const GA_TRAFFIC = [
  { day: "Mon", users: 1240, sessions: 1820 },
  { day: "Tue", users: 1320, sessions: 1910 },
  { day: "Wed", users: 1190, sessions: 1740 },
  { day: "Thu", users: 1410, sessions: 2010 },
  { day: "Fri", users: 1680, sessions: 2410 },
  { day: "Sat", users: 1920, sessions: 2820 },
  { day: "Sun", users: 1530, sessions: 2240 },
];

export const GA_TOP_PAGES = [
  { path: "/", views: 4820, bounce: 38 },
  { path: "/menu", views: 3120, bounce: 27 },
  { path: "/pricing", views: 1840, bounce: 61 },
  { path: "/contact", views: 920, bounce: 22 },
  { path: "/about", views: 612, bounce: 44 },
];

export const GA_SOURCES = [
  { name: "Organic Search", pct: 42 },
  { name: "Instagram", pct: 23 },
  { name: "Direct", pct: 17 },
  { name: "Google Maps", pct: 11 },
  { name: "Referral", pct: 7 },
];

export type MockReview = {
  id: string; author: string; rating: 1 | 2 | 3 | 4 | 5; text: string;
  date: string; sentiment: "positive" | "neutral" | "negative"; replied: boolean;
};

export const REVIEWS: MockReview[] = [
  { id: "r1", author: "Priya S.", rating: 5, text: "Loved the ambience and the pasta was unreal. Will be back!", date: "2d ago", sentiment: "positive", replied: false },
  { id: "r2", author: "Arjun K.", rating: 2, text: "Wait time was too long and the order came out wrong. Disappointed.", date: "3d ago", sentiment: "negative", replied: false },
  { id: "r3", author: "Maya R.", rating: 4, text: "Great food, slightly pricey but worth a visit.", date: "5d ago", sentiment: "positive", replied: true },
  { id: "r4", author: "Rohit V.", rating: 3, text: "Decent. Nothing extraordinary, nothing bad.", date: "1w ago", sentiment: "neutral", replied: false },
  { id: "r5", author: "Sneha P.", rating: 5, text: "Best brunch spot in the area, hands down.", date: "1w ago", sentiment: "positive", replied: true },
  { id: "r6", author: "Aman B.", rating: 1, text: "Hair in the food. Manager was rude. Never coming back.", date: "1w ago", sentiment: "negative", replied: false },
];

export const SEO_KEYWORDS = [
  { keyword: "best brunch near me", rank: 4, volume: "8.2k", trend: "up" },
  { keyword: "italian restaurant koramangala", rank: 2, volume: "3.1k", trend: "up" },
  { keyword: "rooftop dinner bangalore", rank: 14, volume: "5.6k", trend: "flat" },
  { keyword: "weekend lunch buffet", rank: 9, volume: "2.4k", trend: "down" },
];

export const CONNECT_SERVICES = [
  { id: "analytics", name: "Google Analytics", desc: "GA4 traffic, conversions, audiences" },
  { id: "ads", name: "Google Ads", desc: "Campaigns, keywords, performance" },
  { id: "gbp", name: "Google Business Profile", desc: "Posts, reviews, profile insights" },
  { id: "youtube", name: "YouTube", desc: "Channel analytics, video performance" },
  { id: "search_console", name: "Search Console", desc: "Search queries, indexing, CTR" },
];

export const BUSINESS_CONTEXT = {
  name: "Casa Verde",
  category: "Modern Italian restaurant",
  city: "Bangalore",
  audience: "Young professionals, couples, families",
  brand_voice: "Warm, witty, premium but approachable",
};

export const GROWTH_CONNECTED_KEY = "aistudiyo.growth.connected";

export function isGrowthConnected() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GROWTH_CONNECTED_KEY) === "1";
}

export function setGrowthConnected(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) localStorage.setItem(GROWTH_CONNECTED_KEY, "1");
  else localStorage.removeItem(GROWTH_CONNECTED_KEY);
}