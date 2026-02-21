"use client";
import { useEffect, useState } from "react";
import { fetchUsers } from "../api/user.api";

export function useUsers(page = 1, limit = 10, search = "") {
  const [data, setData] = useState<any>({
    items: [],
    meta: { page: 1, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchUsers(page, limit, search)
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
  }, [page, limit, search]);

  return { data, loading, error };
}
