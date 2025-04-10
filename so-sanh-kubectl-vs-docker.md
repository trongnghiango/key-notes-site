---
date: 2025-04-11
modified: Friday 11th April 2024 01:30:00
title: So sánh giữa kubectl với docker trong quản lý container
categories:
  - devops
---

Đúng vậy! **`kubectl`** và **`docker`** đều là công cụ dòng lệnh để làm việc với container, nhưng chúng phục vụ các mục đích khác nhau và hoạt động ở các lớp khác nhau. Dưới đây là bảng so sánh chi tiết:

---

### **1. Mục đích chính**
| **Docker CLI**                        | **Kubectl**                              |
|---------------------------------------|------------------------------------------|
| Quản lý **container** trên **một máy**. | Quản lý **cluster** (nhiều máy/nodes) và các tài nguyên Kubernetes. |
| Build image, chạy container, quản lý storage, network trên local. | Triển khai ứng dụng, scaling, quản lý vòng đời của Pods/Deployments/Services. |

---

### **2. Phạm vi hoạt động**
| **Docker CLI**                        | **Kubectl**                              |
|---------------------------------------|------------------------------------------|
| Tập trung vào **một máy** (local development). | Tương tác với **nhiều máy** trong cluster (production environment). |
| Không xử lý các vấn đề phân tán như load balancing, self-healing. | Giải quyết các bài toán phân tán: scaling, high availability, rolling updates. |

---

### **3. Ví dụ cụ thể**
#### **Triển khai ứng dụng**
- **Docker**:  
  ```bash
  docker run -d -p 8080:80 nginx:latest
  ```
  → Chạy một container Nginx trên máy local.  

- **Kubectl**:  
  ```bash
  kubectl create deployment nginx --image=nginx:latest
  kubectl expose deployment nginx --port=80 --type=LoadBalancer
  ```
  → Triển khai Nginx trên cluster, tạo Service để cân bằng tải và expose ứng dụng ra ngoài.

---

#### **Xem logs**
- **Docker**:  
  ```bash
  docker logs <container-id>
  ```
- **Kubectl**:  
  ```bash
  kubectl logs <pod-name>
  ```

---

#### **Truy cập vào container**
- **Docker**:  
  ```bash
  docker exec -it <container-id> /bin/bash
  ```
- **Kubectl**:  
  ```bash
  kubectl exec -it <pod-name> -- /bin/bash
  ```

---

### **4. Sự phức tạp**
| **Docker CLI**                        | **Kubectl**                              |
|---------------------------------------|------------------------------------------|
| Đơn giản, dễ học, phù hợp cho người mới. | Phức tạp hơn, yêu cầu hiểu biết về Kubernetes concepts (Pods, Deployments, Services, Ingress...). |
| Không cần cấu hình cluster. | Cần kết nối đến Kubernetes cluster (local hoặc cloud). |

---

### **5. Khi nào dùng cái nào?**
- **Dùng Docker CLI khi**:  
  - Build image từ Dockerfile.  
  - Test container trên local.  
  - Làm việc với các dự án nhỏ, đơn giản.  

- **Dùng Kubectl khi**:  
  - Triển khai ứng dụng lên môi trường production.  
  - Cần scaling tự động, self-healing, hoặc quản lý ứng dụng phân tán.  
  - Làm việc với microservices và hệ thống cloud-native.  

---

### **6. Mối quan hệ giữa Docker và Kubernetes**
- **Docker** tạo ra container images và chạy container.  
- **Kubernetes** (qua `kubectl`) sử dụng các images đó để triển khai ứng dụng lên cluster, quản lý cách chúng chạy, giao tiếp, và mở rộng.  
→ Chúng **bổ sung** cho nhau: Docker để đóng gói ứng dụng, Kubernetes để quản lý ứng dụng ở quy mô lớn.  

---

### **7. Tóm lại**
- **`docker`** giống như **"công cụ thợ xây"** — dùng để xây từng viên gạch (container).  
- **`kubectl`** giống như **"kiến trúc sư"** — sắp xếp các viên gạch thành một tòa nhà hoàn chỉnh (cluster).  

Bạn cần cả hai để xây dựng hệ thống containerized từ development đến production! 🚀  
