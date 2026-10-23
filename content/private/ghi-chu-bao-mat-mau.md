---
title: "Ghi Chú Bảo Mật Mẫu"
date: 2026-10-23T11:55:00+07:00
draft: false
private: true
build:
  list: never
  render: always
---

Đây là bài viết riêng tư mẫu trong thư mục `content/private/`.

### 🛡️ Tính năng bảo vệ của bài viết này:
1. **Hoàn toàn ẩn khỏi Lists / RSS / Sitemap:** Với `build.list = "never"`, Hugo không bao giờ đưa bài viết này vào RSS feed, trang chủ hay sitemap.
2. **Không lập chỉ mục (Noindex):** Tự động có thẻ meta `robots: noindex, nofollow, noarchive`.
3. **Không Cache tầng mạng:** Cấu hình Cloudflare Headers đặt `Cache-Control: private, no-store`.
4. **Bảo vệ bởi Cloudflare Access:** Bất kỳ ai truy cập đường dẫn `/private/*` đều phải xác thực email OTP trước khi Cloudflare cho phép tải trang.
