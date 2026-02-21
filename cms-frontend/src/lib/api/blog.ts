export type BlogQuery = {
  page?: number;
  limit?: number;
  lang?: string;
  published?: boolean;
  search?: string;
};

export async function getBlogs(q: BlogQuery = {}) {
  const params = new URLSearchParams();
  if (q.page) params.set("page", String(q.page));
  if (q.limit) params.set("limit", String(q.limit));
  if (q.lang) params.set("lang", q.lang);
  if (q.published !== undefined) params.set("published", String(q.published));
  if (q.search) params.set("search", q.search);

  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") +
    "/blogs" +
    (params.toString() ? `?${params.toString()}` : "");
  const { authFetch } = await import("./client");
  const res = await authFetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function getPublicBlogBySlug(slug: string, lang = "en") {
  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") +
    `/blogs/public?language=${encodeURIComponent(lang)}&limit=100`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const list = await res.json();
  const found = (list.items || list).find(
    (b: any) =>
      b.slug === slug ||
      (b.translations || []).some(
        (t: any) => t.languageCode === lang && (t.slug === slug || false),
      ),
  );
  if (!found) throw new Error("Blog not found");
  return found;
}

export async function createBlog(payload: any) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/blogs`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = "Failed to create blog";
    try {
      const j = await res.json();
      text = j?.message || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function updateBlog(id: string, payload: any) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/blogs/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = "Failed to update blog";
    try {
      const j = await res.json();
      text = j?.message || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function deleteBlog(id: string) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/blogs/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    let text = "Failed to delete blog";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function setBlogPublished(id: string, published: boolean) {
  // backend expects patch with status/publishedAt
  const payload: any = { status: published ? "published" : "draft" };
  if (published) payload.publishedAt = new Date().toISOString();
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/blogs/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = "Failed to set published";
    try {
      const j = await res.json();
      text = j?.message || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}
