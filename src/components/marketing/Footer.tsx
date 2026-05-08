import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Youtube } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const cols = [
  { title: "Product", items: ["Platform", "AI Stack", "Workflows", "Agents", "Pricing"] },
  { title: "Solutions", items: ["Creators", "Founders", "Agencies", "Enterprises"] },
  { title: "Developers", items: ["Documentation", "API", "Integrations", "Status"] },
  { title: "Community", items: ["Discord", "Twitter / X", "YouTube", "Blog"] },
  { title: "Company", items: ["About", "Careers", "Contact", "Press"] },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 mt-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground mt-4 max-w-xs">
              The operating system for AI businesses. Build, automate, and scale with cinematic AI workflows.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Github, Linkedin, Youtube].map((I, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-border/60 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">{c.title}</p>
              <ul className="space-y-2.5">
                {c.items.map((it) => (
                  <li key={it}>
                    <Link to={it === "Contact" ? "/contact" : "#"} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{it}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AISTUDIYO. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Crafted for the AI-native era.</p>
        </div>
      </div>
    </footer>
  );
}
