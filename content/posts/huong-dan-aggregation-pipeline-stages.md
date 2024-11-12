---
date: 2024-11-12
modified: Tuesday 12th October 2024 12:28:37
title: Hướng dẫn về Aggregation Pipeline trong mongo
draft: false
categories:
  - aggregates
  - mongo
  - mongoose
  - database
  - nodejs
---

**Aggregation Pipeline** trong MongoDB là một công cụ mạnh mẽ để xử lý và phân tích dữ liệu. Nó cho phép bạn thực hiện nhiều thao tác khác nhau trên dữ liệu thông qua một chuỗi các giai đoạn (stages). Dưới đây là hướng dẫn về các giai đoạn chính trong Aggregation Pipeline.

### Các Giai Đoạn Cơ Bản Trong Aggregation Pipeline

1. **`$match`**:
   - Sử dụng để lọc tài liệu dựa trên điều kiện.
   - Tương tự như `find()`, nhưng có thể sử dụng các toán tử phức tạp hơn.
   - **Ví dụ**:
     ```javascript
     db.collection.aggregate([
       { $match: { status: "active" } }
     ]);
     ```

2. **`$group`**:
   - Dùng để nhóm tài liệu theo một hoặc nhiều trường.
   - Cho phép bạn tính toán các giá trị tổng hợp như `sum`, `avg`, `max`, `min`.
   - **Ví dụ**:
     ```javascript
     db.collection.aggregate([
       { $group: { _id: "$category", total: { $sum: "$amount" } } }
     ]);
     ```

3. **`$project`**:
   - Dùng để thay đổi cấu trúc của tài liệu, bao gồm các trường cụ thể, tạo trường mới hoặc loại bỏ trường.
   - **Ví dụ**:
     ```javascript
     db.collection.aggregate([
       { $project: { name: 1, total: { $multiply: ["$price", "$quantity"] } } }
     ]);
     ```

4. **`$sort`**:
   - Sử dụng để sắp xếp tài liệu theo một hoặc nhiều trường.
   - **Ví dụ**:
     ```javascript
     db.collection.aggregate([
       { $sort: { total: -1 } } // Sắp xếp giảm dần
     ]);
     ```

5. **`$limit`**:
   - Dùng để giới hạn số lượng tài liệu trả về.
   - **Ví dụ**:
     ```javascript
     db.collection.aggregate([
       { $limit: 5 } // Chỉ lấy 5 tài liệu đầu tiên
     ]);
     ```

6. **`$skip`**:
   - Dùng để bỏ qua một số tài liệu nhất định.
   - Thường được sử dụng cùng với `$limit` để phân trang.
   - **Ví dụ**:
     ```javascript
     db.collection.aggregate([
       { $skip: 10 } // Bỏ qua 10 tài liệu đầu tiên
     ]);
     ```

7. **`$unwind`**:
   - Dùng để tách một mảng thành nhiều tài liệu.
   - Mỗi phần tử trong mảng sẽ trở thành một tài liệu riêng biệt.
   - **Ví dụ**:
     ```javascript
     db.collection.aggregate([
       { $unwind: "$items" }
     ]);
     ```

8. **`$lookup`**:
   - Dùng để thực hiện join giữa hai collection.
   - Giúp kết hợp dữ liệu từ một collection khác dựa trên một khóa chung.
   - **Ví dụ**:
     ```javascript
     db.orders.aggregate([
       {
         $lookup: {
           from: "products",
           localField: "product_id",
           foreignField: "_id",
           as: "product_details"
         }
       }
     ]);
     ```

9. **`$addFields`**:
   - Dùng để thêm các trường mới vào tài liệu mà không làm thay đổi cấu trúc hiện tại.
   - **Ví dụ**:
     ```javascript
     db.collection.aggregate([
       { $addFields: { totalAmount: { $multiply: ["$price", "$quantity"] } } }
     ]);
     ```

10. **`$replaceRoot`**:
    - Dùng để thay thế tài liệu hiện tại bằng một tài liệu mới.
    - **Ví dụ**:
      ```javascript
      db.collection.aggregate([
        { $replaceRoot: { newRoot: "$details" } }
      ]);
      ```

### Ví Dụ Tổng Hợp

Dưới đây là một ví dụ tổng hợp sử dụng nhiều giai đoạn trong một pipeline:

```javascript
db.sales.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$product_id", totalSales: { $sum: "$amount" } } },
  { $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  { $unwind: "$productDetails" },
  { $project: {
      product_name: "$productDetails.name",
      totalSales: 1
    }
  },
  { $sort: { totalSales: -1 } },
  { $limit: 10 }
]);
```

### Kết Luận

Aggregation Pipeline là một công cụ mạnh mẽ để xử lý và phân tích dữ liệu trong MongoDB. Các giai đoạn khác nhau cho phép bạn thực hiện nhiều thao tác phức tạp trên dữ liệu. Nếu bạn có thêm câu hỏi hoặc cần ví dụ cụ thể hơn, hãy cho tôi biết!
