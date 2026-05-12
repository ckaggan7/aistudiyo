import { supabase } from "@/integrations/supabase/client";

export type LabScore = {
  hook_quality: number; ctr_potential: number; readability: number; engagement: number; platform_fit: number; overall: number;
  suggestions: string[]; rewrite: string;
};

export async function scoreAd(prompt: string, context: { platform: string; objective: string }) {
  const { data, error } = await supabase.functions.invoke("academy-ai", { body: { action: "lab_score", prompt, context } });
  if (error) throw error;
  return data?.result as LabScore;
}

export type MentorReply = {
  message: string;
  examples: string[];
  exercises: { title: string; prompt: string; difficulty: "easy" | "medium" | "hard" }[];
  next_actions: string[];
};

export async function askMentor(prompt: string, context?: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("academy-ai", { body: { action: "mentor_chat", prompt, context } });
  if (error) throw error;
  return data?.result as MentorReply;
}
