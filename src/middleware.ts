// middleware file for nextjs
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const publicURL = ["/login", "/signup", "/"];

export async function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const token = await getToken({ req: request });
  const url = request.nextUrl.pathname;

  if (
    (token && publicURL.includes(url)) ||
    (token && url.startsWith("/verify"))
  ) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!token && url.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If authenticated, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

//TODO check back matcher if some error occured
