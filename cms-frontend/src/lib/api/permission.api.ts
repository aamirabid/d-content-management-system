export async function fetchPermissions(page = 1, limit = 10, search = "") {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") +
    `/permissions?${params.toString()}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch permissions");
  const json = await res.json();
  if (Array.isArray(json)) {
    return { items: json, meta: { page, totalPages: 1 } };
  }
  return json;
}

export async function createPermission(payload: any) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/permissions`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create permission");
  return res.json();
}

export async function updatePermission(id: string, payload: any) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/permissions/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update permission");
  return res.json();
}

export async function deletePermission(id: string) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/permissions/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete permission");
  return res.json();
}
