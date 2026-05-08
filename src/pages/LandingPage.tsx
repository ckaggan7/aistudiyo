import { motion, type Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Palette, Calendar, ArrowRight, Zap, TrendingUp, Image as ImageIcon, Check, MessageSquareText, Wand2, BarChart3, Send, PenLine, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Squiggle,
  StarDoodle,
  CircleDoodle,
  Underline,
  ArrowDoodle,
  HeartDoodle,
  SpiralDoodle,
  DotsTriangle,
  ZigzagDoodle,
  BurstDoodle,
} from "@/components/Doodles";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } as Transition,
  }),
};

const features = [
  {
    icon: Sparkles,
    title: "AI Content Generator",
    description: "Generate captions, hashtags, and hooks powered by AI for any platform.",
    color: "orange",
  },
  {
    icon: Palette,
    title: "Design Studio",
    description: "Create stunning visuals with templates, AI backgrounds, and drag-and-drop editing.",
    color: "purple",
  },
  {
    icon: Calendar,
    title: "Content Scheduler",
    description: "Plan and schedule your posts across platforms with a visual calendar.",
    color: "orange",
  },
  {
    icon: ImageIcon,
    title: "AI Image Generator",
    description: "Generate unique images from text prompts for your social media posts.",
    color: "purple",
  },
  {
    icon: TrendingUp,
    title: "Trend Engine",
    description: "Stay ahead with trending hashtags, topics, and content ideas.",
    color: "orange",
  },
  {
    icon: Zap,
    title: "Analytics Dashboard",
    description: "Track engagement, growth, and performance across all your channels.",
    color: "purple",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </span>
            AI <span className="text-gradient-hero">STUDIYO</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-full px-5 border-primary/30">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="rounded-full px-5 bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-glow">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
        {/* Soft pastel background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(30,100%,96%)] via-background to-[hsl(280,60%,96%)]" />
          <motion.div
            animate={{ x: [0, 40, -20, 0], y: [0, -20, 20, 0], scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -left-20 w-[500px] h-[500px] rounded-full bg-[hsl(22,95%,70%/0.35)] blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -30, 25, 0], y: [0, 30, -15, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[hsl(280,80%,70%/0.3)] blur-[140px]"
          />
        </div>

        {/* Floating doodles */}
        <Squiggle className="hidden lg:block absolute top-32 left-10 w-24 text-primary/40" />
        <StarDoodle className="hidden lg:block absolute top-40 right-20 w-10 text-accent/60" />
        <CircleDoodle className="hidden lg:block absolute bottom-32 left-16 w-20 text-primary/30" />
        <SpiralDoodle className="hidden lg:block absolute top-1/2 right-10 w-14 text-accent/40" />
        <DotsTriangle className="hidden lg:block absolute bottom-20 right-1/3 w-12 text-primary/40" />
        <BurstDoodle className="hidden lg:block absolute top-28 left-1/2 w-12 text-accent/50" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-24 pb-16 relative">
          {/* Left – Artistic illustration card stack */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative mx-auto max-w-md aspect-square">
              {/* Back card - purple */}
              <motion.div
                animate={{ rotate: [-8, -6, -8], y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent to-[hsl(280,80%,55%)] shadow-elevated -rotate-[8deg] origin-bottom-left"
              >
                <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <StarDoodle className="absolute top-8 right-8 w-8 text-white/70" />
                <ZigzagDoodle className="absolute bottom-12 left-8 w-24 text-white/50" />
              </motion.div>

              {/* Middle card - white with content */}
              <motion.div
                animate={{ rotate: [3, 5, 3], y: [0, -4, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 rounded-[2rem] bg-card border border-border/60 shadow-elevated rotate-[3deg] p-7 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,80%,65%)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(45,95%,60%)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(140,70%,55%)]" />
                </div>
                <p className="text-xs text-muted-foreground mb-2 font-mono">prompt.txt</p>
                <p className="text-sm font-medium leading-relaxed mb-4">
                  "Create a launch post for our new <span className="text-primary">eco-friendly</span> coffee brand 🌿"
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-hero border-2 border-card" />
                    <div className="w-7 h-7 rounded-full bg-gradient-accent border-2 border-card" />
                    <div className="w-7 h-7 rounded-full bg-accent border-2 border-card" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Generate
                  </div>
                </div>
              </motion.div>

              {/* Front card - orange */}
              <motion.div
                animate={{ rotate: [-2, 0, -2], y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -right-4 w-44 h-44 rounded-3xl bg-gradient-hero shadow-glow p-5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <HeartDoodle className="w-6 text-white/80" />
                </div>
                <div>
                  <p className="text-white/80 text-[10px] uppercase tracking-wider font-semibold">Engagement</p>
                  <p className="text-white text-3xl font-bold">+247%</p>
                </div>
              </motion.div>

              {/* Floating image preview */}
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [-4, -2, -4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute -top-6 -left-4 w-32 h-32 rounded-2xl bg-gradient-to-br from-[hsl(280,70%,75%)] via-[hsl(330,80%,75%)] to-[hsl(22,95%,70%)] shadow-elevated -rotate-[6deg] flex items-center justify-center"
              >
                <ImageIcon className="w-10 h-10 text-white/90" strokeWidth={1.5} />
                <ArrowDoodle className="absolute -bottom-8 -right-6 w-14 text-accent" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right – Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 text-center lg:text-left relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-primary/20 shadow-card text-xs font-medium mb-6"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </motion.span>
              <span className="text-foreground">Built with Claude AI</span>
              <span className="px-1.5 py-0.5 rounded-full bg-gradient-hero text-primary-foreground text-[10px] font-bold">NEW</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6 text-foreground">
              Create content
              <br />
              that{" "}
              <span className="relative inline-block">
                <span className="text-gradient-hero">stops the scroll</span>
                <Underline className="absolute -bottom-3 left-0 w-full text-primary" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10">
              Generate captions, design visuals, and schedule posts — all powered by AI in one elegant studio.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-8">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 transition-opacity px-8 h-12 text-base rounded-full shadow-glow">
                  Join the Waitlist <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-primary/30 hover:bg-primary/5">
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[
                  "from-[hsl(22,95%,60%)] to-[hsl(45,95%,60%)]",
                  "from-[hsl(280,80%,60%)] to-[hsl(320,80%,60%)]",
                  "from-[hsl(190,90%,55%)] to-[hsl(220,90%,60%)]",
                  "from-[hsl(330,85%,65%)] to-[hsl(22,95%,60%)]",
                ].map((g, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 border-background`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Join <span className="font-semibold text-foreground">2,000+ creators</span> on the waitlist
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-soft opacity-50" />
        <ZigzagDoodle className="absolute top-16 left-10 w-32 text-primary/30 hidden md:block" />
        <SpiralDoodle className="absolute bottom-20 right-16 w-20 text-accent/40 hidden md:block" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-20 relative"
          >
            <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">How it works</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight inline-block relative">
              Three steps to{" "}
              <span className="relative inline-block">
                <span className="text-gradient-hero">viral content</span>
                <Underline className="absolute -bottom-2 left-0 w-full text-accent" />
              </span>
            </h2>
            <StarDoodle className="absolute -top-4 -right-8 w-8 text-primary hidden md:block" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe your idea",
                description: "Type a prompt — your topic, tone, platform, and vibe. Our AI understands context like a creative partner.",
                icon: MessageSquareText,
                doodleColor: "text-primary",
                cardGradient: "from-[hsl(30,100%,97%)] to-[hsl(22,95%,92%)]",
                accentBg: "bg-gradient-hero",
                Doodle: Squiggle,
              },
              {
                step: "02",
                title: "Generate & refine",
                description: "Get captions, images, and designs in seconds. Edit, remix, or regenerate until it's perfect.",
                icon: Wand2,
                doodleColor: "text-accent",
                cardGradient: "from-[hsl(280,70%,97%)] to-[hsl(280,70%,93%)]",
                accentBg: "bg-gradient-to-br from-accent to-[hsl(280,80%,55%)]",
                Doodle: BurstDoodle,
              },
              {
                step: "03",
                title: "Schedule & grow",
                description: "Plan your calendar, publish across platforms, and watch your engagement soar with analytics.",
                icon: BarChart3,
                doodleColor: "text-primary",
                cardGradient: "from-[hsl(30,100%,97%)] to-[hsl(280,70%,95%)]",
                accentBg: "bg-gradient-warm",
                Doodle: ArrowDoodle,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ y: -8 }}
                className={cn(
                  "relative rounded-3xl p-8 bg-gradient-to-br border border-border/50 shadow-card hover:shadow-elevated transition-all duration-500 group",
                  item.cardGradient
                )}
              >
                <span className={cn("absolute -top-4 -right-4 w-14 h-14 rounded-2xl text-primary-foreground text-lg font-bold flex items-center justify-center shadow-elevated rotate-6 group-hover:rotate-12 transition-transform", item.accentBg)}>
                  {item.step}
                </span>

                <div className="w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <item.Doodle className={cn("w-20 opacity-60", item.doodleColor)} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
            className="text-center mt-16"
          >
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 transition-opacity px-8 h-12 text-base rounded-full shadow-glow">
                Try it free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6 relative">
        <DotsTriangle className="absolute top-20 right-10 w-16 text-primary/40 hidden md:block" />
        <CircleDoodle className="absolute bottom-32 left-10 w-20 text-accent/30 hidden md:block" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-3">Features</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to{" "}
              <span className="text-gradient-hero">create</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              One elegant platform for generating, designing, scheduling, and analyzing your social content.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const isOrange = feature.color === "orange";
              return (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -6 }}
                  className="group relative bg-card rounded-3xl p-7 shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50 overflow-hidden"
                >
                  <div className={cn(
                    "absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700",
                    isOrange ? "bg-primary" : "bg-accent"
                  )} />

                  <div className={cn(
                    "relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-card",
                    isOrange ? "bg-gradient-hero" : "bg-gradient-to-br from-accent to-[hsl(280,80%,55%)]"
                  )}>
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>

                  <div className={cn(
                    "absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity",
                    isOrange ? "text-primary" : "text-accent"
                  )}>
                    {isOrange ? <StarDoodle className="w-6" /> : <HeartDoodle className="w-6" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6 relative bg-gradient-soft">
        <Squiggle className="absolute top-16 left-1/4 w-24 text-accent/40 hidden md:block" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Simple{" "}
              <span className="relative inline-block">
                <span className="text-gradient-hero">credit-based</span>
                <Underline className="absolute -bottom-2 left-0 w-full text-primary" />
              </span>{" "}
              pricing
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              1 credit = 1 AI generation. Start free, upgrade when you need more.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                credits: "5 credits / day",
                features: ["AI text generation", "AI image generation", "Basic templates", "Community support"],
                cta: "Get Started",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$9",
                period: "/ month",
                credits: "100 credits / day",
                features: ["Everything in Free", "Priority generation", "Advanced templates", "Content calendar", "Email support"],
                cta: "Join the Waitlist",
                highlight: true,
              },
              {
                name: "Business",
                price: "$29",
                period: "/ month",
                credits: "Unlimited credits",
                features: ["Everything in Pro", "Team collaboration", "Custom branding", "Analytics dashboard", "API access", "Dedicated support"],
                cta: "Contact Sales",
                highlight: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                className={cn(
                  "relative rounded-3xl p-8 flex flex-col transition-all duration-500",
                  plan.highlight
                    ? "bg-gradient-hero text-primary-foreground shadow-elevated lg:scale-105 border-0"
                    : "bg-card shadow-card hover:shadow-elevated border border-border/50"
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-card text-primary text-xs font-bold shadow-card">
                    ✦ MOST POPULAR
                  </span>
                )}
                {plan.highlight && (
                  <BurstDoodle className="absolute top-4 right-4 w-10 text-primary-foreground/40" />
                )}

                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  <span className={cn("text-sm", plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>{plan.period}</span>
                </div>
                <p className={cn("text-sm font-semibold mb-6", plan.highlight ? "text-primary-foreground/90" : "text-primary")}>{plan.credits}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        plan.highlight ? "bg-primary-foreground/20" : "bg-primary/10"
                      )}>
                        <Check className={cn("w-3 h-3", plan.highlight ? "text-primary-foreground" : "text-primary")} strokeWidth={3} />
                      </span>
                      <span className={plan.highlight ? "text-primary-foreground/95" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/signup" className="mt-auto">
                  <Button
                    size="lg"
                    className={cn(
                      "w-full h-12 text-base rounded-full",
                      plan.highlight
                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-4xl mx-auto text-center relative bg-gradient-warm rounded-[2.5rem] p-12 md:p-16 shadow-elevated overflow-hidden"
        >
          <BurstDoodle className="absolute top-8 left-8 w-16 text-white/30" />
          <StarDoodle className="absolute bottom-12 right-12 w-12 text-white/40" />
          <SpiralDoodle className="absolute top-12 right-16 w-14 text-white/30" />
          <HeartDoodle className="absolute bottom-8 left-16 w-10 text-white/40" />

          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Ready to level up<br />your content?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of creators using AI STUDIYO to grow their audience.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 h-12 text-base rounded-full font-semibold">
                Join the Waitlist <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-gradient-hero flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </span>
            <span className="text-sm text-muted-foreground">© 2026 AI STUDIYO by Whistle Media Networks.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
