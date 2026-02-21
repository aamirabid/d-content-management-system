export async function fetchRoles(page = 1, limit = 10, search = "") {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") + `/roles?${params.toString()}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url);
  if (!res.ok) {
    let text = "Failed to fetch roles";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function createRole(payload: any) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/roles`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = "Failed to create role";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function updateRole(id: string, payload: any) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/roles/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = "Failed to update role";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function deleteRole(id: string) {
  const url = (process.env.NEXT_PUBLIC_API_URL || "") + `/roles/${id}`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    let text = "Failed to delete role";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}

export async function setRolePermissions(id: string, permissionIds: string[]) {
  const url =
    (process.env.NEXT_PUBLIC_API_URL || "") + `/roles/${id}/permissions`;
  const { authFetch } = await import("./client");
  const res = await authFetch(url, {
    method: "PATCH",
    body: JSON.stringify({ permissionIds }),
  });
  if (!res.ok) {
    let text = "Failed to set role permissions";
    try {
      const j = await res.json();
      text = j?.message || j?.error || JSON.stringify(j) || text;
    } catch (e) {}
    throw new Error(text);
  }
  return res.json();
}
