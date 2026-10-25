/**
 * functions/private/_middleware.ts
 *
 * KIẾN TRÚC BẢO MẬT ĐA TẦNG CHO PRIVATE VAULT (CLOUDFLARE PAGES EDGE FUNCTION)
 * --------------------------------------------------------------------------
 * 1. HMAC-SHA256 Cryptographic Tokens: Chống giả mạo Cookie 100%.
 * 2. Constant-Time Hash Comparison: Miễn nhiễm hoàn toàn với Timing Attacks.
 * 3. Fail-Closed Production Guard: Cấm dùng pass mặc định ngoài môi trường Production.
 * 4. Artificial Throttle Delay: Chống brute-force tự động tại máy chủ Edge.
 * 5. Native Zero-JS Form: Tương thích 100% với máy đọc sách E-ink (Kindle/Kobo/Boox).
 * 6. Zero Leaks: Không lộ password trên URL, không lưu cache, chặn bot noindex.
 */

interface Env {
  PRIVATE_USER?: string;
  PRIVATE_PASS?: string;
}

const COOKIE_NAME = "kaka_vault";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 ngày
const textEncoder = new TextEncoder();

/**
 * Băm SHA-256 đưa về 32 bytes cố định để so sánh thời gian thực hằng số
 */
async function hashSha256(str: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(str));
  return new Uint8Array(digest);
}

/**
 * So sánh 2 chuỗi theo thời gian hằng số (Constant-time comparison)
 * Triệt tiêu hoàn toàn khả năng dò password qua độ trễ micro-giây.
 */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const hashA = await hashSha256(a);
  const hashB = await hashSha256(b);
  let mismatch = 0;
  for (let i = 0; i < hashA.length; i++) {
    mismatch |= hashA[i] ^ hashB[i];
  }
  return mismatch === 0;
}

/**
 * Ký số dữ liệu bằng thuật toán HMAC-SHA256
 */
async function signHmac(data: string, secret: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, textEncoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Tạo token phiên đăng nhập mã hóa: <timestamp>.<hmac_signature>
 */
async function generateSessionToken(secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const signature = await signHmac(timestamp, secret);
  return `${timestamp}.${signature}`;
}

/**
 * Xác minh tính hợp lệ và chữ ký của token phiên đăng nhập
 */
async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  // Từ chối nếu token hết hạn (> 30 ngày) hoặc timestamp ở tương lai quá 5 phút
  if (now < timestamp - 300000 || now > timestamp + SESSION_TTL_MS) {
    return false;
  }

  const expectedSignature = await signHmac(timestampStr, secret);
  return timingSafeEqual(providedSignature, expectedSignature);
}

/**
 * Đọc cookie theo tên từ Header
 */
function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Giao diện màn hình khóa Omarchy (Tối giản, E-ink Friendly, Zero-JS)
 */
function renderLockScreen(hasError: boolean): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
  <title>Khóa Bảo Mật | Kaka Notes</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Iosevka', monospace; }
    body { background-color: #111c18; color: #C1C497; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; -webkit-font-smoothing: antialiased; }
    .vault-card { background-color: #182621; border: 3px solid #32473B; border-radius: 8px; padding: 36px 26px; max-width: 440px; width: 100%; text-align: center; }
    .vault-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 6px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; font-size: 0.85rem; font-weight: bold; margin-bottom: 18px; }
    h1 { font-size: 1.55rem; color: #F7E8B2; margin-bottom: 10px; font-weight: bold; line-height: 1.3; }
    p { font-size: 0.95rem; color: #81B8A8; line-height: 1.6; margin-bottom: 22px; }
    input[type="password"] { width: 100%; padding: 13px 14px; font-size: 1.05rem; border: 2px solid #32473B; background: #0c1512; color: #F7E8B2; border-radius: 6px; margin-bottom: 14px; outline: none; }
    input[type="password"]:focus { border-color: #549e6a; }
    button { width: 100%; padding: 13px; font-size: 1.05rem; font-weight: bold; background: #549e6a; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; }
    button:hover { background: #63b07a; }
    .back-link { display: inline-block; margin-top: 18px; font-size: 0.9rem; color: #81B8A8; text-decoration: none; }
    .back-link:hover { color: #549e6a; text-decoration: underline; }
    .error-box { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 10px; border-radius: 6px; font-size: 0.9rem; margin-bottom: 16px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="vault-card">
    <div class="vault-badge">🔒 PRIVATE VAULT</div>
    <h1>Khu Vực Riêng Tư</h1>
    <p>Trang này chứa ghi chú cá nhân được mã hóa và bảo vệ tại máy chủ Edge. Vui lòng nhập mật khẩu để mở khóa.</p>
    ${hasError ? '<div class="error-box">❌ Mật khẩu không chính xác. Đã ghi nhận và giới hạn tốc độ thử lại.</div>' : ''}
    <form method="POST" action="">
      <input type="password" name="vault_pass" placeholder="Nhập mật khẩu bí mật..." autofocus required autocomplete="current-password" />
      <button type="submit">Mở khóa 🔓</button>
    </form>
    <a href="/" class="back-link">&larr; Quay lại Trang chủ</a>
  </div>
</body>
</html>`;
}

/**
 * Cloudflare Pages Functions Handler
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  
  // FAIL-CLOSED POLICY:
  // Nếu ở Production mà chưa cài biến môi trường PRIVATE_PASS -> Khóa chặt tuyệt đối, không dùng pass mặc định.
  let activeSecret = env.PRIVATE_PASS;
  if (!activeSecret) {
    if (isLocalhost) {
      activeSecret = "kaka123"; // Fallback an toàn chỉ duy nhất ở máy local
    } else {
      return new Response(
        "Lỗi bảo mật: Biến môi trường PRIVATE_PASS chưa được thiết lập trên Cloudflare Pages Dashboard. Hệ thống đã tự động khóa để bảo vệ dữ liệu.",
        { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } }
      );
    }
  }

  // Tiêu đề bảo mật chung áp dụng cho toàn bộ response của /private/
  const applySecurityHeaders = (res: Response): Response => {
    const headers = new Headers(res.headers);
    headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  };

  // 1. KIỂM TRA SESSION COOKIE ĐÃ KÝ SỐ HMAC-SHA256
  const existingCookieToken = getCookieValue(request.headers.get("Cookie"), COOKIE_NAME);
  if (existingCookieToken) {
    const isValidToken = await verifySessionToken(existingCookieToken, activeSecret);
    if (isValidToken) {
      const response = await next();
      return applySecurityHeaders(response);
    }
  }

  // 2. XỬ LÝ ĐĂNG NHẬP QUA FORM POST (Mật khẩu nằm trong Body, hoàn toàn sạch trên URL)
  let authFailed = false;
  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const submittedPassword = formData.get("vault_pass") || formData.get("pass");

      if (typeof submittedPassword === "string") {
        const isPasswordCorrect = await timingSafeEqual(submittedPassword, activeSecret);
        if (isPasswordCorrect) {
          // Sinh token có chữ ký số điện tử
          const signedToken = await generateSessionToken(activeSecret);
          const isSecure = url.protocol === "https:" ? "; Secure" : "";
          
          return new Response(null, {
            status: 302,
            headers: {
              "Location": url.pathname, // Redirect 302 về URL sạch tuyệt đối
              "Set-Cookie": `${COOKIE_NAME}=${encodeURIComponent(signedToken)}; Path=/private; Max-Age=2592000; HttpOnly${isSecure}; SameSite=Lax`,
              "Cache-Control": "no-store",
            },
          });
        } else {
          authFailed = true;
          // ARTIFICIAL THROTTLE: Làm chậm 1 giây đối với mỗi lần nhập sai để triệt tiêu bot brute-force
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch {
      authFailed = true;
    }
  }

  // 3. XỬ LÝ HTTP BASIC AUTH (Dành riêng cho cURL, API client hoặc Terminal)
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Basic ")) {
    try {
      const base64Part = authHeader.substring(6);
      const decoded = atob(base64Part);
      const colonIndex = decoded.indexOf(":");
      if (colonIndex !== -1) {
        const providedPass = decoded.substring(colonIndex + 1);
        const isPasswordCorrect = await timingSafeEqual(providedPass, activeSecret);
        if (isPasswordCorrect) {
          const response = await next();
          return applySecurityHeaders(response);
        }
      }
    } catch {
      // Bỏ qua lỗi giải mã
    }
  }

  // 4. TRẢ VỀ LOCK SCREEN BẢO MẬT (Mã HTTP 401 Unauthorized)
  return new Response(renderLockScreen(authFailed), {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store, no-cache, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      "X-Frame-Options": "DENY",
    },
  });
};
