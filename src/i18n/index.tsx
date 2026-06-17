import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { it } from "./it";
import { en } from "./en";

export type Lang = "it" | "en";
export type Dict = typeof it;

const dicts: Record<Lang, Dict> = { it, en };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dict) => string;
  d: Dict;
};

const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "it" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  };

  const d = dicts[lang];
  const t = (key: keyof Dict) => (d[key] as string) ?? (it[key] as string) ?? String(key);

  return <LangCtx.Provider value={{ lang, setLang, t, d }}>{children}</LangCtx.Provider>;
}

export function useT() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useT must be used inside LanguageProvider");
  return ctx;
}
