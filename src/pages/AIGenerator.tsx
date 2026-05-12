import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BrandVoiceBar, { BrandVoice } from "@/components/generator/BrandVoiceBar";
import ScorePanel from "@/components/generator/ScorePanel";
import HookCard from "@/components/generator/HookCard";
import TextCard from "@/components/generator/TextCard";
import CtaCard from "@/components/generator/CtaCard";
import HashtagCard from "@/components/generator/HashtagCard";
import CarouselCard from "@/components/generator/CarouselCard";
import VisualPromptCard from "@/components/generator/VisualPromptCard";
import RepurposeCard from "@/components/generator/RepurposeCard";
import PostingCard from "@/components/generator/PostingCard";

type Pack = {
  hooks: string[];
  caption: string;
  cta_options: string[];
  hashtags: { broad: string[]; niche: string[]; branded: string[] };
  carousel: { title: string; slides: { headline: string; body: string }[] };
  visual_prompt: string;
  repurpose: { twitter_thread: string[]; reel_script: string };
  posting: { best_time_local: string; rationale: string };
  scores: { hook: number; readability: number; platform_fit: number; virality: number };
  notes: string;
};

type BlockKey = "hooks" | "caption" | "cta_options" | "hashtags" | "carousel" | "visual_prompt" | "repurpose";

export default function AIGenerator() {
  const [searchParams] = useSearchParams();
  const [platform, setPlatform] = useState(searchParams.get("platform") || "instagram");
  const [contentType, setContentType] = useState(searchParams.get("contentType") || "post");
  const [tone, setTone] = useState("casual");
  const [language, setLanguage] = useState("native");
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [loading, setLoading] = useState(false);
  const [pack, setPack] = useState<Pack | null>(null);
  const [brand, setBrand] = useState<BrandVoice | null>(null);
  const [regenBlock, setRegenBlock] = useState<BlockKey | null>(null);

  useEffect(() => {
    supabase
      .from("brand_profile")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .then(({ data }) => setBrand((data?.[0] as BrandVoice) ?? null));
  }, []);

  useEffect(() => {
    const t = searchParams.get("topic");
    const p = searchParams.get("platform");
    const c = searchParams.get("contentType");
    if (t) setTopic(t);
    if (p) setPlatform(p);
    if (c) setContentType(c);
  }, [searchParams]);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("What's the topic?");
      return;
    }
    setLoading(true);
    setPack(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          platform, contentType, brand: brand?.name, audience: brand?.audience,
          tone, topic, language,
          voice: brand?.voice, style_prompt: brand?.style_prompt,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.pack) throw new Error("Invalid response");
      setPack(data.pack as Pack);
      toast.success("Content pack ready");
    } catch (e: unknown) {
      console.error(e);
      toast.error((e as Error).message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async (block: BlockKey) => {
    if (!pack) return;
    setRegenBlock(block);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          platform, contentType, tone, topic, language,
          brand: brand?.name, audience: brand?.audience,
          voice: brand?.voice, style_prompt: brand?.style_prompt,
          regenerate_block: block, context: pack,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPack((prev) => prev ? ({ ...prev, [block]: data.value }) : prev);
      toast.success(`${block.replace("_", " ")} refreshed`);
    } catch (e: unknown) {
      toast.error((e as Error).message || "Could not regenerate");
    } finally {
      setRegenBlock(null);
    }
  };

  const savePack = async () => {
    if (!pack) return;
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes?.user?.id;
    if (!uid) { toast.error("Sign in to save"); return; }
    const { error } = await supabase.from("content_packs").insert({
      user_id: uid, prompt: topic, platform, content_type: contentType,
      pack_json: pack, scores_json: pack.scores,
    });
    if (error) toast.error("Save failed");
    else toast.success("Saved to library");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Content Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">One prompt → full content pack.</p>
        </div>
      </motion.div>

      <BrandVoiceBar profile={brand} onChange={setBrand} />

      {/* Compact prompt bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border/40 p-4 md:p-5 mb-6"
      >
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">X / Twitter</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Type</label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="reel">Reel / Short</SelectItem>
                <SelectItem value="ad">Ad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="funny">Funny</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Topic</label>
          <Textarea
            placeholder='e.g. "Why bootstrapped startups are eating VC-backed ones"'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={generate} disabled={loading} className="bg-gradient-hero text-primary-foreground shadow-glow">
            {loading
              ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Generating pack…</span>
              : <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate pack</span>}
          </Button>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="native">Auto-detect</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="te">తెలుగు · Telugu</SelectItem>
              <SelectItem value="hi">हिन्दी · Hindi</SelectItem>
              <SelectItem value="ta">தமிழ் · Tamil</SelectItem>
              <SelectItem value="kn">ಕನ್ನಡ · Kannada</SelectItem>
              <SelectItem value="ml">മലയാളം · Malayalam</SelectItem>
              <SelectItem value="mr">मराठी · Marathi</SelectItem>
              <SelectItem value="bn">বাংলা · Bengali</SelectItem>
              <SelectItem value="gu">ગુજરાતી · Gujarati</SelectItem>
              <SelectItem value="pa">ਪੰਜਾਬੀ · Punjabi</SelectItem>
              <SelectItem value="ur">اردو · Urdu</SelectItem>
              <SelectItem value="te-en">Tenglish</SelectItem>
              <SelectItem value="hi-en">Hinglish</SelectItem>
            </SelectContent>
          </Select>
          {pack && (
            <Button onClick={savePack} variant="outline" size="sm" className="ml-auto">
              <BookmarkPlus className="w-3.5 h-3.5" /> Save pack
            </Button>
          )}
        </div>
      </motion.div>

      {/* Results */}
      {loading && !pack && (
        <div className="bg-card rounded-2xl border border-border/40 p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Composing your content pack…</p>
        </div>
      )}

      {pack && (
        <div className="space-y-3 md:space-y-4">
          <ScorePanel scores={pack.scores} />
          <HookCard hooks={pack.hooks} onRegenerate={() => regenerate("hooks")} regenerating={regenBlock === "hooks"} />
          <TextCard
            title="Caption"
            icon={<MessageSquare className="w-4 h-4" />}
            value={pack.caption}
            onRegenerate={() => regenerate("caption")}
            regenerating={regenBlock === "caption"}
            delay={0.08}
          />
          <CtaCard ctas={pack.cta_options} onRegenerate={() => regenerate("cta_options")} regenerating={regenBlock === "cta_options"} />
          <HashtagCard sets={pack.hashtags} onRegenerate={() => regenerate("hashtags")} regenerating={regenBlock === "hashtags"} />
          <CarouselCard
            title={pack.carousel?.title}
            slides={pack.carousel?.slides ?? []}
            onRegenerate={() => regenerate("carousel")}
            regenerating={regenBlock === "carousel"}
          />
          <VisualPromptCard
            prompt={pack.visual_prompt}
            onRegenerate={() => regenerate("visual_prompt")}
            regenerating={regenBlock === "visual_prompt"}
          />
          <RepurposeCard
            thread={pack.repurpose?.twitter_thread ?? []}
            reel={pack.repurpose?.reel_script ?? ""}
            onRegenerate={() => regenerate("repurpose")}
            regenerating={regenBlock === "repurpose"}
          />
          <PostingCard
            time={pack.posting?.best_time_local}
            rationale={pack.posting?.rationale}
            caption={pack.caption}
          />
          {pack.notes && (
            <div className="text-xs text-muted-foreground italic px-4 py-2">💡 {pack.notes}</div>
          )}
        </div>
      )}

      {!loading && !pack && (
        <div className="bg-card rounded-2xl border border-border/40 p-10 text-center">
          <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Describe your topic and we'll generate the full pack — hooks, caption, CTAs, hashtags, carousel, visual prompt, repurposed thread + reel, and best posting time.</p>
        </div>
      )}
    </div>
  );
}
