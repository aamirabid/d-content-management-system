"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

export default function TopNav() {
  const { language, setLanguage } = useLanguage();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="font-bold text-xl text-gray-900 hover:text-blue-600">
          CMS
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
            {language === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <Link href="/blogs" className="text-gray-700 hover:text-blue-600 transition">
            {language === "ar" ? "المدونة" : "Blogs"}
          </Link>
          <Link href="/news" className="text-gray-700 hover:text-blue-600 transition">
            {language === "ar" ? "الأخبار" : "News"}
          </Link>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-2 rounded transition ${
              language === "en"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("ar")}
            className={`px-3 py-2 rounded transition ${
              language === "ar"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            العربية
          </button>
        </div>
      </div>
    </nav>
  );
}
