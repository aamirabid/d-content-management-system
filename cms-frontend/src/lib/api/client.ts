export function getAuthToken() {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("d_cms_token");
  } catch (e) {
    return null;
  }
}

export function authHeaders() {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers = Object.assign({}, init.headers || {}, authHeaders());
  const opts = Object.assign({}, init, { headers, credentials: "include" });
  return fetch(input, opts);
}

export function decodeJwt(token?: string) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}
