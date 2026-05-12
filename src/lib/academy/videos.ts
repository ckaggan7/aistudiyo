export type AcademyVideo = { id: string; title: string; creator: string; duration: string; gradient: string; emoji: string; tag: string };
export const VIDEOS: AcademyVideo[] = [
  { id: "v1", title: "The 3-second hook formula",    creator: "Maya R.",  duration: "2:14", gradient: "from-orange-500 to-pink-500",  emoji: "🎣", tag: "Hooks" },
  { id: "v2", title: "How I 10x'd my reach with AI", creator: "Devon K.", duration: "4:32", gradient: "from-violet-500 to-indigo-600",emoji: "🚀", tag: "Case study" },
  { id: "v3", title: "Reading your ad dashboard",    creator: "Aisha P.", duration: "3:18", gradient: "from-sky-500 to-blue-600",     emoji: "📊", tag: "Analytics" },
  { id: "v4", title: "Repurpose 1 post into 7",      creator: "Leo S.",   duration: "5:01", gradient: "from-emerald-500 to-teal-500", emoji: "♻️", tag: "Workflow" },
  { id: "v5", title: "Local SEO in 60 seconds",      creator: "Noor T.",  duration: "1:08", gradient: "from-amber-500 to-orange-500", emoji: "📍", tag: "Local" },
  { id: "v6", title: "Caption psychology, decoded",  creator: "Maya R.",  duration: "3:55", gradient: "from-rose-500 to-fuchsia-500", emoji: "🧠", tag: "Copy" },
];
