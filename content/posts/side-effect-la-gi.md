---
date: 2024-11-14
modified: 2024-10-14T22:28:37Z
title: Side Effect là gì?
draft: false
categories:
  - nodejs
  - javascript
---

### Hàm có side effect(tác dụng phụ) Là 1 hàm có thể cho ra kết quả không như mong muốn.
- Để làm rõ khái niệm trên ta sẽ đưa ra khái niệm ngược lại với nó là hàm pure function.
  > Luôn cho ra duy nhất 1 kết quả giống nhau khi có cùng tham số đầu vào.
  ```js
  function add(a, b) {
    return a + b
  }
  ```
  > Dựa vào ví dụ trên ta có thể kết luận thêm cho hàm side effect: cùng 1 tham số đầu vào có thể có những kết quả khác nhau.

### Một số ví dụ thường gặp:
- Ghi file
- Gửi HTTP Request.
- Thay đổi dữ liệu trong Database
