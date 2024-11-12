---
date: 2024-11-12
modified: Tuesday 12th October 2024 11:28:37
title: Xử lý một trường ref trong Mongoose cho nhiều Model khác nhau
draft: false
categories:
  - mongo
  - mongoose
  - database
  - nodejs
---


## bài toán đưa ra như sau 
- Ta muốn tách model user thành các model {'User', 'Manager', 'Admin', ...} để tăng thêm mức độ bảo mật.
- Từ vấn đề này phát sinh ra việc tạo 1 tài khoản user không biết ref như thế nào trong ví dụ dưới đây:
```js 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Thêm trường này để xác định loại người tạo
    ref: 'User', // Có thể là User, có thể là Admin hoặc Manager
  },
  // Các trường khác...
});

// Ví dụ về cách tạo một instance
const User = mongoose.model('User', userSchema);
```
[*] Hạn chế: Mongoose không hỗ trợ trực tiếp việc tham chiếu đến nhiều mô hình khác nhau trong cùng một trường.
---> Hướng giải quyết: ta bổ sung thêm trường type(cụ thể createdByType) với `required: true` cho model. Để khi tạo User thì tương ứng với mỗi type ta ref để đúng collection chứa Document cần ref
## Minh họa lại như sau:

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Thêm trường này để xác định loại người tạo
    ref: 'User', // Mặc định là User, có thể là Admin hoặc Manager
  },
  createdByType: {
    type: String,
    enum: ['Admin', 'Manager', 'User'], // Các loại cho phép
    required: true,
  },
  // Các trường khác...
});

// Ví dụ về cách tạo một instance
const User = mongoose.model('User', userSchema);

// Lưu instance
const newUser = new User({
  createdBy: someAdminOrManagerOrUserId,
  createdByType: 'Admin', // Hoặc 'Manager', 'User' tương ứng
  // Các trường khác...
});
newUser.save();
```
