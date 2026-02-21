"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "../../src/context/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import TopNav from "@/src/components/shared/TopNav";

function BlogsContent() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(
          `${api}/blogs/public?language=${language}&page=${currentPage}&limit=10`,
          { cache: "no-store" }
        );
        const data = await res.json();
        const blogData = data.data || data;
        setBlogs(blogData.items || []);
        setTotalPages(blogData.meta?.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [language, currentPage]);

  const goToPage = (page: number) => {
    router.push(`/blogs?page=${page}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">{language === "ar" ? "المدونة" : "Blog"}</h1>
          <p className="text-gray-600 mt-2">
            {language === "ar" ? "اقرأ أحدث المقالات والقصص" : "Read our latest articles and stories"}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{language === "ar" ? "لا توجد مقالات بعد" : "No blog posts yet."}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {blogs.map((b: any) => {
                const title = b.translations?.[0]?.title || "Untitled";
                return (
                  <article
                    key={b.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
                  >
                    <div className="p-6 flex flex-col h-full">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h2>
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-3" dangerouslySetInnerHTML={{ __html: b.translations?.[0]?.content?.substring(0, 150) || "" }}>
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          {new Date(b.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                        </span>
                        <Link
                          href={`/blogs/${b.slug}`}
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

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
      <BlogsContent />
    </Suspense>
  );
}
