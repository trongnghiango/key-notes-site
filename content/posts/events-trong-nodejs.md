---
date: 2024-11-14
modified: Tuesday 14th October 2024 21:28:37
title: Event trong Nodejs
draft: false
categories:
  - event
  - nodejs
---

### Đặt vấn đề:
- Trong nodejs có nhiều tác vụ liên quan với nhau.
- > điều kiện thực thi task này thì cần kết quả của task khác (thực thi đồng bộ được yêu cầu)
- > các task vụ có thể là 1 dạng của [Side Effect](/posts/side-effect-la-gi)
- > Việc dùng `callback` lồng nhau nhiều có thể sẽ xảy ra `callback hell`
  > module events có thể giải quyết vấn đề trên.
