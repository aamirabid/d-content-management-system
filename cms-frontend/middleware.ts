import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Allow all requests - authentication is handled by AdminLayout component
  // which checks localStorage for token on the client side
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
