
---
date: 2025-01-06
modified: Thusday 6th January 2025 02:10:00
title: Cách sử dụng Đa luồng với "worker threads" trong Node.js
draft: false
categories:
  - Nodejs
  - Backend
tags:
  - javascript
---

Dưới đây là bản dịch tiếng Việt cho phụ đề video:

---

**Cách sử dụng Đa luồng với "worker threads" trong Node.js?**

**0:00**  
Trong bài viết này, chúng ta sẽ xây dựng một ứng dụng Node.js với một tác vụ ngốn CPU làm tắc nghẽn luồng chính.

**0:05**  
Sau đó, nhờ khả năng đa luồng của Node và "worker threads", chúng ta sẽ chuyển bớt phần tính toán nặng sang các luồng khác để tăng tốc ứng dụng.

**0:17**  
Nếu đã sẵn sàng, hãy bắt đầu!

**0:19**  
Đầu tiên, tôi sẽ cho bạn xem qua ứng dụng mẫu:

**0:24**  
- Đây là một máy chủ Express.  
- Trong `package.json`, Express đã được cài đặt.  
- Có hai route: `/non-blocking` và `/blocking`.

**0:33**  
Khởi động server bằng `node index.js`, truy cập `/non-blocking` → hoạt động tốt.  
Truy cập `/blocking` → ứng dụng bị treo.  
Khi quay lại `/non-blocking` → cũng bị treo do luồng chính đã bị tắc.

**1:05**  
**Nguyên nhân:**  
- Route `/blocking` chứa vòng lặp tính toán 20 triệu lần, chiếm dụng CPU.  
- Node.js mặc định chỉ chạy trên **1 luồng chính** (LibUV hỗ trợ 4 luồng ẩn cho I/O, nhưng không áp dụng cho CPU-bound tasks).

**1:54**  
**Giải pháp:** Sử dụng **Worker Threads** để tạo luồng riêng cho tác vụ nặng.

---

### **Cài đặt Worker Thread**
**4:37**  
1. Tạo file `worker.js`:  
```js
const { parentPort } = require("worker_threads");

let counter = 0;
for (let i = 0; i < 20_000_000; i++) {
  counter++;
}

parentPort.postMessage(counter); // Gửi kết quả về luồng chính
```

**6:00**  
2. Sửa route `/blocking` trong `index.js`:  
```js
const { Worker } = require("worker_threads");

app.get("/blocking", (req, res) => {
  const worker = new Worker(__dirname + "/worker.js");

  worker.on("message", (data) => {
    res.status(200).send(`Kết quả: ${data}`);
  });

  worker.on("error", (error) => {
    res.status(404).send(`Lỗi: ${error}`);
  });
});
```

**8:28**  
**Kết quả:**  
- `/blocking` chạy trên worker thread → không làm tắc luồng chính.  
- `/non-blocking` vẫn hoạt động bình thường.

---

### **Tối ưu hóa với Đa luồng Song song**
**9:22**  
1. Xác định số lõi CPU:  
```bash
# Mac/Linux
sysctl -n hw.ncpu

# Windows
echo %NUMBER_OF_PROCESSORS%
```

**10:09**  
2. Chia tác vụ thành 4 phần (ví dụ 4 lõi):  
```js
// worker.js
const { parentPort, workerData } = require("worker_threads");
let counter = 0;
for (let i = 0; i < 20_000_000 / workerData.threadCount; i++) {
  counter++;
}
parentPort.postMessage(counter);
```

**11:55**  
3. Cập nhật `index.js`:  
```js
const THREAD_COUNT = 4;

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: { threadCount: THREAD_COUNT },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

app.get("/blocking", async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }

  const results = await Promise.all(workerPromises);
  const total = results.reduce((acc, val) => acc + val, 0);
  res.status(200).send(`Kết quả: ${total}`);
});
```

**17:54**  
**Kết quả Benchmark:**  
- Phiên bản 1 luồng: 18 giây.  
- Phiên bản 4 luồng: **4 giây** (cải thiện 450%)!

---

### **Lưu ý quan trọng**  
- Worker Threads phù hợp cho **CPU-bound tasks** (xử lý ảnh, video, AI).  
- Không lạm dụng vì tạo nhiều luồng tốn tài nguyên.  
- Sử dụng `workerData` và `postMessage` để trao đổi dữ liệu giữa các luồng.

👉 [Video đầy đủ](https://youtu.be/MuwJJrfIfsU) | [Bài viết tham khảo](https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js)
