import { User } from "../../types/user";

export async function getMe(): Promise<User | null> {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "") + "/me", {
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}
