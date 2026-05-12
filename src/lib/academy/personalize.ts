import type { Course } from "./courses";

export type CreatorProfile = {
  niche?: string;
  business_type?: string;
  skill_level?: "beginner" | "growth" | "advanced";
  goals?: string[];
};

const ORDER: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export function rankCourses(courses: Course[], profile: CreatorProfile | null): Course[] {
  if (!profile?.skill_level) return courses;
  const target = profile.skill_level === "beginner" ? 0 : profile.skill_level === "growth" ? 1 : 2;
  return [...courses].sort((a, b) => Math.abs(ORDER[a.difficulty] - target) - Math.abs(ORDER[b.difficulty] - target));
}
