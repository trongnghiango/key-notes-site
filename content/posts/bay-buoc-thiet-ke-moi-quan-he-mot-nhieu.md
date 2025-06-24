---
date: 2024-12-02
modified: 2024-12-02T11:10:37Z
title: Tổng hợp 7 bước để thiết kế mối quan hệ một-nhiều trong SQL.
draft: false
toc: true
categories:
  - sql
  - database
---

Dưới đây là tổng hợp 7 bước để thiết kế mối quan hệ một-nhiều cùng với các ví dụ mô hình hóa thông qua sơ đồ:

### Bảy Bước Thiết Kế Mối Quan Hệ Một-Nhiều

#### 1. **Hiểu Định Nghĩa Mối Quan Hệ Một-Nhiều**

   - Mối quan hệ một-nhiều xảy ra khi một bản ghi trong bảng đầu tiên có thể liên quan đến nhiều bản ghi trong bảng thứ hai, nhưng một bản ghi trong bảng thứ hai chỉ liên quan đến một bản ghi trong bảng đầu tiên.

 #### 2. **Viết Ra Những Gì Bạn Muốn Lưu Trữ**

   - Ví dụ: Lưu trữ thông tin khách hàng và các đơn hàng mà họ đã thực hiện.

 #### 3. **Xác Định Các Đối Tượng**

   - Ví dụ:
     - Bảng Khách Hàng và Bảng Đơn Hàng.
     - Bảng Xe và Bảng Showroom.
     - Bảng Sinh Viên và Bảng Khóa Học.

 #### 4. **Xác Định Mối Quan Hệ**

   - Đặt câu hỏi: "Liệu đối tượng một có nhiều đối tượng hai không, hay đối tượng hai có nhiều đối tượng một?"
   - Ví dụ: Một khách hàng có nhiều đơn hàng, nhưng một đơn hàng chỉ có một khách hàng.

 #### 5. **Vẽ Sơ Đồ**

   - Sử dụng bút và giấy hoặc công cụ vẽ sơ đồ như Lucidchart để vẽ hai bảng mà không cần cột.

 #### 6. **Vẽ Đường Liên Kết Giữa Hai Bảng**

   - Vẽ một đường thẳng giữa hai bảng để chỉ ra mối quan hệ giữa chúng.

 #### 7. **Thêm Ký Hiệu Để Chỉ Ra Mối Quan Hệ Một-Nhiều**
   - Sử dụng ký hiệu chân quạ để chỉ ra bên "nhiều" của mối quan hệ.

### Ví dụ Mô Hình Hóa Qua Sơ Đồ

- **Sơ đồ mối quan hệ giữa Khách Hàng và Đơn Hàng:**

  ```
  +------------------+       +------------------+
  |   Khách Hàng     |       |    Đơn Hàng      |
  +------------------+       +------------------+
  | ID_KH (PK)       |<----- | ID_DH (PK)       |
  | Tên              |       | Ngày Đặt Hàng    |
  +------------------+       +------------------+
  ```

- **Sơ đồ mối quan hệ giữa Xe và Showroom:**

  ```
  +------------------+       +------------------+
  |      Xe          |       |   Showroom       |
  +------------------+       +------------------+
  | ID_XE (PK)       |<----- | ID_SH (PK)       |
  | Màu              |       | Tên Showroom     |
  +------------------+       +------------------+
  ```

- **Sơ đồ mối quan hệ giữa Sinh Viên và Khóa Học:**
  ```
  +------------------+       +------------------+
  |    Sinh Viên     |       |    Khóa Học      |
  +------------------+       +------------------+
  | ID_SV (PK)       |<----- | ID_KH (PK)       |
  | Tên              |       | Tên Khóa Học     |
  +------------------+       +------------------+
  ```
