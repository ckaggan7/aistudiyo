import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { DEFAULT_THEME_ID, THEMES, THEME_STORAGE_KEY, ThemePreset } from "@/lib/themes";

type ThemeCtx = {
  themeId: string;
  theme: ThemePreset;
  themes: ThemePreset[];
  setTheme: (id: string) => void;
};

const Ctx = createContext<ThemeCtx | undefined>(undefined);

function applyTheme(theme: ThemePreset) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME_ID;
    return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME_ID;
  });

  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((id: string) => {
    setThemeId(id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch (_e) {
      /* storage unavailable */
    }
  }, []);

  return (
    <Ctx.Provider value={{ themeId, theme, themes: THEMES, setTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be used inside ThemeProvider");
  return c;
}
