import { User } from "../../types/user";

export async function fetchUsers(page = 1, limit = 10, search = "") {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") + `/users?${params.toString()}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url);
  if (!res.ok) {
    let text = "Failed to fetch users";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function updateUser(id: string, payload: Partial<User>) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/users/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = "Failed to update user";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function createUser(
  payload: Partial<User> & { password?: string },
) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/users`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = "Failed to create user";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/users/${id}/status`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) throw new Error("Failed to update user status");
  return res.json();
}
