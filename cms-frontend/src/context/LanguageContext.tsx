"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

type LanguageContextValue = {
  language: Language;
  setLanguage: (l: Language) => void;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isClient, setIsClient] = useState(false);

  // Load language from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguage(saved);
    }
  }, []);

  // Update DOM when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    // Save to localStorage when language changes
    if (isClient) {
      localStorage.setItem('language', language);
    }
  }, [language, isClient]);

  const handleSetLanguage = (l: Language) => {
    setLanguage(l);
  };

  const value = { language, setLanguage: handleSetLanguage, dir: (language === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl' };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
