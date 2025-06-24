---
author: NGHIA
title: Using Mongoose
date: 2024-09-28
draft: false
description: >-
  quick reference on Mongoose
summary: >-
    Tìm kiếm: find, findOne, findById, countDocuments
    Thêm mới: create, save
    Cập nhật: updateOne, updateMany, findOneAndUpdate, findByIdAndUpdate
    Xóa: deleteOne, deleteMany, findOneAndDelete, findByIdAndDelete
    Tổng hợp: aggregate
    Bộ đếm: countDocuments, estimatedDocumentCount
    Khác: lean, populate
categories:
  - mobile apps
  - frontend
tags:
  - react-native
  - javascript
  - frontend
##
## Options for overriding site defaults
##
readingSpeed: 20
readingSpeedMin: 50
readingSpeedMax: 100
---

Có thể phân loại các hàm trong Mongoose theo chức năng chính của chúng như sau để dễ nhớ và sử dụng:

### 1. **Nhóm hàm tìm kiếm (Querying)**

Các hàm trong nhóm này được sử dụng để **truy vấn** tài liệu từ cơ sở dữ liệu.

- **`find()`**: Tìm nhiều tài liệu thỏa mãn điều kiện.
  - **Ví dụ**: 
    ```javascript
    Model.find({ age: { $gt: 25 } });
    ```

- **`findOne()`**: Tìm một tài liệu duy nhất thỏa mãn điều kiện.
  - **Ví dụ**: 
    ```javascript
    Model.findOne({ name: 'John' });
    ```

- **`findById()`**: Tìm một tài liệu theo `_id`.
  - **Ví dụ**:
    ```javascript
    Model.findById('id_cua_tai_lieu');
    ```

- **`countDocuments()`**: Đếm số tài liệu thỏa mãn điều kiện.
  - **Ví dụ**:
    ```javascript
    Model.countDocuments({ status: 'active' });
    ```

### 2. **Nhóm hàm thêm mới (Creating)**

Các hàm này được dùng để **tạo mới** tài liệu trong cơ sở dữ liệu.

- **`create()`**: Tạo một hoặc nhiều tài liệu mới.
  - **Ví dụ**: 
    ```javascript
    Model.create({ name: 'John', age: 30 });
    ```

- **`save()`**: Lưu tài liệu mới hoặc tài liệu đã thay đổi (phải tạo đối tượng tài liệu trước).
  - **Ví dụ**:
    ```javascript
    const doc = new Model({ name: 'Jane', age: 25 });
    doc.save();
    ```

### 3. **Nhóm hàm cập nhật (Updating)**

Các hàm này được sử dụng để **cập nhật** tài liệu trong cơ sở dữ liệu.

- **`updateOne()`**: Cập nhật một tài liệu duy nhất thỏa mãn điều kiện.
  - **Ví dụ**:
    ```javascript
    Model.updateOne({ name: 'John' }, { age: 35 });
    ```

- **`updateMany()`**: Cập nhật nhiều tài liệu thỏa mãn điều kiện.
  - **Ví dụ**:
    ```javascript
    Model.updateMany({ status: 'active' }, { age: 40 });
    ```

- **`findOneAndUpdate()`**: Tìm và cập nhật tài liệu, có thể trả về tài liệu trước hoặc sau khi cập nhật.
  - **Ví dụ**:
    ```javascript
    Model.findOneAndUpdate({ name: 'John' }, { age: 35 }, { new: true });
    ```

- **`findByIdAndUpdate()`**: Tìm theo `_id` và cập nhật tài liệu.
  - **Ví dụ**:
    ```javascript
    Model.findByIdAndUpdate('id_cua_tai_lieu', { age: 35 });
    ```

### 4. **Nhóm hàm xóa (Deleting)**

Các hàm trong nhóm này được dùng để **xóa** tài liệu khỏi cơ sở dữ liệu.

- **`deleteOne()`**: Xóa một tài liệu duy nhất thỏa mãn điều kiện.
  - **Ví dụ**:
    ```javascript
    Model.deleteOne({ name: 'John' });
    ```

- **`deleteMany()`**: Xóa nhiều tài liệu thỏa mãn điều kiện.
  - **Ví dụ**:
    ```javascript
    Model.deleteMany({ status: 'inactive' });
    ```

- **`findOneAndDelete()`**: Tìm một tài liệu và xóa nó.
  - **Ví dụ**:
    ```javascript
    Model.findOneAndDelete({ name: 'John' });
    ```

- **`findByIdAndDelete()`**: Tìm theo `_id` và xóa tài liệu.
  - **Ví dụ**:
    ```javascript
    Model.findByIdAndDelete('id_cua_tai_lieu');
    ```

### 5. **Nhóm hàm làm việc với bộ đếm (Counting and Estimation)**

Các hàm này giúp **đếm số lượng** tài liệu trong cơ sở dữ liệu.

- **`countDocuments()`**: Đếm số tài liệu thỏa mãn điều kiện (tốc độ nhanh hơn `find()` khi chỉ cần đếm).
  - **Ví dụ**:
    ```javascript
    Model.countDocuments({ status: 'active' });
    ```

- **`estimatedDocumentCount()`**: Đếm tổng số tài liệu trong một collection, bỏ qua điều kiện.
  - **Ví dụ**:
    ```javascript
    Model.estimatedDocumentCount();
    ```

### 6. **Nhóm hàm bộ sưu tập (Aggregation)**

Dùng để **tổng hợp** dữ liệu từ nhiều tài liệu và thực hiện các phép tính phức tạp.

- **`aggregate()`**: Thực hiện các phép toán trên nhiều tài liệu.
  - **Ví dụ**:
    ```javascript
    Model.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$age', total: { $sum: 1 } } }
    ]);
    ```

### 7. **Nhóm hàm khác**

- **`lean()`**: Trả về tài liệu đơn giản dưới dạng JavaScript object, không phải đối tượng Mongoose đầy đủ (nhanh hơn).
  - **Ví dụ**:
    ```javascript
    Model.find({}).lean();
    ```

- **`populate()`**: Truy vấn và chèn tài liệu tham chiếu vào kết quả (dùng khi có liên kết giữa các model).
  - **Ví dụ**:
    ```javascript
    Model.find().populate('author');
    ```

### Tổng kết cách ghi nhớ:
1. **Tìm kiếm**: `find`, `findOne`, `findById`, `countDocuments`
2. **Thêm mới**: `create`, `save`
3. **Cập nhật**: `updateOne`, `updateMany`, `findOneAndUpdate`, `findByIdAndUpdate`
4. **Xóa**: `deleteOne`, `deleteMany`, `findOneAndDelete`, `findByIdAndDelete`
5. **Tổng hợp**: `aggregate`
6. **Bộ đếm**: `countDocuments`, `estimatedDocumentCount`
7. **Khác**: `lean`, `populate`

Việc phân loại theo chức năng giúp bạn dễ nhớ và sử dụng các hàm Mongoose trong các tình huống khác nhau.
