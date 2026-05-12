export type StudioPrefill = {
  topic?: string;
  platform?: string;
  contentType?: string;
  tone?: string;
  source?: string;
};

export function buildStudioUrl(p: StudioPrefill) {
  const params = new URLSearchParams();
  if (p.topic) params.set("topic", p.topic);
  if (p.platform) params.set("platform", p.platform);
  if (p.contentType) params.set("contentType", p.contentType);
  if (p.tone) params.set("tone", p.tone);
  if (p.source) params.set("source", p.source);
  return `/dashboard/studio?${params.toString()}`;
}

export function buildImageStudioUrl(prompt: string, mode: "image" | "sticker" = "image") {
  const params = new URLSearchParams({ prompt, mode });
  return `/dashboard/image-studio?${params.toString()}`;
}
