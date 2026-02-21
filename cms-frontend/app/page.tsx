"use client";
import Link from "next/link";
import TopNav from "@/src/components/shared/TopNav";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Navigation */}
      <TopNav />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 flex-grow">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {language === "ar" ? "مرحبا بك في نظام إدارة المحتوى" : "Welcome to Our CMS"}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {language === "ar"
              ? "اكتشف أحدث منشورات المدونة والأخبار. ابقَ مطلعاً على المحتوى الجودة."
              : "Discover our latest blog posts and news updates. Stay informed with quality content."}
          </p>
          <div className="space-x-4 flex items-center justify-center">
            <Link href="/blogs" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              {language === "ar" ? "اقرأ المدونة" : "Read Blogs"}
            </Link>
            <Link href="/news" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium">
              {language === "ar" ? "آخر الأخبار" : "Latest News"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>© 2026 CMS Platform. {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}
