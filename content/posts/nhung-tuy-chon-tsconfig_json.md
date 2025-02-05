---
date: 2025-01-05
modified: Wedneday 5th January 2025 22:10:00
title: Những tùy chọn Tsconfig.json Essential bạn nên sử dụng
draft: false
categories:
  - Development
tags:
  - TS
  - Typescript
---

**tsconfig.json là gì và tại sao nó quan trọng?**  
Tệp **tsconfig.json** là một phần quan trọng trong bất kỳ dự án TypeScript nào. Nó hướng dẫn trình biên dịch cách chuyển đổi mã TypeScript của bạn thành JavaScript. Bằng cách thiết lập tệp này, bạn có thể kiểm soát các yếu tố như mức độ nghiêm ngặt của kiểm tra lỗi và định dạng đầu ra. Điều này rất quan trọng để quản lý hiệu quả các vấn đề trong môi trường production thực tế.

---

### **1. Tăng hiệu suất: các tùy chọn để biên dịch nhanh hơn**
```json
"incremental": true
```
**"Chỉ biên dịch lại những gì đã thay đổi."**  
Tùy chọn **incremental** lý tưởng cho các dự án lớn hoặc lặp đi lặp lại, nơi chỉ một phần mã thay đổi giữa các lần build. Khi được bật, TypeScript lưu cache bản build trước đó, cho phép bỏ qua việc biên dịch lại các tệp không thay đổi, tiết kiệm thời gian.

**Ví dụ:** Giả sử bạn có một dự án lớn và chỉ cập nhật nhỏ trong một tệp. Với **incremental** được bật, chỉ tệp đó sẽ được biên dịch lại, giảm đáng kể thời gian build.

---

### **2. Ưu tiên sự nghiêm ngặt: các tùy chọn để đảm bảo an toàn mã**
```json
"strict": true
```
**"Bật tất cả các tùy chọn kiểm tra kiểu nghiêm ngặt để tăng độ tin cậy của mã. Một best practice của TypeScript."**  
Thiết lập **"strict": true** kích hoạt toàn bộ các tính năng kiểm tra kiểu của TypeScript, giúp phát hiện sớm các lỗi tiềm ẩn và trường hợp biên. Cờ này là một phím tắt để bật các tùy chọn quan trọng khác:
- **noImplicitAny:** Ngăn chặn việc gán kiểu **any** một cách ngầm định cho biến và tham số, buộc bạn phải định nghĩa kiểu rõ ràng.
- **strictNullChecks:** Đảm bảo **null** và **undefined** được xử lý như các kiểu riêng biệt, giúp mã dễ đoán hơn.
- **strictFunctionTypes:** Kiểm tra chặt chẽ hơn các kiểu hàm, đặc biệt hữu ích khi gán hàm hoặc tương thích giữa các phạm vi khác nhau.
- **strictBindCallApply:** Thêm kiểm tra kiểu cho các phương thức **bind**, **call**, và **apply**.
- **strictPropertyInitialization:** Đảm bảo các thuộc tính lớp được khởi tạo trước khi sử dụng.
- **noImplicitThis:** Báo lỗi nếu từ khóa **this** có kiểu **any** ngầm định.
- **alwaysStrict:** Đảm bảo tất cả các tệp được phân tích trong chế độ nghiêm ngặt của ECMAScript.
- **useUnknownInCatchVariables:** Thay đổi kiểu của biến lỗi trong khối **catch** từ **any** thành **unknown**.
- **noUncheckedIndexedAccess:** Kiểm tra các giá trị **undefined** khi truy cập thuộc tính đối tượng.

---

### **3. Quản lý đầu ra: các tùy chọn để tổ chức tệp build**
```json
"rootDir": "src"
```
**"Chỉ định thư mục chứa các tệp đầu vào."**  
Tùy chọn này giúp tổ chức mã nguồn một cách hợp lý, đảm bảo trình biên dịch biết nơi tìm các tệp cần thiết.

```json
"outDir": "./build"
```
**"Xác định thư mục đầu ra cho các tệp JavaScript đã biên dịch."**  
Đây là nơi TypeScript sẽ xuất các tệp đã biên dịch, giúp tách biệt mã nguồn và mã JavaScript được tạo ra.

---

### **4. Kiểm soát tương thích: các tùy chọn cho đa nền tảng và module**
```json
"target": "es6"
```
**"Thiết lập phiên bản ECMAScript cho đầu ra."**  
TypeScript biên dịch mã thành các phiên bản JavaScript khác nhau. Đặt **target** thành **es6** là lý tưởng cho các ứng dụng hiện đại.

```json
"module": "NodeNext"
```
**"Xác định hệ thống module, chẳng hạn như CommonJS, ESNext, hoặc NodeNext."**  
Với **NodeNext**, bạn có thể sử dụng ES modules cùng TypeScript, đặc biệt hữu ích khi làm việc với các thư viện hoặc Node.js.

---

### **5. Gỡ lỗi và kiểm thử: các tùy chọn để cải thiện trải nghiệm phát triển**
```json
"sourceMap": true
```
**"Tạo source maps để hỗ trợ gỡ lỗi."**  
Source maps ánh xạ TypeScript sang JavaScript đầu ra, giúp gỡ lỗi dễ dàng hơn trong các công cụ như VSCode hoặc Chrome DevTools.

```json
"skipLibCheck": true
```
**"Bỏ qua kiểm tra kiểu cho các thư viện bên thứ ba."**  
Tùy chọn này giúp giảm tải kiểm tra kiểu, tăng tốc quá trình build.

---

### **6. Đảm bảo chất lượng mã: các tùy chọn cho mã sạch và dễ đoán**
```json
"noUnusedParameters": true,
"noUnusedLocals": true
```
**"Kiểm tra các tham số và biến không sử dụng."**  
Các tùy chọn này giúp đảm bảo mã sạch hơn bằng cách cảnh báo về các biến và tham số không sử dụng.

```json
"noImplicitOverride": true
```
**"Đảm bảo các phương thức ghi đè sử dụng từ khóa override một cách rõ ràng."**  
Tùy chọn này giúp mã dễ đọc và dễ gỡ lỗi hơn.

---

### **7. Tương thích module và JSON: các tùy chọn để tương tác tốt hơn**
```json
"esModuleInterop": true
```
**"Cho phép import mặc định từ các module CommonJS."**  
Tùy chọn này giúp tích hợp các thư viện dễ dàng hơn.

```json
"resolveJsonModule": true
```
**"Cho phép import các tệp JSON như module."**  
Tùy chọn này hữu ích khi làm việc với cấu hình hoặc dữ liệu mock.

---

### **8. Đảm bảo tính nhất quán và ổn định đa nền tảng**
```json
"forceConsistentCasingInFileNames": true
```
**"Ngăn chặn các vấn đề do đặt tên tệp không nhất quán."**  
Tùy chọn này đảm bảo tính nhất quán về phân biệt chữ hoa chữ thường trong tên tệp.

---

### **9. Ngăn chặn các lỗi phổ biến: kiểm tra an toàn và trường hợp fallthrough**
```json
"allowUnreachableCode": false
```
**"Báo lỗi cho mã không thể truy cập."**  
Tùy chọn này ngăn chặn mã không thể truy cập trong production.

```json
"noFallthroughCasesInSwitch": true
```
**"Báo lỗi cho các trường hợp fallthrough trong câu lệnh switch."**  
Tùy chọn này ngăn chặn hành vi không mong muốn trong các câu lệnh **switch**.

---

### **Kết luận**  
Hiểu rõ các tùy chọn trong **tsconfig.json** có thể cải thiện đáng kể quá trình phát triển TypeScript của bạn bằng cách tăng tốc build, tổ chức đầu ra, cải thiện chất lượng mã và giúp gỡ lỗi dễ dàng hơn. Làm chủ các cài đặt này để tùy chỉnh dự án TypeScript của bạn một cách hiệu quả, tạo ra mã nguồn hiệu quả, dễ bảo trì và an toàn.
