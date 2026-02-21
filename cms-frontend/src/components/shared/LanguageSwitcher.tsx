"use client";
import React from "react";
import { useLanguage } from "../../context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center bg-slate-700 rounded-lg p-0.5">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 text-xs font-medium rounded transition ${
          language === "en"
            ? "bg-white text-slate-900"
            : "text-slate-300 hover:text-white"
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage("ar")}
        className={`px-3 py-1.5 text-xs font-medium rounded transition ${
          language === "ar"
            ? "bg-white text-slate-900"
            : "text-slate-300 hover:text-white"
        }`}
      >
        العربية
      </button>
    </div>
  );
}
