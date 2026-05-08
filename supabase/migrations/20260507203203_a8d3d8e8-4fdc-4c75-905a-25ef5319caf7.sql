
-- Generations table for AI Image Studio
CREATE TABLE public.generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NULL,
  prompt TEXT NOT NULL,
  style TEXT,
  mode TEXT NOT NULL DEFAULT 'text',
  image_url TEXT NOT NULL,
  generated_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view generations"
  ON public.generations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert generations"
  ON public.generations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete generations"
  ON public.generations FOR DELETE
  USING (true);

-- Public storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generations', 'generations', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read generations bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'generations');

CREATE POLICY "Public upload generations bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'generations');
