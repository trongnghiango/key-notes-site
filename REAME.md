# README

## 1. Tạo bài viết mới

Sử dụng lệnh Hugo để tạo bài viết mới:

```bash
hugo new posts/ten-bai-viet.md
```

Hoặc nếu bạn muốn tạo trong thư mục con:

```bash
hugo new posts/thu-muc/ten-bai-viet.md
```

## 2. Cấu trúc front matter mặc định

Khi tạo bài viết, Hugo sẽ tự động tạo front matter như sau:

```yaml
---
title: "Tên Bài Viết"
date: 2024-01-01T10:00:00+07:00
draft: true
---
```

## 3. Front matter đầy đủ (tuỳ chọn)

Bạn có thể thêm các trường khác vào front matter:

```yaml
---
title: "Tiêu đề bài viết"
date: 2024-01-01T10:00:00+07:00
lastmod: 2024-01-02T15:30:00+07:00
draft: false
author: "Tên tác giả"
description: "Mô tả ngắn về bài viết"
categories:
  - "Web Development"
  - "Hugo"
tags:
  - "hugo"
  - "blog"
  - "static-site"
keywords: ["hugo", "blog", "static site generator"]
slug: "ten-bai-viet-friendly"
image: "/images/featured-image.jpg"
---
```

## 4. Viết nội dung

Sau front matter, bạn viết nội dung bằng Markdown:

```markdown
# Đây là tiêu đề H1

## Đây là tiêu đề H2

Đoạn văn bản thông thường với **in đậm** và *in nghiêng*.

### Danh sách không thứ tự
- Mục 1
- Mục 2
- Mục 3

### Danh sách có thứ tự
1. Bước 1
2. Bước 2
3. Bước 3

### Code block
```python
def hello_world():
    print("Hello, World!")
```

### Link
[Google](https://google.com)

### Hình ảnh
![Mô tả ảnh](/images/example.jpg)
```

## 5. Xuất bản bài viết

Khi đã hoàn thành, đổi trạng thái `draft` thành `false`:

```yaml
draft: false
```

Hoặc xoá dòng draft nếu không cần thiết.

## 6. Xem trước bài viết

Chạy server development để xem trước:

```bash
hugo server -D
```

Tham số `-D` để hiển thị cả bài viết draft.

## 7. Build site

Khi đã sẵn sàng, build site:

```bash
hugo
```

## Ví dụ hoàn chỉnh

```markdown
---
title: "Hướng dẫn sử dụng Hugo"
date: 2024-01-01T10:00:00+07:00
draft: false
author: "Your Name"
categories: ["Tutorial"]
tags: ["hugo", "blog"]
description: "Bài viết hướng dẫn sử dụng Hugo để tạo blog cá nhân"
---

# Chào mừng đến với Hugo!

Hugo là một static site generator mạnh mẽ và nhanh chóng.

## Ưu điểm của Hugo

- Tốc độ build cực nhanh
- Cú pháp đơn giản
- Hỗ trợ Markdown
- Cộng đồng lớn

## Cài đặt Hugo

```bash
# Trên macOS
brew install hugo

# Trên Windows
choco install hugo
```

Bắt đầu với Hugo ngay hôm nay!
```


