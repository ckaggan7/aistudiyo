import { supabase } from "@/integrations/supabase/client";
import { BUSINESS_CONTEXT } from "./mockData";

export type GrowthAction =
  | "insights"
  | "ads_campaign"
  | "analytics_summary"
  | "post_generator"
  | "review_reply"
  | "seo_recommendations"
  | "agent_chat";

export interface InsightItem {
  title: string;
  body: string;
  severity: "positive" | "neutral" | "warning" | "critical";
  action: string;
}

export interface AdsCampaignResult {
  campaign_name: string;
  objective: string;
  audience: string;
  daily_budget_usd: number;
  headlines: string[];
  descriptions: string[];
  ctas: string[];
  keywords: string[];
  ad_groups: string[];
  predicted_ctr: number;
  predicted_cpc_usd: number;
  ai_score: number;
  rationale: string;
}

export interface AnalyticsSummaryResult {
  summary: string;
  wins: string[];
  drop_offs: string[];
  actions: string[];
}

export interface PostGeneratorResult {
  title: string;
  body: string;
  cta_label: string;
  hashtags: string[];
  image_prompt: string;
  keywords: string[];
}

export interface ReviewReplyResult {
  sentiment: "positive" | "neutral" | "negative";
  replies: { tone: "warm" | "professional" | "apologetic"; text: string }[];
  escalate: boolean;
  improvement_note: string;
}

export interface SeoRecommendationsResult {
  visibility_score: number;
  keywords: { keyword: string; opportunity: "low" | "medium" | "high"; rationale: string }[];
  actions: string[];
  competitor_gaps: string[];
}

export interface AgentChatResult {
  message: string;
  next_actions: string[];
}

type ResultMap = {
  insights: { insights: InsightItem[] };
  ads_campaign: AdsCampaignResult;
  analytics_summary: AnalyticsSummaryResult;
  post_generator: PostGeneratorResult;
  review_reply: ReviewReplyResult;
  seo_recommendations: SeoRecommendationsResult;
  agent_chat: AgentChatResult;
};

export async function callGrowthAi<K extends GrowthAction>(
  action: K,
  prompt: string,
  context: Record<string, unknown> = {},
): Promise<ResultMap[K]> {
  const { data, error } = await supabase.functions.invoke("growth-ai", {
    body: { action, prompt, context: { business: BUSINESS_CONTEXT, ...context } },
  });
  if (error) throw new Error(error.message);
  const payload = data as { result?: ResultMap[K]; error?: string };
  if (payload.error) throw new Error(payload.error);
  if (!payload.result) throw new Error("Empty response from Growth AI");
  return payload.result;
}