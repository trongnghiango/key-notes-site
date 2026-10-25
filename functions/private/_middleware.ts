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

  // 1. Kiểm tra tham số password từ URL hoặc Form submit
  const queryPass = url.searchParams.get("pass") || url.searchParams.get("key");
  const cookieHeader = request.headers.get("Cookie") || "";
  const hasAuthCookie = cookieHeader.includes("kaka_private_session=authenticated");

  // Nếu mật khẩu đúng hoặc đã có cookie phiên hợp lệ
  if (queryPass === expectedPass || hasAuthCookie) {
    const response = await next();
    const newHeaders = new Headers(response.headers);
    // Lưu cookie phiên trong 30 ngày (2592000 giây)
    newHeaders.set(
      "Set-Cookie",
      "kaka_private_session=authenticated; Path=/private; Max-Age=2592000; HttpOnly; SameSite=Lax"
    );
    newHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    newHeaders.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  // 2. Kiểm tra HTTP Basic Auth (cho các CLI/cURL hoặc browser popup)
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
          newHeaders.set(
            "Set-Cookie",
            "kaka_private_session=authenticated; Path=/private; Max-Age=2592000; HttpOnly; SameSite=Lax"
          );
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

  // 3. Nếu chưa đăng nhập hoặc nhập sai pass: Trả về trang Lock Screen Omarchy giao diện đẹp
  const hasWrongPass = queryPass && queryPass !== expectedPass;
  const loginHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Khóa Bảo Mật | Kaka Notes</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Iosevka', monospace; }
    body { background-color: #111c18; color: #C1C497; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .card { background-color: #182621; border: 2px solid #32473B; border-radius: 8px; padding: 32px 24px; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 6px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; font-size: 0.85rem; font-weight: bold; margin-bottom: 16px; }
    h1 { font-size: 1.5rem; color: #F7E8B2; margin-bottom: 8px; font-weight: bold; }
    p { font-size: 0.95rem; color: #81B8A8; line-height: 1.6; margin-bottom: 22px; }
    input { width: 100%; padding: 12px 14px; font-size: 1.05rem; border: 1px solid #32473B; background: #0c1512; color: #F7E8B2; border-radius: 6px; margin-bottom: 14px; outline: none; }
    input:focus { border-color: #549e6a; }
    button { width: 100%; padding: 12px; font-size: 1.05rem; font-weight: bold; background: #549e6a; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; }
    button:hover { background: #63b07a; }
    .back { display: inline-block; margin-top: 18px; font-size: 0.9rem; color: #81B8A8; text-decoration: none; }
    .back:hover { color: #549e6a; text-decoration: underline; }
    .error { color: #ef4444; font-size: 0.9rem; margin-bottom: 14px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🔒 PRIVATE VAULT</div>
    <h1>Khu Vực Riêng Tư</h1>
    <p>Trang này chứa ghi chú cá nhân được bảo vệ. Vui lòng nhập mật khẩu để mở khóa.</p>
    ${hasWrongPass ? '<div class="error">❌ Mật khẩu không chính xác. Thử lại!</div>' : ''}
    <form method="GET" action="">
      <input type="password" name="pass" placeholder="Nhập mật khẩu..." autofocus required />
      <button type="submit">Mở khóa 🔓</button>
    </form>
    <a href="/" class="back">&larr; Quay lại Trang chủ</a>
  </div>
</body>
</html>`;

  return new Response(loginHtml, {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
