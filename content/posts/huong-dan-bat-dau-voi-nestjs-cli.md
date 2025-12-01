+++
title = 'TÀI LIỆU TOÀN TẬP VỀ NESTJS CLI'
description = ""
date = '2025-12-01T20:15:09+07:00'
image = ""
imageBig = ""
authors = ["Kaka"]
tags = []
categories = ["backend", "server"]
draft = false
toc = true
+++

## 1. Cài đặt và Kiểm tra

Trước khi bắt đầu, bạn cần cài đặt CLI ở phạm vi toàn cầu (global).

- **Cài đặt:**
  ```bash
  npm install -g @nestjs/cli
  ```
- **Kiểm tra version:**
  ```bash
  nest --version
  ```
- **Xem trợ giúp tổng quát:**
  ```bash
  nest --help
  ```

---

## 2. Tạo Dự án (Scaffolding)

Lệnh `new` dùng để khởi tạo một dự án mới hoàn toàn.

### Cú pháp cơ bản

```bash
nest new <project-name>
```

### Các tùy chọn (Options) thường dùng

| Cờ (Flag)               | Mô tả                                                      |
| :---------------------- | :--------------------------------------------------------- |
| `--strict`              | Bật chế độ strict mode của TypeScript ngay từ đầu.         |
| `--skip-git`            | Không khởi tạo Git repository (`.git`).                    |
| `--package-manager npm` | Chỉ định dùng `npm`, `yarn` hoặc `pnpm` (bỏ qua bước hỏi). |
| `--language js`         | Tạo dự án bằng JavaScript thuần (mặc định là TypeScript).  |

**Ví dụ:**

```bash
nest new my-app --strict --package-manager pnpm
```

---

## 3. Chạy ứng dụng (Development)

Lệnh `start` dùng để chạy ứng dụng trong môi trường development.

| Lệnh                                                          | Mô tả                                                         |
| :------------------------------------------------------------ | :------------------------------------------------------------ |
| `nest start`                                                  | Chạy ứng dụng một lần (cần chạy lại nếu sửa code).            |
| `nest start --watch`                                          | **(Hay dùng nhất)** Tự động restart server khi file thay đổi. |
| `nest start --debug --watch`                                  | Chạy chế độ watch + kích hoạt debug (mặc định port 9229).     |
| `nest start --exec "node -r ts-node/register/transpile-only"` | Chạy với lệnh thực thi tùy chỉnh (dùng khi build chậm).       |

---

## 4. Generators (Tạo file tự động)

Đây là tính năng mạnh nhất của NestJS CLI. Lệnh `generate` (viết tắt là `g`) giúp tạo các thành phần theo đúng cấu trúc NestJS.

### Cú pháp

```bash
nest generate <schematic> <name> [options]
# Hoặc viết tắt
nest g <schematic> <name> [options]
```

### Bảng các Schematic phổ biến

| Tên đầy đủ     | Viết tắt  | Mô tả                       | Ví dụ                                              |
| :------------- | :-------- | :-------------------------- | :------------------------------------------------- |
| `module`       | `mo`      | Tạo Module mới              | `nest g mo users`                                  |
| `controller`   | `co`      | Tạo Controller              | `nest g co users`                                  |
| `service`      | `s`       | Tạo Service                 | `nest g s users`                                   |
| `class`        | `cl`      | Tạo Class thường            | `nest g cl users/dto/create-user`                  |
| `interface`    | `in`      | Tạo Interface               | `nest g in users/interfaces/user`                  |
| `dto`          | -         | Tạo DTO (nếu có cài plugin) | `nest g class users/dto/create-user.dto --no-spec` |
| `guard`        | `gu`      | Tạo Guard                   | `nest g gu auth/guards/jwt`                        |
| `middleware`   | `mi`      | Tạo Middleware              | `nest g mi logger`                                 |
| `pipe`         | `pi`      | Tạo Pipe (validation)       | `nest g pi validation`                             |
| `interceptor`  | `it`      | Tạo Interceptor             | `nest g it logging`                                |
| `decorator`    | `d`       | Tạo Custom Decorator        | `nest g d auth/user`                               |
| `filter`       | `f`       | Tạo Exception Filter        | `nest g f http-exception`                          |
| `gateway`      | `ga`      | Tạo WebSocket Gateway       | `nest g ga chat`                                   |
| `resolver`     | `r`       | Tạo GraphQL Resolver        | `nest g r users`                                   |
| **`resource`** | **`res`** | **Tạo trọn bộ CRUD**        | `nest g res products`                              |

### Các cờ (Flags) quan trọng cho lệnh Generate

Những cờ này áp dụng cho hầu hết các lệnh `nest g`.

1.  **`--dry-run` (hoặc `-d`)**:

    - **Tác dụng:** Chạy thử lệnh nhưng **không** tạo file thật. Chỉ in ra danh sách file sẽ được tạo.
    - **Khi nào dùng:** Luôn dùng khi bạn không chắc cấu trúc file sinh ra sẽ nằm ở đâu.
    - `nest g s users -d`

2.  **`--no-spec`**:

    - **Tác dụng:** Không tạo file test (`.spec.ts`).
    - **Khi nào dùng:** Khi làm dự án nhỏ hoặc tạo DTO/Entity không cần unit test.
    - `nest g s users --no-spec`

3.  **`--flat`**:

    - **Tác dụng:** Không tạo thư mục con bọc ngoài.
    - **Ví dụ:** `nest g s auth --flat` sẽ tạo `auth.service.ts` ngay tại thư mục hiện tại thay vì tạo `auth/auth.service.ts`.

4.  **`--project` (Dùng cho Monorepo)**:
    - **Tác dụng:** Chỉ định app hoặc library nào trong Monorepo để tạo file vào.
    - `nest g mo users --project my-app-2`

---

## 5. Trường hợp đặc biệt: `nest g resource`

Lệnh này đặc biệt hữu ích để tạo **REST API** hoặc **GraphQL** nhanh chóng.

```bash
nest g res users
```

Khi chạy lệnh này, CLI sẽ hỏi:

1.  **Transport layer:** (REST API, GraphQL Code First, GraphQL Schema First, Microservice, WebSocket).
2.  **Generate entry points?**: Có muốn tạo sẵn các hàm CRUD (Create, Read, Update, Delete) không.

Kết quả: Nó tự động tạo Module, Controller, Service, DTO, Entity và test cho `users`.

---

## 6. Build & Production

Lệnh `build` biên dịch TypeScript sang JavaScript (thư mục `dist`) để deploy.

| Lệnh                   | Mô tả                                                                        |
| :--------------------- | :--------------------------------------------------------------------------- |
| `nest build`           | Build ứng dụng mặc định.                                                     |
| `nest build app-name`  | Build một ứng dụng cụ thể trong Monorepo.                                    |
| `nest build --webpack` | Dùng Webpack để build (thường dùng cho HMR - Hot Module Replacement).        |
| `nest build --tsc`     | Dùng trình biên dịch TypeScript chuẩn (mặc định từ v9 trở lên dùng SWC/TSC). |

---

## 7. Các lệnh tiện ích khác

### `nest info`

Hiển thị thông tin hệ thống, version Node.js, NestJS CLI và các dependencies. Dùng khi báo lỗi (submit issue).

### `nest update`

Cập nhật các package của NestJS (@nestjs/core, @nestjs/common...) lên bản mới nhất.

```bash
nest update
nest update --force # Ép cập nhật
```

### `nest add`

Cài đặt và tự động cấu hình một thư viện bên thứ 3 (nếu thư viện đó hỗ trợ schematic).

```bash
nest add @nestjs/swagger # Tự động cài swagger và config vào main.ts
```

---

## 8. Làm việc với Monorepo (Workspace)

NestJS hỗ trợ chế độ Monorepo (nhiều apps và libs trong một project).

### Chuyển project thường sang Monorepo

```bash
nest new my-workspace
# Sau đó bên trong workspace:
nest g app my-app-2
nest g app admin-portal
```

### Tạo Library (Thư viện dùng chung)

```bash
nest g library my-shared-lib
```

- `nest g lib` sẽ tạo thư mục trong `libs/`.
- Dùng `@app/my-shared-lib` để import vào các app khác.

---

## 9. Tóm tắt cấu trúc lệnh (Cheat Sheet)

```bash
# Tạo dự án
nest new <tên-app>

# Chạy dev
nest start --watch

# Tạo Controller (không test)
nest g co users --no-spec

# Tạo Service (không tạo folder con)
nest g s auth --flat

# Tạo trọn bộ CRUD
nest g res products

# Xem trước kết quả (An toàn nhất)
nest g mo payments --dry-run

# Build production
nest build
```

## 10. File cấu hình `nest-cli.json`

Mọi hành vi của CLI được cấu hình trong file này tại root dự án.

- `sourceRoot`: Thư mục chứa code (thường là `src`).
- `entryFile`: File chạy chính (thường là `main`).
- `monorepo`: `true` nếu là monorepo.
- `compilerOptions`: Cấu hình builder (webpack hay tsc), plugins (tự động thêm swagger decorators...).

**Mẹo:** Để xem danh sách đầy đủ nhất tại thời điểm hiện tại, bạn hãy gõ lệnh:

```bash
nest g --help
```
