export type ImageStyle = {
  name: string;
  category: ImageStyleCategory;
  desc: string;
  prompt: string;
  thumb: string;
};

export const IMAGE_STYLE_CATEGORIES = [
  "All",
  "Art & Illustration",
  "Anime & Cartoon",
  "Photography",
  "Cinematic",
  "3D & Render",
  "Print & Graphic",
  "Vibe & Aesthetic",
] as const;
export type ImageStyleCategory = typeof IMAGE_STYLE_CATEGORIES[number];

const u = (id: string) => `https://images.unsplash.com/${id}?w=600&h=600&fit=crop`;

export const IMAGE_STYLES: ImageStyle[] = [
  // Art & Illustration
  { name: "Scribble", category: "Art & Illustration", desc: "Hand-drawn doodle on paper", prompt: "in a hand-drawn doodle style with rough pencil lines, imperfect outlines, and a sketchy childlike aesthetic on white paper", thumb: u("photo-1513364776144-60967b0f800f") },
  { name: "Technicolor", category: "Art & Illustration", desc: "Bauhaus colorblock", prompt: "with bold primary color-blocking, hard geometric shadows, Bauhaus-inspired flat planes of vivid color", thumb: u("photo-1541701494587-cb58502866ab") },
  { name: "Watercolor", category: "Art & Illustration", desc: "Soft watercolor wash", prompt: "as a soft watercolor painting with ink outlines, bleeding wet edges, muted pastel washes, and paper texture", thumb: u("photo-1502691876148-a84978e59af8") },
  { name: "Pencil sketch", category: "Art & Illustration", desc: "Graphite on aged paper", prompt: "as a detailed pencil drawing on aged paper, with hatching, smudged shading, and hand-drawn imperfections", thumb: u("photo-1499781350541-7783f6c6a0c8") },
  { name: "Pixel art", category: "Art & Illustration", desc: "Retro 8-bit pixels", prompt: "as retro 8-bit pixel art with a limited color palette, chunky pixels, and classic video game sprite style", thumb: u("photo-1550745165-9bc0b252726f") },
  { name: "Oil painting", category: "Art & Illustration", desc: "Renaissance oil", prompt: "as a textured oil painting in Renaissance style with rich deep colors, visible brushstrokes, and dramatic lighting", thumb: u("photo-1579783902614-a3fb3927b6a5") },

  // Anime & Cartoon
  { name: "Chibi stickers", category: "Anime & Cartoon", desc: "Sparkly chibi", prompt: "in a cute chibi anime sticker style, big sparkling eyes, pastel pink background, with heart and sparkle decorations", thumb: u("photo-1578632767115-351597cf2477") },
  { name: "Studio Ghibli", category: "Anime & Cartoon", desc: "Painterly Ghibli", prompt: "in the soft painterly style of Studio Ghibli, with lush backgrounds, warm natural light, and expressive characters", thumb: u("photo-1490750967868-88aa4486c946") },
  { name: "Manga panel", category: "Anime & Cartoon", desc: "B&W manga ink", prompt: "as a black-and-white manga comic panel with bold ink lines, screen tones, speed lines, and dramatic expressions", thumb: u("photo-1607604276583-eef5d076aa5f") },
  { name: "Lofi aesthetic", category: "Anime & Cartoon", desc: "Cozy lofi scene", prompt: "in a lofi cozy anime style with muted warm colors, soft grain, a calm indoor atmosphere with plants and rain outside", thumb: u("photo-1531685250784-7569952593d2") },

  // Photography
  { name: "Monochrome", category: "Photography", desc: "Dramatic black & white", prompt: "as a dramatic black and white portrait with high contrast, deep shadows, and cinematic lighting", thumb: u("photo-1463453091185-61582044d556") },
  { name: "Luxe collage", category: "Photography", desc: "Editorial collage", prompt: "as a luxury fashion editorial collage with warm film tones, rich textures, and layered photographic elements", thumb: u("photo-1485518882345-15568b007407") },
  { name: "Makeup guide", category: "Photography", desc: "Beauty grid", prompt: "as a beauty editorial guide grid showing close-up facial features with professional studio lighting", thumb: u("photo-1487412947147-5cebf100ffc2") },
  { name: "Salon portrait", category: "Photography", desc: "Refined editorial", prompt: "as a refined editorial portrait with neutral tones, soft diffused light, and clean minimalist styling", thumb: u("photo-1524504388940-b1c1722653e1") },
  { name: "Golden hour", category: "Photography", desc: "Warm sunset glow", prompt: "bathed in golden hour sunlight with long warm shadows, glowing bokeh, and dreamy soft focus", thumb: u("photo-1500382017468-9049fed747ef") },
  { name: "Double exposure", category: "Photography", desc: "Silhouette + landscape", prompt: "as a double exposure photograph blending a silhouette with a landscape or abstract texture overlay", thumb: u("photo-1532009324734-20a7a5813719") },
  { name: "Tilt-shift", category: "Photography", desc: "Miniature world", prompt: "with a tilt-shift miniature effect, shallow depth of field making the scene look like a tiny model world", thumb: u("photo-1449824913935-59a10b8d2000") },

  // Cinematic
  { name: "Dynamite", category: "Cinematic", desc: "Blockbuster poster", prompt: "as a cinematic action movie poster with explosive lighting, dramatic fire, motion blur, and Hollywood blockbuster energy", thumb: u("photo-1489599849927-2ee91cede3ba") },
  { name: "Noir room", category: "Cinematic", desc: "Moody film noir", prompt: "as a dark film noir scene, dimly lit with a single spotlight, deep shadows, moody atmospheric fog, and mystery", thumb: u("photo-1505691938895-1758d7feb511") },
  { name: "Steampunk", category: "Cinematic", desc: "Victorian sci-fi", prompt: "in a Victorian steampunk city with brass gears, airships, dramatic stormy skies, and warm gaslight", thumb: u("photo-1518709268805-4e9042af2176") },
  { name: "Cyberpunk city", category: "Cinematic", desc: "Neon rain streets", prompt: "as a neon-lit cyberpunk cityscape with rain-slicked streets, holographic signs, and electric purple-blue atmosphere", thumb: u("photo-1518709268805-4e9042af2176") },

  // 3D & Render
  { name: "Gothic clay", category: "3D & Render", desc: "Clay render, Victorian mood", prompt: "as a detailed 3D clay render in a gothic Victorian environment with candlelight, stone walls, and moody shadows", thumb: u("photo-1518709268805-4e9042af2176") },
  { name: "Low poly", category: "3D & Render", desc: "Faceted geometry", prompt: "as a low-polygon 3D geometric mesh render with faceted surfaces and cool ambient lighting", thumb: u("photo-1561214078-f3247647fc5e") },
  { name: "Claymation", category: "3D & Render", desc: "Stop-motion clay", prompt: "as a soft claymation stop-motion style with rounded clay textures, cheerful colors, and tactile surfaces", thumb: u("photo-1558981806-ec527fa84c39") },
  { name: "Neon glow", category: "3D & Render", desc: "Long-exposure neon", prompt: "with glowing neon light streaks and electric light trails on a deep black background, long-exposure style", thumb: u("photo-1492551557933-34265f7af79e") },
  { name: "Glass render", category: "3D & Render", desc: "Refractive crystal", prompt: "as a transparent glass 3D render with refraction, caustics, and light bending through crystal surfaces", thumb: u("photo-1518998053901-5348d3961a04") },
  { name: "Isometric city", category: "3D & Render", desc: "Top-down diorama", prompt: "as a flat isometric 3D top-down city view with clean geometric buildings and pastel color palette", thumb: u("photo-1480714378408-67cf0d13bc1b") },

  // Print & Graphic
  { name: "Risograph", category: "Print & Graphic", desc: "2-color riso print", prompt: "as a risograph print with 2 ink colors, halftone dots, slight color misregistration, and bold graphic poster aesthetic", thumb: u("photo-1547891654-e66ed7ebb968") },
  { name: "Animal infographic", category: "Print & Graphic", desc: "Vintage scientific diagram", prompt: "as a dark-background scientific infographic with anatomical labels, constellation-style dotted lines, and clean typography", thumb: u("photo-1474511320723-9a56873867b5") },
  { name: "Ukiyo-e", category: "Print & Graphic", desc: "Japanese woodblock", prompt: "as a Japanese ukiyo-e woodblock print with flat color planes, bold outlines, and traditional compositional flow", thumb: u("photo-1528360983277-13d401cdc186") },
  { name: "Bauhaus poster", category: "Print & Graphic", desc: "Geometric grid poster", prompt: "as a Bauhaus-inspired poster with primary colors, geometric shapes, bold typography, and strict grid composition", thumb: u("photo-1558865869-c93f6f8482af") },
  { name: "Art nouveau", category: "Print & Graphic", desc: "Floral organic curves", prompt: "in Art Nouveau style with organic flowing curves, floral motifs, decorative borders, and soft earth tones", thumb: u("photo-1578926375605-eaf7559b1458") },
  { name: "Tarot card", category: "Print & Graphic", desc: "Mystical illustrated card", prompt: "as a mystical illustrated tarot card with ornate borders, symbolic iconography, starry dark background, and gold accents", thumb: u("photo-1601024445121-e5b82f020549") },
  { name: "Blueprint", category: "Print & Graphic", desc: "Technical line art", prompt: "as a technical blueprint with white line art on deep blue background, measurement annotations, and engineering precision", thumb: u("photo-1503387762-592deb58ef4e") },

  // Vibe & Aesthetic
  { name: "Vaporwave", category: "Vibe & Aesthetic", desc: "Neon 80s grid", prompt: "in vaporwave aesthetic with neon pink and purple, 80s grid, glitch effects, retro 3D sculptures, and synthwave mood", thumb: u("photo-1550859492-d5da9d8e45f3") },
  { name: "Cottagecore", category: "Vibe & Aesthetic", desc: "Linen & wildflowers", prompt: "in cottagecore style with soft natural light, linen textures, wildflowers, worn wood, and a serene rural mood", thumb: u("photo-1464822759023-fed622ff2c3b") },
  { name: "Dark academia", category: "Vibe & Aesthetic", desc: "Candlelit scholar mood", prompt: "in dark academia style with candlelight, aged books, gothic architecture, warm amber tones, and scholarly atmosphere", thumb: u("photo-1481627834876-b7833e8f5570") },
  { name: "Y2K chrome", category: "Vibe & Aesthetic", desc: "Glossy chrome 2000s", prompt: "in Y2K style with chrome metallic surfaces, bubble letters, glossy silver textures, and early 2000s digital aesthetics", thumb: u("photo-1620207418302-439b387441b0") },
  { name: "Solarpunk", category: "Vibe & Aesthetic", desc: "Green optimistic future", prompt: "in solarpunk style with lush vertical gardens, solar panels integrated into organic architecture, and optimistic green future", thumb: u("photo-1518495973542-4542c06a5843") },
  { name: "Dreamcore", category: "Vibe & Aesthetic", desc: "Surreal liminal pastel", prompt: "in dreamcore surrealist style with pastel clouds, impossible staircases, floating objects, and uncanny liminal spaces", thumb: u("photo-1534447677768-be436bb09401") },
];
