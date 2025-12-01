+++
title = 'Nest Tip Cac Cach Su Dung Middleware Trong Nest'
description = ""
date = '2025-12-02T06:01:28+07:00'
image = ""
imageBig = ""
authors = ["Kaka"]
tags = []
categories = ["nestjs", "server", "api"]
draft = false
toc
+++

---

## 1. Middleware là gì?

Middleware là một hàm được gọi **trước** route handler. Nó có quyền truy cập vào đối tượng `Request`, `Response` và hàm `next()`.

**Nhiệm vụ chính:**

- Thay đổi request/response object (ví dụ: gắn thêm user vào request).
- Kết thúc request sớm (trả về response ngay lập tức mà không vào Controller).
- Ghi log, nén data, bảo mật (Helmet, CORS...).

---

## 2. Cách 1: Class Middleware (Khuyên dùng)

Cách này chuẩn NestJS, hỗ trợ **Dependency Injection (DI)** (tức là có thể Inject Service khác vào trong Middleware để dùng).

### Bước 1: Tạo file `src/common/middleware/logger.middleware.ts`

```typescript
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Có thể inject service vào đây nếu cần
  // constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[Request] ${req.method} ${req.path}`);

    // Logic xử lý ở đây...
    // const user = this.authService.validate(req);

    // QUAN TRỌNG: Phải gọi next() để đi tiếp sang bước sau (Guard/Controller)
    // Nếu không gọi next(), request sẽ bị treo mãi mãi.
    next();
  }
}
```

### Bước 2: Đăng ký trong Module (Consumer)

Middleware **không** được khai báo trong mảng `providers` của Module. Nó phải dùng method `configure`.

Vào `app.module.ts` (hoặc module nào bạn muốn áp dụng):

```typescript
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { UsersController } from "./users/users.controller";

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // <--- 1. Implement NestModule
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // 2. Áp dụng Middleware nào
      .exclude(
        { path: "auth", method: RequestMethod.GET } // Loại trừ route cụ thể
      )
      .forRoutes(
        // Áp dụng cho toàn bộ Controller Users
        UsersController,
        // Hoặc route cụ thể
        { path: "cats", method: RequestMethod.ALL }
      );
  }
}
```

---

## 3. Cách 2: Functional Middleware (Đơn giản)

Nếu Middleware của bạn rất đơn giản, không cần dependencies (không cần Inject Service), hãy dùng Function cho gọn.

### Bước 1: Tạo function

```typescript
// src/common/middleware/logger.func.ts
import { Request, Response, NextFunction } from "express";

export function loggerFunctional(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`Request...`);
  next();
}
```

### Bước 2: Đăng ký trong Module

Cách làm y hệt Class Middleware:

```typescript
consumer.apply(loggerFunctional).forRoutes("cats");
```

---

## 4. Cách 3: Global Middleware (Toàn cục)

Nếu muốn áp dụng cho **toàn bộ** ứng dụng ngay từ đầu.

### Khai báo trong `main.ts`

```typescript
// main.ts
import { loggerFunctional } from "./common/middleware/logger.func";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Dùng Functional Middleware (Cách phổ biến nhất cho global)
  app.use(loggerFunctional);

  // Lưu ý: Class Middleware KHÔNG thể dùng app.use() nếu class đó cần DI (Inject Service).
  // Nếu muốn dùng Class Middleware Global có DI, bạn phải đăng ký trong AppModule với .forRoutes('*')

  await app.listen(3000);
}
bootstrap();
```

---

## 5. Các kịch bản sử dụng (Scenarios)

### Kịch bản A: Áp dụng cho nhiều Route, trừ phần Auth

Bạn muốn log tất cả request hoặc check header, nhưng trừ trang login/register.

```typescript
configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(LoggerMiddleware)
    .exclude(
      { path: 'auth/login', method: RequestMethod.POST },
      'auth/register'
    )
    .forRoutes('*'); // Dấu * đại diện cho tất cả
}
```

### Kịch bản B: Sử dụng thư viện Express có sẵn (Helmet, Morgan, Cors)

NestJS tương thích hoàn toàn với hệ sinh thái Middleware của Express.

```bash
npm i helmet morgan
```

Trong `main.ts`:

```typescript
import * as helmet from "helmet";
import * as morgan from "morgan";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet()); // Bảo mật HTTP headers
  app.use(morgan("dev")); // Logger xịn xò của Express

  await app.listen(3000);
}
```

---

## 6. Tổng kết: Khi nào dùng cái nào?

| Loại                      | Đặc điểm                                                 | Khi nào dùng?                                                                          |
| :------------------------ | :------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Class Middleware**      | Hỗ trợ DI (Inject Service), `implements NestMiddleware`. | Khi logic middleware phức tạp, cần gọi Database, ConfigService, hoặc các Service khác. |
| **Functional Middleware** | Chỉ là hàm thuần túy, nhanh, gọn.                        | Khi logic đơn giản (Logger, đổi Header), không cần gọi Service nào khác.               |
| **Global Middleware**     | Đăng ký ở `main.ts`.                                     | Dùng cho thư viện bên thứ 3 (Helmet, Cors, BodyParser) hoặc Logger chung.              |

**Lưu ý quan trọng:** Đừng nhầm lẫn Middleware với Guards.

- Nếu bạn cần xác thực (Authentication/Authorization) -> Hãy dùng **Guards**.
- Nếu bạn cần sửa đổi request/response hoặc log -> Hãy dùng **Middleware**.
