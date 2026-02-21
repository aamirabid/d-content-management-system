import { User } from "../../types/user";

export function hasPermission(
  user: User | null | undefined,
  permissionKey: string,
): boolean {
  if (!user) return false;
  const perms = user.permissions || [];
  // simple wildcard support: `blog.*` matches `blog.create`
  if (perms.includes(permissionKey)) return true;
  const parts = permissionKey.split(".");
  for (const p of perms) {
    if (p.endsWith(".*")) {
      const base = p.replace(/\.\*$/, "");
      if (permissionKey.startsWith(base + ".")) return true;
    }
  }
  return false;
}
