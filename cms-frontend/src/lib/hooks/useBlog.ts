"use client";
import { useEffect, useState } from "react";
import { getBlogs, getPublicBlogBySlug } from "../api/blog";

export function useBlogBySlug(slug: string, lang = "en") {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPublicBlogBySlug(slug, lang)
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err as Error);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug, lang]);

  return { data, loading, error };
}
