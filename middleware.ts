import { NextRequest, NextResponse } from "next/server";

const REALM = "Frosted Fork What's Baking Admin";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(request: NextRequest) {
  const adminUser = process.env.WHATS_BAKING_ADMIN_USER || "colleen";
  const adminPassword = process.env.WHATS_BAKING_ADMIN_PASSWORD;

  if (!adminPassword) return unauthorized();

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);

    if (username === adminUser && password === adminPassword) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/whats-baking/:path*"],
};
