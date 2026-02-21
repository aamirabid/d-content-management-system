"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../src/context/LanguageContext";
import Link from "next/link";
import TopNav from "@/src/components/shared/TopNav";

export const dynamic = "force-dynamic";

export default function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { language } = useLanguage();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const resolvedParams = await Promise.resolve(params);
        const slug = resolvedParams.slug;
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(
          `${api}/news/public/slug/${slug}?language=${language}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setNewsItem(data.data || null);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setNewsItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [language, params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{language === "ar" ? "جاري التحميل..." : "Loading..."}</div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "ar" ? "الخبر غير موجود" : "News article not found"}
          </h1>
          <Link href="/news" className="text-blue-600 hover:text-blue-700">
            {language === "ar" ? "العودة للأخبار" : "Back to news"}
          </Link>
        </div>
      </div>
    );
  }

  const title = newsItem.translations?.[0]?.title || "Untitled";
  const content = newsItem.translations?.[0]?.content || "";
  const isExpired = newsItem.expiresAt && new Date(newsItem.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/news" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← {language === "ar" ? "العودة للأخبار" : "Back to news"}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            {isExpired && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold">
                {language === "ar" ? "منتهي" : "Expired"}
              </span>
            )}
            <span>{new Date(newsItem.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
            {newsItem.author && <span>{newsItem.author.firstName} {newsItem.author.lastName}</span>}
            {newsItem.expiresAt && (
              <span className="text-sm">
                {language === "ar" ? "ينتهي في: " : "Expires: "}
                {new Date(newsItem.expiresAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
              </span>
            )}
          </div>
        </div>
      </header>

      <article className={`max-w-4xl mx-auto px-6 py-12 prose prose-lg max-w-none ${language === "ar" ? "text-right" : ""}`}>
        <div
          className="bg-white p-8 rounded-lg shadow-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
}
