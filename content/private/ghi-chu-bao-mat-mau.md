---
title: "Ghi Chú Bảo Mật Mẫu"
date: 2026-10-23T11:55:00+07:00
draft: false
private: true
build:
  list: local
  render: always
---

Đây là bài viết riêng tư mẫu trong thư mục `content/private/`.

### 🛡️ Tính năng bảo vệ của bài viết này:
1. **Chỉ hiển thị cục bộ tại `/private/`:** Với `build.list = "local"`, bài viết chỉ hiện trong danh sách riêng tại `/private/`, không bao giờ lọt ra trang chủ, RSS hay Sitemap.
2. **Không lập chỉ mục (Noindex):** Tự động có thẻ meta `robots: noindex, nofollow, noarchive`.
3. **Bảo vệ bởi Cloudflare Function:** Bất kỳ ai truy cập `/private/*` đều phải có mật khẩu hoặc phiên đăng nhập hợp lệ.
