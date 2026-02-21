"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "../../src/context/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import TopNav from "@/src/components/shared/TopNav";

function NewsContent() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  
  const [news, setNews] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(
          `${api}/news/public?language=${language}&page=${currentPage}&limit=10`,
          { cache: "no-store" }
        );
        const data = await res.json();
        const newsData = data.data || data;
        setNews(newsData.items || []);
        setTotalPages(newsData.meta?.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [language, currentPage]);

  const goToPage = (page: number) => {
    router.push(`/news?page=${page}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">{language === "ar" ? "الأخبار" : "News"}</h1>
          <p className="text-gray-600 mt-2">
            {language === "ar" ? "ابقَ مطلعاً على أحدث الأخبار والإعلانات" : "Stay updated with our latest news and announcements"}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{language === "ar" ? "لا توجد أخبار بعد" : "No news articles yet."}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {news.map((n: any) => {
                const title = n.translations?.[0]?.title || "Untitled";
                const isExpired = n.expiresAt && new Date(n.expiresAt) < new Date();
                return (
                  <article
                    key={n.id}
                    className={`rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border ${
                      isExpired
                        ? "bg-gray-100 border-gray-300 opacity-60"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="p-6 flex flex-col h-full">
                      {isExpired && (
                        <div className="mb-2 inline-block bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                          {language === "ar" ? "منتهي" : "Expired"}
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h2>
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-3" dangerouslySetInnerHTML={{ __html: n.translations?.[0]?.content?.substring(0, 150) || "" }}>
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-500">
                            {new Date(n.publishedAt).toLocaleDateString(
                              language === "ar" ? "ar-SA" : "en-US"
                            )}
                          </span>
                          {n.expiresAt && (
                            <span className="text-xs text-gray-400">
                              {language === "ar" ? "ينتهي في: " : "Expires: "}
                              {new Date(n.expiresAt).toLocaleDateString(
                                language === "ar" ? "ar-SA" : "en-US"
                              )}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/news/${n.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          {language === "ar" ? "اقرأ المزيد" : "Read more"} →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pb-8">
                {currentPage > 1 && (
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {language === "ar" ? "السابق" : "Previous"}
                  </button>
                )}
                <span className="px-4 py-2 text-gray-700">
                  {language === "ar" ? `الصفحة ${currentPage}` : `Page ${currentPage}`} {language === "ar" ? "من" : "of"} {totalPages}
                </span>
                {currentPage < totalPages && (
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {language === "ar" ? "التالي" : "Next"}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
      <NewsContent />
    </Suspense>
  );
}
