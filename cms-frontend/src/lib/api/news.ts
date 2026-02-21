export async function fetchNews(page = 1, limit = 10, search = "") {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") + `/news?${params.toString()}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export async function deleteNews(id: string) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/news/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    let text = "Failed to delete news";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function createNews(payload: any) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/news`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create news");
  return res.json();
}

export async function updateNews(id: string, payload: any) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/news/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update news");
  return res.json();
}

// translations for news
export async function createNewsTranslation(
  id: string,
  lang: string,
  payload: any,
) {
  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") + `/news/${id}/translations`;
  // Backend expects translations as part of PATCH /news/:id payload.
  return updateNews(id, { translations: [{ languageCode: lang, ...payload }] });
}

export async function updateNewsTranslation(
  id: string,
  lang: string,
  payload: any,
) {
  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") +
    `/news/${id}/translations/${lang}`;
  // Replace translations for news by sending translations array in PATCH
  return updateNews(id, { translations: [{ languageCode: lang, ...payload }] });
}
