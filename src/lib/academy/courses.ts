export type Lesson = { id: string; title: string; minutes: number; type: "video" | "reading" | "lab" | "quiz" };

export type Course = {
  id: string;
  title: string;
  tagline: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMin: number;
  rating: number;        // 0-5
  ratingCount: number;
  certBadge?: string;    // certificate id awarded
  thumbGradient: string; // tailwind
  emoji: string;
  lessons: Lesson[];
};

const L = (id: string, title: string, minutes: number, type: Lesson["type"] = "video"): Lesson => ({ id, title, minutes, type });

export const COURSES: Course[] = [
  {
    id: "ai-ads-fundamentals",
    title: "AI Ads Fundamentals",
    tagline: "The new rules of running ads with AI co-pilots.",
    difficulty: "Beginner",
    durationMin: 64,
    rating: 4.8,
    ratingCount: 1284,
    certBadge: "growth-marketer",
    thumbGradient: "from-orange-500 via-pink-500 to-violet-500",
    emoji: "🚀",
    lessons: [
      L("l1", "Why AI changed advertising forever", 6),
      L("l2", "Audiences, intent, and signals", 9),
      L("l3", "Writing ad copy with AI", 11),
      L("l4", "Setting your first AI campaign", 14, "lab"),
      L("l5", "Reading the dashboard like a pro", 12),
      L("l6", "Quiz: AI Ads Fundamentals", 12, "quiz"),
    ],
  },
  {
    id: "viral-hook-psychology",
    title: "Viral Hook Psychology",
    tagline: "What makes a thumb stop and a brain lean in.",
    difficulty: "Intermediate",
    durationMin: 48,
    rating: 4.9,
    ratingCount: 2310,
    certBadge: "social-media-strategist",
    thumbGradient: "from-fuchsia-500 via-violet-500 to-indigo-600",
    emoji: "🎣",
    lessons: [
      L("l1", "The 3-second rule", 5),
      L("l2", "Curiosity vs. confusion", 8),
      L("l3", "Hook frameworks that always work", 10),
      L("l4", "Lab: write 10 hooks in 10 minutes", 15, "lab"),
      L("l5", "Quiz: Hook Psychology", 10, "quiz"),
    ],
  },
  {
    id: "reels-growth-blueprint",
    title: "Reels Growth Blueprint",
    tagline: "Posting daily without going insane.",
    difficulty: "Beginner",
    durationMin: 72,
    rating: 4.7,
    ratingCount: 1820,
    certBadge: "social-media-strategist",
    thumbGradient: "from-rose-500 via-pink-500 to-orange-500",
    emoji: "🎬",
    lessons: [
      L("l1", "The reel formula", 8),
      L("l2", "Editing for retention", 12),
      L("l3", "Captions that convert", 10),
      L("l4", "30-day reels challenge", 12, "lab"),
      L("l5", "Quiz: Reels Growth", 10, "quiz"),
    ],
  },
  {
    id: "google-business-growth",
    title: "Google Business Growth",
    tagline: "Win the map. Win the city.",
    difficulty: "Intermediate",
    durationMin: 56,
    rating: 4.6,
    ratingCount: 920,
    certBadge: "growth-marketer",
    thumbGradient: "from-sky-500 via-blue-500 to-indigo-600",
    emoji: "📍",
    lessons: [
      L("l1", "Local SEO in 2026", 9),
      L("l2", "Your Business Profile, optimized", 12),
      L("l3", "Reviews that print revenue", 10),
      L("l4", "Posts, photos, and offers", 11),
      L("l5", "Quiz: GBP Mastery", 10, "quiz"),
    ],
  },
  {
    id: "ai-content-engine",
    title: "AI Content Engine",
    tagline: "A week of content, generated in 30 minutes.",
    difficulty: "Intermediate",
    durationMin: 80,
    rating: 4.9,
    ratingCount: 3210,
    certBadge: "ai-ads-specialist",
    thumbGradient: "from-violet-600 via-indigo-500 to-blue-500",
    emoji: "🧠",
    lessons: [
      L("l1", "Designing your content stack", 10),
      L("l2", "Captions, hooks, CTAs in one flow", 14),
      L("l3", "Carousel automation", 12),
      L("l4", "Image studio mastery", 14),
      L("l5", "Lab: ship a week in 30 minutes", 18, "lab"),
      L("l6", "Quiz: Content Engine", 12, "quiz"),
    ],
  },
  {
    id: "creator-monetization",
    title: "Creator Monetization",
    tagline: "Turn attention into income, without burning out.",
    difficulty: "Advanced",
    durationMin: 90,
    rating: 4.7,
    ratingCount: 1450,
    certBadge: "ai-ads-specialist",
    thumbGradient: "from-amber-500 via-orange-500 to-rose-500",
    emoji: "💸",
    lessons: [
      L("l1", "Offer design for creators", 12),
      L("l2", "Lead magnets that convert", 14),
      L("l3", "Pricing your product", 10),
      L("l4", "Sales without sleaze", 14),
      L("l5", "Lab: 7-day launch", 18, "lab"),
      L("l6", "Quiz: Monetization", 12, "quiz"),
    ],
  },
  {
    id: "ai-campaign-strategy",
    title: "AI Campaign Strategy",
    tagline: "Plan, generate, and ship a full campaign with AI.",
    difficulty: "Advanced",
    durationMin: 75,
    rating: 4.8,
    ratingCount: 980,
    certBadge: "ai-ads-specialist",
    thumbGradient: "from-emerald-500 via-teal-500 to-cyan-500",
    emoji: "🎯",
    lessons: [
      L("l1", "Campaign anatomy", 9),
      L("l2", "Audience graphs", 11),
      L("l3", "Multi-channel orchestration", 14),
      L("l4", "Lab: ship a launch in a day", 18, "lab"),
      L("l5", "Quiz: Campaign Strategy", 12, "quiz"),
    ],
  },
  {
    id: "google-ads-mastery",
    title: "Google Ads Mastery",
    tagline: "Keywords. Bids. Conversions. Compound them.",
    difficulty: "Advanced",
    durationMin: 110,
    rating: 4.6,
    ratingCount: 1120,
    certBadge: "ai-ads-specialist",
    thumbGradient: "from-blue-600 via-indigo-600 to-violet-600",
    emoji: "🔍",
    lessons: [
      L("l1", "Search intent decoded", 10),
      L("l2", "Keyword research with AI", 14),
      L("l3", "Building killer ad groups", 13),
      L("l4", "Bidding and budgets", 14),
      L("l5", "Lab: build a real campaign", 20, "lab"),
      L("l6", "Quiz: Google Ads Mastery", 14, "quiz"),
    ],
  },
];

export function getCourse(id: string) { return COURSES.find((c) => c.id === id); }