import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Ambil token dari cookies browser
  const token = request.cookies.get("token")?.value;

  // 2. Cek apakah user sedang membuka halaman login
  const isLoginPage = request.nextUrl.pathname === "/login";

  // 3. LOGIKA PENGAMANAN:

  // A. Jika TIDAK ADA token DAN mencoba buka halaman SELAIN login
  //    -> Tendang paksa ke halaman login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // B. Jika SUDAH ADA token DAN mencoba buka halaman login
  //    -> Tendang balik ke Dashboard (karena sudah login ngapain login lagi?)
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang dijaga oleh satpam ini
export const config = {
  matcher: [
    /*
     * Match semua request paths kecuali:
     * - api (route handler internal nextjs)
     * - _next/static (file statis)
     * - _next/image (gambar)
     * - favicon.ico (icon website)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
