/**
 * Proxy (Next 16's name for middleware) for /sessions/<id>. It only ever
 * returns a final response or passes through: NO rewrites, NO redirects.
 *
 * 1. Malformed percent-encoding ("%ZZ", "%E0%A4%A") -> 400.
 *    Next 16.4.2 otherwise answers a param it cannot decode with a bare 500
 *    (its router tries to render a "/400" page an App Router app lacks).
 *
 * 2. Case variants of a real session ID ("C0A8E1F2B3D4") -> 404.
 *    Session IDs are exact and case-sensitive. But Next serves known sessions
 *    from files under .next/server/route-cache/, looked up by URL path. On a
 *    case-insensitive filesystem (macOS APFS default, Windows NTFS) the
 *    uppercase path opens the lowercase session's cached file, so it was served
 *    as a 200 cache hit without the page's exact-match check ever running. This
 *    check runs before that cache lookup. Exact IDs pass untouched; nothing is
 *    normalized.
 *
 * Every other ID (known, or unknown with no case-insensitive twin) passes
 * through; the page returns 200 or a real, themed 404 (app/sessions/[id]/page.tsx).
 *
 * Why no rewrites: a rewrite built from request.url carries host "localhost";
 * under `next start --hostname 127.0.0.1` Next treats it as external and
 * proxies it over HTTP back to itself, which looped. Direct responses avoid that.
 *
 * Phase 2: replace the mock ID sets with an exact + case-insensitive lookup
 * against the session store.
 */
import { NextResponse, type NextRequest } from "next/server";
import { mockSessions } from "@/mock/sessions";

export const config = {
  matcher: "/sessions/:id",
};

const KNOWN_IDS = new Set(mockSessions.map((s) => s.sessionId));
// Lowercased forms, to spot case variants. Real IDs are lowercase hex, whose
// only case partners are A-F, so toLowerCase() covers what the filesystem folds.
const KNOWN_IDS_FOLDED = new Set(mockSessions.map((s) => s.sessionId.toLowerCase()));

const TEXT_HEADERS = { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" };

/** The decoded [id] segment, or null if its percent-encoding is malformed. */
function decodedId(pathname: string): string | null {
  try {
    return decodeURIComponent(pathname.slice("/sessions/".length));
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const id = decodedId(request.nextUrl.pathname);

  if (id === null) {
    return new NextResponse("400 Bad Request: malformed URL encoding\n", { status: 400, headers: TEXT_HEADERS });
  }

  // The requested ID is never echoed back, so nothing user-supplied is reflected.
  if (!KNOWN_IDS.has(id) && KNOWN_IDS_FOLDED.has(id.toLowerCase())) {
    return new NextResponse("404 Not Found: session IDs are case-sensitive\n", { status: 404, headers: TEXT_HEADERS });
  }

  return NextResponse.next();
}
