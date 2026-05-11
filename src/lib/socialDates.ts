/** Trending social media dates engine — curated marketing/creator events. */
export type SocialDate = {
  date: string;       // ISO "YYYY-MM-DD"
  title: string;
  emoji: string;
  category: "holiday" | "trend" | "awareness" | "creator" | "marketing";
  blurb: string;      // one-liner for AI to ground content
};

// Note: month is 0-indexed in JS; we use ISO strings for stability.
export const SOCIAL_DATES: SocialDate[] = [
  { date: "2026-01-01", title: "New Year",            emoji: "🎉", category: "holiday",   blurb: "Fresh-start content — goals, recap reels, manifestos." },
  { date: "2026-02-14", title: "Valentine's Day",     emoji: "💌", category: "holiday",   blurb: "Brand-love stories, customer shout-outs, gift guides." },
  { date: "2026-03-08", title: "Women's Day",         emoji: "✨", category: "awareness", blurb: "Spotlight women in your community, founder stories." },
  { date: "2026-03-15", title: "World Consumer Day",  emoji: "🛍️", category: "marketing", blurb: "Transparency posts, product origin stories." },
  { date: "2026-04-01", title: "April Fool's",        emoji: "🤡", category: "trend",     blurb: "Playful fake-launch reels — lean into your brand humour." },
  { date: "2026-04-22", title: "Earth Day",           emoji: "🌍", category: "awareness", blurb: "Sustainability, behind-the-scenes of green practice." },
  { date: "2026-05-04", title: "Star Wars Day",       emoji: "🚀", category: "trend",     blurb: "May the 4th — pop-culture meme tie-ins." },
  { date: "2026-05-10", title: "Mother's Day",        emoji: "🌸", category: "holiday",   blurb: "Founder stories, customer gifting carousels." },
  { date: "2026-06-21", title: "Father's Day",        emoji: "👔", category: "holiday",   blurb: "Lifestyle photo posts, gift ideas." },
  { date: "2026-07-30", title: "Friendship Day",      emoji: "🤝", category: "trend",     blurb: "Tag-a-friend reels, founding-team throwbacks." },
  { date: "2026-08-15", title: "Independence Day (IN)",emoji: "🇮🇳", category: "holiday",  blurb: "Patriotic palette posts — keep it authentic." },
  { date: "2026-08-19", title: "World Photography Day",emoji: "📸", category: "creator",  blurb: "Behind-the-camera content, gear, your process." },
  { date: "2026-10-31", title: "Halloween",           emoji: "🎃", category: "trend",     blurb: "Costume reels, spooky brand twists." },
  { date: "2026-11-11", title: "Singles' Day",        emoji: "🛒", category: "marketing", blurb: "Launch-day energy — countdowns, drops, deals." },
  { date: "2026-11-29", title: "Black Friday",        emoji: "🛍️", category: "marketing", blurb: "Stacked carousels, before/after, urgency hooks." },
  { date: "2026-12-25", title: "Christmas",           emoji: "🎄", category: "holiday",   blurb: "Year-in-review reels, gifting guides." },
  // Creator + AI specific
  { date: "2026-07-16", title: "AI Appreciation Day", emoji: "🤖", category: "creator",   blurb: "Show your AI stack, prompt tips, workflows." },
  { date: "2026-09-05", title: "Creator Day",         emoji: "🎬", category: "creator",   blurb: "BTS of your studio, gear, daily rhythm." },
];

export function socialDatesInMonth(year: number, month0: number): SocialDate[] {
  const ym = `${year}-${String(month0 + 1).padStart(2, "0")}`;
  return SOCIAL_DATES.filter((d) => d.date.startsWith(ym));
}

export function nextSocialDates(limit = 6, from = new Date()): SocialDate[] {
  const today = from.toISOString().slice(0, 10);
  return SOCIAL_DATES
    .filter((d) => d.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function getSocialDate(iso: string): SocialDate | undefined {
  return SOCIAL_DATES.find((d) => d.date === iso);
}
