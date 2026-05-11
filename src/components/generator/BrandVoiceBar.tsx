import { useState } from "react";
import { Link } from "react-router-dom";
import { Mic, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type BrandVoice = {
  id?: string;
  name?: string;
  voice?: string;
  audience?: string;
  style_prompt?: string;
};

export default function BrandVoiceBar({
  profile, onChange,
}: {
  profile: BrandVoice | null;
  onChange: (p: BrandVoice) => void;
}) {
  const [editing, setEditing] = useState(!profile);
  const [draft, setDraft] = useState<BrandVoice>({
    name: profile?.name ?? "",
    voice: profile?.voice ?? "",
    audience: profile?.audience ?? "",
    style_prompt: profile?.style_prompt ?? "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      name: draft.name || "My Brand",
      voice: draft.voice,
      audience: draft.audience,
      style_prompt: draft.style_prompt,
    };
    let row;
    if (profile?.id) {
      const { data } = await supabase.from("brand_profile").update(payload).eq("id", profile.id).select().single();
      row = data;
    } else {
      const { data } = await supabase.from("brand_profile").insert(payload).select().single();
      row = data;
    }
    setSaving(false);
    if (row) {
      onChange(row as BrandVoice);
      setEditing(false);
      toast.success("Brand voice saved");
    } else {
      toast.error("Could not save brand voice");
    }
  };

  if (!editing && profile) {
    return (
      <div className="bg-card rounded-2xl border border-border/40 px-4 py-2.5 mb-4 flex items-center gap-3">
        <Mic className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">
            <span className="text-muted-foreground">Voice: </span>
            {profile.voice || "—"}
            {profile.audience && <span className="text-muted-foreground"> · for </span>}
            {profile.audience}
          </p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
        >
          Edit <ChevronDown className="w-3 h-3" />
        </button>
        <Link to="/dashboard/branding" className="text-xs text-muted-foreground hover:text-foreground">
          Full settings →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/40 p-4 mb-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="font-semibold text-sm">How does your brand sound?</p>
        <span className="text-[10px] text-muted-foreground">Used in every generation</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Brand name</label>
          <Input value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="My Brand" />
        </div>
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Audience</label>
          <Input value={draft.audience ?? ""} onChange={(e) => setDraft({ ...draft, audience: e.target.value })} placeholder="e.g. early-stage founders" />
        </div>
      </div>
      <div>
        <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Voice / tone</label>
        <Input value={draft.voice ?? ""} onChange={(e) => setDraft({ ...draft, voice: e.target.value })} placeholder='e.g. "Bold, witty, no jargon"' />
      </div>
      <div>
        <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Style notes (emoji use, formatting, do's / don'ts)</label>
        <Textarea rows={2} value={draft.style_prompt ?? ""} onChange={(e) => setDraft({ ...draft, style_prompt: e.target.value })} placeholder='e.g. "Short paragraphs. One emoji max. Never use #hustle."' />
      </div>
      <div className="flex gap-2">
        <Button onClick={save} disabled={saving} size="sm" className="bg-gradient-hero text-primary-foreground">
          {saving ? "Saving…" : "Save voice"}
        </Button>
        {profile && (
          <Button onClick={() => setEditing(false)} variant="ghost" size="sm">Cancel</Button>
        )}
      </div>
    </div>
  );
}
