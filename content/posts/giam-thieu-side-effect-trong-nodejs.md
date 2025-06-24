---
date: 2024-11-15
modified: 2024-10-15T10:28:37Z
title: Giảm thiểu Side Effect trong Nodejs.
draft: false
categories:
  - nodejs
  - javascript
---

Giảm thiểu side effect là một cách quan trọng để viết code JavaScript sạch hơn, dễ dự đoán hơn, và dễ kiểm thử hơn. Dưới đây là một số cách để giảm thiểu side effect trong JavaScript:

**1. Sử dụng Pure Functions (Hàm thuần)**

* **Định nghĩa:** Một pure function luôn trả về cùng một kết quả với cùng một tập hợp các tham số đầu vào và không gây ra bất kỳ side effect nào.
* **Lợi ích:** Dễ dự đoán, dễ kiểm thử, và dễ dàng lý luận về code.
* **Ví dụ:**

```javascript
// Pure function
function add(a, b) {
  return a + b;
}

// Impure function (có side effect)
let total = 0;
function addToTotal(a) {
  total += a; // Thay đổi biến bên ngoài hàm
  return total;
}
```

**2. Hạn chế Biến Toàn Cục (Global Variables)**

* **Vấn đề:** Biến toàn cục có thể bị thay đổi từ bất kỳ đâu trong chương trình, dẫn đến khó theo dõi và debug.
* **Giải pháp:** Sử dụng biến cục bộ (local variables) bên trong hàm, modules, hoặc closures để giới hạn phạm vi của biến.

**3. Immutability (Tính bất biến)**

* **Định nghĩa:**  Không thay đổi trực tiếp dữ liệu hiện có mà tạo ra một bản sao mới với các thay đổi.
* **Lợi ích:**  Tránh được các lỗi bất ngờ do thay đổi dữ liệu ở nhiều nơi trong chương trình.
* **Thư viện hỗ trợ:**  `Immer` giúp việc làm việc với immutability dễ dàng hơn.
* **Ví dụ:**

```javascript
const originalArray = [1, 2, 3];

// Thay đổi trực tiếp (mutable) - gây side effect
originalArray.push(4);

// Immutability (immutable) - không gây side effect
const newArray = [...originalArray, 4]; // Sử dụng spread operator
```

**4. Functional Programming (Lập trình hàm)**

* **Khái niệm:**  Sử dụng các hàm như là các đơn vị cơ bản của chương trình.
* **Kỹ thuật:**  map, filter, reduce, và các hàm bậc cao khác giúp tránh side effect bằng cách xử lý dữ liệu một cách khai báo.
* **Ví dụ:**

```javascript
const numbers = [1, 2, 3, 4, 5];

// Thay đổi trực tiếp (mutable) - gây side effect
const doubledNumbers = [];
for (let i = 0; i < numbers.length; i++) {
  doubledNumbers.push(numbers[i] * 2);
}

// Functional approach (immutable) - không gây side effect
const doubledNumbersFunctional = numbers.map(number => number * 2);
```

**5.  Asynchronous Operations (Thao tác bất đồng bộ) with Promises and Async/Await**

* **Vấn đề:** Callback hell có thể dẫn đến code khó đọc và khó quản lý side effect.
* **Giải pháp:** Sử dụng Promises và async/await để viết code asynchronous rõ ràng và dễ hiểu hơn.  Điều này giúp quản lý side effect tốt hơn vì luồng thực thi trở nên dễ theo dõi.


**6.  Side Effect Management Libraries (Thư viện quản lý side effect)**

*  Một số thư viện như `RxJS` cung cấp các công cụ mạnh mẽ để quản lý side effect, đặc biệt là trong các ứng dụng phức tạp.


**7.  Tách biệt Side Effects (Isolate Side Effects)**

*  Cố gắng cô lập các phần code có side effect vào các hàm hoặc module riêng biệt.  Điều này giúp dễ dàng hơn trong việc kiểm tra và quản lý chúng.


Bằng cách áp dụng những kỹ thuật này, bạn có thể viết code JavaScript sạch hơn, dễ bảo trì hơn, và ít lỗi hơn.  Việc giảm thiểu side effect không chỉ giúp code dễ hiểu hơn mà còn giúp việc kiểm thử dễ dàng hơn rất nhiều.
