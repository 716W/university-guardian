import { createContext, useContext, useEffect, useState } from "react";

type Language = "EN" | "AR";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "EN",
  setLang: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as Language) || "EN";
    }
    return "EN";
  });

  const isRTL = lang === "AR";

  useEffect(() => {
    const root = document.documentElement;
    root.dir = isRTL ? "rtl" : "ltr";
    root.lang = isRTL ? "ar" : "en";
    localStorage.setItem("lang", lang);
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
