import { NextResponse } from "next/server";

export async function GET() {
  // Simple mock /me for local development. In production your backend should provide this.
  const user = {
    id: "u_1",
    email: "admin@example.com",
    name: "Admin",
    roles: ["admin"],
    permissions: ["blog.*", "user.*", "role.*"],
  };
  return NextResponse.json(user);
}
