"use client";
import { useEffect, useState } from "react";
import type { BlogQuery } from "../api/blog";
import { getBlogs } from "../api/blog";

export function useBlogs(query: BlogQuery = { page: 1, limit: 10 }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getBlogs(query)
      .then((res) => {
        if (!mounted) return;
        setData(res.data || res);
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
  }, [JSON.stringify(query)]);

  return { data, loading, error };
}
