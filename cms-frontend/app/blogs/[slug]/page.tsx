"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../src/context/LanguageContext";
import Link from "next/link";
import TopNav from "@/src/components/shared/TopNav";

export const dynamic = "force-dynamic";

export default function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { language } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const resolvedParams = await Promise.resolve(params);
        const slug = resolvedParams.slug;
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(
          `${api}/blogs/public/slug/${slug}?language=${language}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setPost(data.data || null);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [language, params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-gray-600">{language === "ar" ? "جاري التحميل..." : "Loading..."}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNav />
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === "ar" ? "المقالة غير موجودة" : "Blog post not found"}
            </h1>
            <Link href="/blogs" className="text-blue-600 hover:text-blue-700">
              {language === "ar" ? "العودة للمدونة" : "Back to blog"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = post.translations?.[0]?.title || "Untitled";
  const content = post.translations?.[0]?.content || "";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav />
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/blogs" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← {language === "ar" ? "العودة للمدونة" : "Back to blog"}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>{new Date(post.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
            {post.author && <span>{post.author.firstName} {post.author.lastName}</span>}
          </div>
        </div>
      </header>

      <article className={`flex-grow max-w-4xl mx-auto px-6 py-12 prose prose-lg max-w-none w-full ${language === "ar" ? "text-right" : ""}`}>
        <div
          className="bg-white p-8 rounded-lg shadow-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
}
