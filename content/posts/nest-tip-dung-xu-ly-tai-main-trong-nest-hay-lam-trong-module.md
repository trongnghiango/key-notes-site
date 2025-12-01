+++
title = '[NestJS Tips] Đừng "nhét" tất cả vào main.ts nếu muốn Scale hệ thống!'
description = ""
date = '2025-12-01T22:22:56+07:00'
image = ""
imageBig = ""
authors = ["Kaka"]
tags = []
categories = ["nestjs"]
draft = false
+++

Khi mới học NestJS, chúng ta thường thấy các tutorial hướng dẫn đăng ký Global Pipes, Interceptors hay Filters ngay trong file `main.ts` như thế này:

```typescript
// main.ts - Cách làm thường thấy (nhưng chưa tối ưu)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Đăng ký thủ công
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector())); // Phải new tay

  await app.listen(3000);
}
```

Cách này chạy ổn với dự án nhỏ (pet project). Nhưng khi hệ thống cần mở rộng (Scale) hoặc cần logic phức tạp hơn, cách làm này sẽ bộc lộ điểm yếu chết người.

Hôm nay mình sẽ chia sẻ một **Architectural Decision** (quyết định kiến trúc) giúp code của bạn Clean, Scalable và tận dụng tối đa sức mạnh của NestJS.

## 1. Tại sao KHÔNG NÊN đăng ký ở `main.ts`?

Nếu bạn định hướng làm dự án lớn, hãy tránh `main.ts` vì 3 lý do:

### 1. **Mất tính năng Dependency Injection (DI):** Đây là điểm yếu lớn nhất. File `main.ts` nằm ngoài context của Module. Bạn không thể Inject các Service khác vào Interceptor/Filter.

    - _Ví dụ:_ Bạn muốn Inject `ConfigService` vào Filter để bật tắt log lỗi tùy môi trường? Hoặc Inject `SlackService` để bắn thông báo khi có lỗi 500? Làm ở `main.ts` là chịu chết (hoặc rất cực).

### 2. **Khó Testing:** Việc gắn cứng instance (từ khóa `new`) trong `main.ts` khiến việc viết Integration Test trở nên khó khăn.

### 3. **Code lộn xộn:** `main.ts` chỉ nên làm nhiệm vụ duy nhất là khởi động server (Bootstrap). Đừng biến nó thành nồi lẩu thập cẩm.

## 2. Giải pháp chuẩn (Best Practice): Sử dụng Custom Providers

Thay vì dùng `app.useGlobal...`, chúng ta sẽ đăng ký chúng như một **Provider** ngay bên trong Module. NestJS hỗ trợ các token đặc biệt: `APP_PIPE`, `APP_INTERCEPTOR`, `APP_FILTER` để làm việc này.

### Bước 1: Gom nhóm vào `CoreModule`

Để code gọn gàng, hãy tạo một module tên là `CoreModule`. Module này sẽ chứa toàn bộ các cấu hình cốt lõi dùng chung cho toàn dự án.

```typescript
// src/core/core.module.ts
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

// Import các file custom của bạn
import { TransformResponseInterceptor } from "./interceptors/transform-response.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

@Module({
  providers: [
    // 1. Đăng ký Global Pipe (Validate DTO)
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Tự động bỏ field thừa
        forbidNonWhitelisted: true, // Báo lỗi nếu gửi field linh tinh
        transform: true, // Tự convert type (query param string -> number)
      }),
    },
    // 2. Đăng ký Global Interceptor (Format Response thành công)
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    // 3. Đăng ký Global Filter (Bắt lỗi & Format Error)
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class CoreModule {}
```

### Bước 2: Import vào `AppModule`

```typescript
// src/app.module.ts
import { Module } from "@nestjs/common";
import { CoreModule } from "./core/core.module"; // Import CoreModule

@Module({
  imports: [
    CoreModule, // Chỉ cần dòng này là xong!
    // Các module khác: UsersModule, AuthModule...
  ],
})
export class AppModule {}
```

### Bước 3: Tận hưởng sự sạch sẽ ở `main.ts`

```typescript
// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Không cần khai báo Global Pipe/Interceptor ở đây nữa
  // NestJS tự động load từ CoreModule

  app.setGlobalPrefix("api/v1");
  await app.listen(3000);
}
bootstrap();
```

---

## 3. Mẹo nhỏ: Đặt tên tường minh & Tận dụng DI

Khi chuyển logic vào Module, bạn có thể tận dụng Dependency Injection. Đồng thời, hãy đặt tên Class rõ nghĩa hơn. Thay vì `TransformInterceptor` chung chung, hãy dùng **`TransformResponseInterceptor`**.

Ví dụ file Interceptor khi viết trong Module:

```typescript
// src/core/interceptors/transform-response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable() // Bắt buộc có decorator này
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  // POWERFUL: Bạn có thể Inject bất cứ thứ gì ở đây!
  // NestJS tự động Inject Reflector (không cần new thủ công)
  constructor(
    private reflector: Reflector // private logger: LoggerService, <--- Có thể inject thêm Logger dễ dàng
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message:
          this.reflector.get<string>(
            "response_message",
            context.getHandler()
          ) || "",
        result: data,
      }))
    );
  }
}
```

## Tổng kết

Chuyển cấu hình Global từ `main.ts` vào `CoreModule` mang lại 3 lợi ích vàng:

1.  **Clean Code:** Cấu trúc dự án rõ ràng, `main.ts` gọn nhẹ.
2.  **Scalability:** Dễ dàng mở rộng, bảo trì. Nếu muốn tách Microservice hay Monorepo, chỉ cần copy `CoreModule` đi là chạy.
3.  **Powerful DI:** Có thể Inject bất kỳ Service nào vào Pipe/Filter/Interceptor để xử lý logic phức tạp.

Hy vọng tip nhỏ này giúp anh em clear hơn về kiến trúc NestJS! Happy coding! 🚀
