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

Dưới đây là giải thích chi tiết về từng giai đoạn trong ví dụ tổng hợp sử dụng Aggregation Pipeline trong MongoDB:

#### Mục Tiêu của ví dụ:

Mục tiêu của pipeline này là tìm tổng doanh số (`totalSales`) cho từng sản phẩm đã hoàn tất (`status: "completed"`), sau đó tra cứu thông tin sản phẩm và sắp xếp theo doanh số giảm dần, cuối cùng chỉ lấy 10 sản phẩm hàng đầu.

#### Chi Tiết Các Giai Đoạn

```javascript
db.sales.aggregate([
  { $match: { status: "completed" } },
```

##### 1. `$match`
- **Chức năng**: Lọc tài liệu trong collection `sales` để chỉ lấy những tài liệu có trường `status` bằng `"completed"`.
- **Ý nghĩa**: Giai đoạn này giúp giảm số lượng tài liệu cần xử lý ở các giai đoạn tiếp theo bằng cách chỉ giữ lại những doanh số đã hoàn tất.

---

```javascript
  { $group: { _id: "$product_id", totalSales: { $sum: "$amount" } } },
```

##### 2. `$group`
- **Chức năng**: Nhóm các tài liệu theo `product_id` và tính tổng doanh số cho mỗi sản phẩm.
- **Chi tiết**:
  - `_id: "$product_id"`: Thiết lập `product_id` là trường nhóm.
  - `totalSales: { $sum: "$amount" }`: Tính tổng giá trị của trường `amount` cho mỗi nhóm sản phẩm.
- **Ý nghĩa**: Giai đoạn này tạo ra một tài liệu mới cho mỗi sản phẩm, với tổng doanh số của nó.

---

```javascript
  { $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "productDetails"
    }
  },
```

##### 3. `$lookup`
- **Chức năng**: Thực hiện join với collection `products` để lấy thông tin chi tiết về sản phẩm.
- **Chi tiết**:
  - `from: "products"`: Tên collection cần join.
  - `localField: "_id"`: Trường trong collection `sales` mà bạn đang làm việc để join (ở đây là `product_id`).
  - `foreignField: "_id"`: Trường trong collection `products` mà bạn muốn khớp với.
  - `as: "productDetails"`: Tên của trường mới sẽ chứa thông tin từ collection `products`.
- **Ý nghĩa**: Giai đoạn này bổ sung thông tin sản phẩm vào kết quả, do đó bạn có thể truy cập tên hoặc các thuộc tính khác của sản phẩm.

---

```javascript
  { $unwind: "$productDetails" },
```

##### 4. `$unwind`
- **Chức năng**: Tách các tài liệu trong mảng `productDetails` thành các tài liệu riêng biệt.
- **Ý nghĩa**: Nếu một sản phẩm có nhiều thông tin (mỗi sản phẩm có thể có nhiều thuộc tính), giai đoạn này đảm bảo rằng mỗi tài liệu trong kết quả là một sản phẩm cụ thể với thông tin chi tiết của nó.

---

```javascript
  { $project: {
      product_name: "$productDetails.name",
      totalSales: 1
    }
  },
```

##### 5. `$project`
- **Chức năng**: Điều chỉnh cấu trúc tài liệu kết quả, chọn các trường cần thiết.
- **Chi tiết**:
  - `product_name: "$productDetails.name"`: Lấy tên sản phẩm từ trường `name` trong `productDetails`.
  - `totalSales: 1`: Giữ lại trường `totalSales` đã tính toán.
- **Ý nghĩa**: Giai đoạn này giúp tạo ra một kết quả dễ đọc hơn, chỉ bao gồm những thông tin cần thiết.

---

```javascript
  { $sort: { totalSales: -1 } },
```

##### 6. `$sort`
- **Chức năng**: Sắp xếp các tài liệu theo trường `totalSales` theo thứ tự giảm dần.
- **Ý nghĩa**: Giai đoạn này đảm bảo rằng các sản phẩm có doanh số cao nhất xuất hiện trước trong kết quả.

---

```javascript
  { $limit: 10 }
]);
```

##### 7. `$limit`
- **Chức năng**: Giới hạn số lượng tài liệu trả về.
- **Ý nghĩa**: Chỉ lấy 10 sản phẩm hàng đầu, giúp tối ưu hóa kết quả và tập trung vào các sản phẩm bán chạy nhất.

#### Kết Quả

Kết quả cuối cùng của pipeline này sẽ là một danh sách các sản phẩm đã hoàn tất bán hàng, mỗi sản phẩm có tên và tổng doanh số, được sắp xếp theo doanh số giảm dần và chỉ hiển thị tối đa 10 sản phẩm.

### Kết Luận

Aggregation Pipeline là một công cụ mạnh mẽ để xử lý và phân tích dữ liệu trong MongoDB. Các giai đoạn khác nhau cho phép bạn thực hiện nhiều thao tác phức tạp trên dữ liệu. Nếu bạn có thêm câu hỏi hoặc cần ví dụ cụ thể hơn, hãy cho tôi biết!
