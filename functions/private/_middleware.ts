// functions/private/_middleware.ts
interface Env {
  PRIVATE_USER?: string;
  PRIVATE_PASS?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;

  const expectedUser = env.PRIVATE_USER || "kaka";
  const expectedPass = env.PRIVATE_PASS || "kaka123";

  const url = new URL(request.url);

  // Check 1: Cho phép đăng nhập nhanh qua query parameter (tiện lợi cho máy đọc sách):
  // Ví dụ: https://notes.ciquan.org/private/?pass=kaka123
  const queryPass = url.searchParams.get("pass") || url.searchParams.get("key");
  const cookieHeader = request.headers.get("Cookie") || "";
  const hasAuthCookie = cookieHeader.includes("kaka_private_session=authenticated");

  if (queryPass === expectedPass || hasAuthCookie) {
    const response = await next();
    const newHeaders = new Headers(response.headers);
    // Nếu đăng nhập qua query pass, tự động lưu Cookie phiên đăng nhập trong 30 ngày
    if (queryPass === expectedPass) {
      newHeaders.append(
        "Set-Cookie",
        "kaka_private_session=authenticated; Path=/private; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax"
      );
    }
    newHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    newHeaders.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  // Check 2: HTTP Basic Auth (chuẩn native browser popup)
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Basic ")) {
    try {
      const base64 = authHeader.substring(6);
      const decoded = atob(base64);
      const index = decoded.indexOf(":");
      if (index !== -1) {
        const user = decoded.substring(0, index);
        const pass = decoded.substring(index + 1);

        if (user === expectedUser && pass === expectedPass) {
          const response = await next();
          const newHeaders = new Headers(response.headers);
          newHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
          newHeaders.set("X-Robots-Tag", "noindex, nofollow, noarchive");
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        }
      }
    } catch {
      // Decode error
    }
  }

  // Nếu chưa đăng nhập: Trả về 401 mở popup đăng nhập của trình duyệt
  return new Response("Khu vực ghi chú riêng tư. Vui lòng đăng nhập để tiếp tục.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Kaka Private Notes", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
};
