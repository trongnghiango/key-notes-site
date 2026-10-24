---
title: "Đã Có Docker, Vì Sao Cần Đến Kubernetes?"
subtitle: "Nhật ký tiến hóa hạ tầng từ docker-compose, Swarm đến K8s và bài học xương máu về quản trị Database"
date: 2024-11-11T10:00:00+07:00
lastmod: 2026-10-25T06:15:00+07:00
featured: true
description: "Phân tích bản chất tiến hóa từ Docker, Docker Swarm đến K3s/K8s, cùng bài học thực chiến về quản trị, backup và phục hồi cơ sở dữ liệu qua các quy mô Nhỏ - Vừa - Lớn."
draft: false
toc: true
categories:
  - devops
  - architecture
  - database
tags:
  - docker
  - kubernetes
  - postgresql
  - infrastructure
  - system-design
---

Hầu hết lập trình viên khi lần đầu tiếp cận Docker đều có chung một cảm giác phấn khích tột độ: đóng gói toàn bộ ứng dụng, thư viện và môi trường vào một Image duy nhất, gõ `docker compose up -d` là mọi thứ chạy êm ru. Căn bệnh muôn thuở *"Trên máy em vẫn chạy bình thường"* dường như đã bị tiêu diệt hoàn toàn.

Nhưng sự hân hoan ấy thường chỉ kéo dài cho đến khi hệ thống bước ra môi trường Production thực tế.

Bài viết này là nhật ký nhìn lại chặng đường tiến hóa hạ tầng mà mình đã đi qua: từ Docker đơn lẻ, bước đệm Docker Swarm, cho đến K3s/K8s. Quan trọng hơn cả là những bài học "ăn đòn" đau đớn khi quản trị dữ liệu (Stateful Database) trên container — điều mà các tài liệu lý thuyết thường chỉ lướt qua một cách hào nhoáng.

---

## 1. Buổi Ban Đầu Với Docker: Ảo Tưởng Về Sự Hoàn Hảo

Docker giải quyết xuất sắc bài toán **Đóng gói (Packaging)** và **Cách ly (Isolation)** ở tầng tiến trình trên một máy chủ (Single Host). Với `docker-compose.yml`, ta có thể dựng cả một stack gồm Nginx, Node.js API, Redis và PostgreSQL chỉ trong vài giây.

```
   ┌────────────────────────────────────────────────────────┐
   │             MỘT MÁY CHỦ DUY NHẤT (SINGLE HOST)         │
   │                                                        │
   │  ┌──────────┐    ┌──────────┐    ┌──────────────────┐  │
   │  │  Nginx   │───>│ API (Node│───>│    PostgreSQL    │  │
   │  └──────────┘    └──────────┘    └──────────────────┘  │
   └────────────────────────────────────────────────────────┘
                    ⚠️ ĐIỂM CHẾT DUY NHẤT (SPOF)
```

Nhưng khi lượng người dùng tăng lên, các vết nứt bắt đầu xuất hiện:

1. **Khủng hoảng phần cứng (Single Point of Failure):** Máy chủ sập nguồn, thanh RAM bị lỗi, hoặc đĩa cứng nghẽn I/O &rarr; Toàn bộ container cùng chết theo.
2. **Triển khai gián đoạn (Downtime khi deploy):** Cập nhật phiên bản mới đồng nghĩa với `docker compose stop` rồi `up`. Dù chỉ mất vài giây, các kết nối đang dở dang của khách hàng đều bị đứt (connection drop).
3. **Bài toán mở rộng đa máy chủ:** Muốn chạy 5 bản sao (instances) của API trên 3 con VPS khác nhau, Docker thuần túy bắt đầu biến thành cơn ác mộng: Làm sao định tuyến request? Làm sao biết container trên máy B vừa crash để đẩy tải sang máy C?

Lúc này, ta nhận ra: **Docker chỉ là công nhân xây gạch, ta đang thiếu một người chỉ huy công trường (Orchestrator).**

---

## 2. Docker Swarm: Chiếc Cầu Nối Ngắn Ngủi

Trước khi nghĩ đến "con quái vật" Kubernetes, lựa chọn tự nhiên và nhẹ nhàng nhất chính là **Docker Swarm**.

Swarm được tích hợp sẵn ngay trong Docker engine. Bạn chỉ cần gõ `docker swarm init` trên một máy, `docker swarm join` trên các máy phụ, là đã có ngay một cụm Cluster với tính năng:
- Dùng chung cú pháp file compose (`docker stack deploy`).
- Tự động cân bằng tải nội bộ qua mạng ảo (Ingress Routing Mesh).
- Khai báo số lượng bản sao dễ dàng: `replicas: 3`.

```
                     [ INTERNET ]
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
   ┌─────────────────┐         ┌─────────────────┐
   │  SWARM NODE 1   │ <=====> │  SWARM NODE 2   │
   │  (Manager/App)  │ Overlay │  (Worker/App)   │
   └─────────────────┘ Network └─────────────────┘
```

### Vì sao Swarm dần hụt hơi trong thực tế?

Swarm rất thanh lịch cho các team nhỏ, nhưng khi vận hành sâu, nó bộc lộ những giới hạn cố hữu:
- **Routing Mesh thiếu ổn định ở tải cao:** Lớp mạng Overlay của Swarm đôi khi gặp hiện tượng nghẽn IPVS ngầm hoặc mất gói tin khi các node thay đổi trạng thái liên tục.
- **Hệ sinh thái nghèo nàn:** Không có chuẩn Ingress linh hoạt (như Traefik, Nginx Ingress Controller với SSL tự động của cert-manager), thiếu hệ thống giám sát tự động và không có cơ chế Auto-scaling thực thụ theo chỉ số CPU/RAM.
- **Quản lý Volume đa node kém:** Nếu một container ghi dữ liệu vào ổ đĩa trên Node 1 bị chết và Swarm tự khởi động lại nó trên Node 2, dữ liệu ở Node 1 sẽ không thể tự bay theo.

Đó là lúc chúng ta buộc phải bước lên chuyến tàu **Kubernetes**.

---

## 3. K3s Đến K8s: Bản Chất Của Cỗ Máy Điều Phối

Nhiều người e sợ Kubernetes vì sự cồng kềnh: nó đòi hỏi ít nhất 2–3 master nodes, ngốn vài GB RAM chỉ để duy trì các thành phần điều khiển (etcd, kube-apiserver, kube-scheduler, kube-controller-manager). 

Đó là lý do **K3s** ra đời. K3s là bản phân phối Kubernetes siêu nhẹ do Rancher phát triển:
- Đóng gói toàn bộ thành một binary duy nhất dưới 100MB.
- Thay thế etcd nặng nề bằng SQLite (hoặc Postgres bên ngoài).
- Chạy mượt mà chỉ với 512MB – 1GB RAM trên các con VPS giá rẻ hoặc Raspberry Pi.

K3s là cánh cửa hoàn hảo để bước vào thế giới tư duy K8s chuẩn mực mà không bị gánh nặng tài nguyên đè bẹp.

```
                 ┌────────────────────────────────┐
                 │     KUBERNETES CONTROL PLANE   │
                 │   (Mong muốn: replicas = 3)    │
                 └────────────────────────────────┘
                                 │
           VÒNG LẶP ĐIỀU KHIỂN (RECONCILIATION LOOP)
      "So sánh liên tục giữa Thực tế và Khai báo"
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│  Pod 1: OK   │            │  Pod 2: OK   │            │ Pod 3: CRASH │
└──────────────┘            └──────────────┘            └──────────────┘
                                                               │
                                               TỰ ĐỘNG TẠO POD MỚI THAY THẾ!
```

### Tư duy cốt lõi làm nên sức mạnh của Kubernetes

Khác biệt lớn nhất của K8s không phải là chạy container, mà là **Mô hình Trạng thái Khai báo (Declarative State)** và **Vòng lặp Đối soát (Reconciliation Loop)**:

Ta không ra lệnh: *"Hãy chạy container này lên cho tôi"* (Imperative).  
Ta khai báo: *"Tôi muốn hệ thống LUÔN CÓ 3 Pod backend phiên bản v1.2 chạy khỏe mạnh"* (Declarative).

Hệ thống sẽ chạy một vòng lặp vô tận:
1. Đọc trạng thái khai báo (Desired State).
2. Kiểm tra thực tế ngoài cluster (Current State).
3. Nếu phát hiện sai lệch (ví dụ 1 Pod bị chết do Out of Memory), K8s sẽ **ngay lập tức tự sinh một Pod mới ở một Node khác còn tài nguyên** để bù vào.

---

## 4. Bài Toán Sinh Tử: Database Trong Container

Nếu coi ứng dụng Stateless (API, Web) trong container như **bầy gia súc (Cattle)** — con nào ốm chết thì hủy đi thay con khác trong tích tắc; thì Database là **thú cưng (Pet)** — phải chăm bẵm từng chút một, chết là mất sạch tài sản.

Dưới đây là 3 cấp độ tổ chức Database từ nhỏ đến lớn mà mình đã rút ra sau nhiều lần "trả học phí":

```
┌────────────────────────────────────────────────────────────────────────┐
│               MÔ HÌNH TIẾN HÓA CỦA DATABASE THEO QUY MÔ                │
├──────────────────┬───────────────────────┬─────────────────────────────┤
│   HỆ THỐNG NHỎ   │     HỆ THỐNG VỪA      │        HỆ THỐNG LỚN         │
├──────────────────┼───────────────────────┼─────────────────────────────┤
│  VPS Độc lập     │  Dedicated Host hoặc  │  Cloud Managed Database     │
│  (Bare-metal)    │  StatefulSet + NVMe   │  (RDS/Aurora) hoặc Cluster  │
│  hoặc Docker     │  Persistent Volume    │  Multi-Node Operator        │
│  Single Volume   │  (Local Path)         │  (CloudNativePG / Patroni)  │
└──────────────────┴───────────────────────┴─────────────────────────────┘
```

### Cấp độ 1: Hệ thống Nhỏ (Pet Projects, Start-up giai đoạn đầu)
* **Sai lầm kinh điển:** Cố nhét Database vào Kubernetes cluster chạy trên cụm 2-3 con VPS rẻ tiền, dùng Network Storage (NFS) chậm rì làm đĩa cứng cho Postgres. Hậu quả là database bị nghẽn I/O khóa cứng table (Deadlock).
* **Kiến trúc khuyên dùng:**
  * **Tách DB ra khỏi K8s hoàn toàn.**
  * Cài PostgreSQL/MySQL trực tiếp lên một con VPS độc lập qua `systemd`, hoặc chạy một container Docker độc lập với **Named Volume** gắn trực tiếp vào đĩa SSD cục bộ.
  * Giữ mọi thứ đơn giản nhất có thể để dồn sức cho nghiệp vụ sản phẩm.

### Cấp độ 2: Hệ thống Vừa (Scale-up, Doanh nghiệp vừa)
Khi hệ thống bắt đầu có lượng người dùng lớn và cần chạy trong cụm K8s:
* **Tuyệt đối không dùng Deployment thông thường:** Phải dùng **`StatefulSet`**. StatefulSet cung cấp định danh mạng cố định (`postgres-0`, `postgres-1`) và liên kết đĩa cứng 1-1 không bị hoán đổi nhầm lẫn.
* **Lựa chọn ổ đĩa (StorageClass):** Tránh xa các loại ổ đĩa chia sẻ qua mạng chậm chạp. Hãy sử dụng **Local Path Provisioner** (dùng trực tiếp ổ NVMe của máy chủ vật lý chứa node đó) để đạt IOPS tối đa cho Database.
* **Sử dụng Kubernetes Operator:** Không tự viết script quản lý replication thủ công. Hãy dùng các Operator chuẩn công nghiệp như **CloudNativePG** hoặc **Crunchy Data PGO**. Các Operator này tự xử lý failover tự động (khi node master chết, replica tự lên thay trong vài giây).

### Cấp độ 3: Hệ thống Lớn (Enterprise, High Availability đa vùng)
* **Tách biệt hoàn toàn tầng Tính toán (Compute) và Lưu trữ (State):**
  * Sử dụng **Managed Database** từ các nhà cung cấp đám mây lớn (AWS Aurora, Google Cloud SQL) nếu có ngân sách. Để đội ngũ chuyên gia của Cloud lo phần hạ tầng, snapshot phần cứng và failover tự động.
  * Nếu tự host on-premise: Dựng cụm Postgres chuyên dụng với **Patroni + Etcd + HAProxy**, đặt trước đó một tầng **PgBouncer** để gộp connection pool (ngăn ngừa cạn kiệt kết nối khi K8s scale hàng trăm Pod API).

---

## 5. Chiến Lược Backup, Bảo Trì & Phục Hồi: Những "Vết Sẹo" Thực Chiến

### Sai lầm nhớ đời:
> *Ngày mới vào nghề, mình từng viết cronjob sao lưu database bằng cách... copy toàn bộ thư mục `/var/lib/postgresql/data` nén lại thành file tar.gz. Cho đến một ngày server gặp sự cố, giải nén ra thì Postgres từ chối khởi động vì dữ liệu bị ghi dở dang đúng lúc copy (Data Corruption). Đó là ngày mình thức trắng 24 tiếng để cứu từng dòng log.*

Dưới đây là các nguyên tắc sinh tử khi sao lưu dữ liệu:

```
                     [ POSTGRESQL DATABASE ]
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
1. LOGICAL BACKUP                               2. PHYSICAL ARCHIVING
   (Hàng ngày / Hàng tuần)                         (Liên tục từng giây)
   • pg_dump nén gzip                              • WAL Archiving (WAL-G)
   • Dễ phục hồi qua phiên bản                     • Phục hồi theo mốc thời gian
   • Nhẹ, portable                                 • Point-in-Time Recovery (PITR)
        │                                               │
        └───────────────────────┬───────────────────────┘
                                ▼
              [ CLOUD OBJECT STORAGE (S3 / R2) ]
                   • Mã hóa AES-256
                   • Khóa chống xóa (Object Lock)
                   • Retention Policy: 30 ngày
```

### 1. Phân biệt Logical Backup vs. Physical Backup

* **Logical Backup (`pg_dump` / `mysqldump`):**
  * Xuất toàn bộ bảng và dữ liệu thành các câu lệnh SQL (`CREATE TABLE`, `INSERT`).
  * **Ưu điểm:** Cực kỳ an toàn, có thể restore sang một phiên bản database khác hoặc server khác dễ dàng.
  * **Nhược điểm:** Chậm khi dữ liệu lên tới hàng trăm GB; chiếm CPU khi dump.
  * **Tần suất:** Chạy tự động mỗi đêm một lần vào giờ thấp điểm (02:00 AM).

* **Physical Backup & WAL Archiving (PITR - Point-in-Time Recovery):**
  * Sử dụng các công cụ như **WAL-G** hoặc **pgBackRest**.
  * Chụp ảnh snapshot nền tảng (Base Backup) kết hợp với việc đẩy các file nhật ký ghi trước (Write-Ahead Logging - WAL) lên Cloud Storage liên tục mỗi 5 phút.
  * **Sức mạnh tối thượng:** Nếu lỡ tay gõ nhầm lệnh `DROP TABLE users;` vào lúc 14:32:10, bạn có thể ra lệnh cho hệ thống: *"Hãy phục hồi dữ liệu về chính xác thời điểm 14:32:09!"*.

### 2. Quy tắc sao lưu 3-2-1
- **3** bản sao dữ liệu (1 bản đang chạy, 2 bản backup).
- **2** loại phương tiện lưu trữ khác nhau.
- **1** bản lưu trữ hoàn toàn ngoài máy chủ (Off-site trên Cloudflare R2 / AWS S3 với tính năng Object Lock chống Ransomware).

### 3. Quy tắc vàng về phục hồi (Disaster Recovery Drill)
> **"Một bản sao lưu chưa từng được phục hồi thử nghiệm thành công thì giá trị của nó bằng 0."**

Đừng đợi đến khi máy chủ bốc cháy mới đi tìm hướng dẫn giải nén file backup. Hãy thiết lập một kịch bản diễn tập (Drill) định kỳ:
- Mỗi tháng một lần, lấy file backup mới nhất đổ vào một môi trường Staging hoàn toàn trống.
- Chạy bộ kiểm thử tự động (Smoke Test) để xác nhận dữ liệu toàn vẹn, ứng dụng kết nối đọc/ghi trơn tru.

---

## Lời Kết: Đi Tìm Sự Cân Bằng

Kubernetes không phải là liều thuốc tiên giải quyết mọi vấn đề. Nó là một chiếc máy bay phản lực — cực kỳ mạnh mẽ để chở hàng trăm hành khách vượt đại dương, nhưng sẽ là thảm họa lãng phí nếu bạn chỉ cần đi từ đầu làng đến cuối xóm.

- Đừng ngần ngại bắt đầu với **Docker và Docker Compose** trên một máy chủ duy nhất được gia cố cẩn thận.
- Hãy cân nhắc **Docker Swarm** hoặc **K3s** khi bạn cần sự ổn định trên 2–5 cụm node vừa phải.
- Và chỉ bước lên **Kubernetes đầy đủ** khi độ phức tạp của bài toán kinh doanh đòi hỏi hàng chục vi dịch vụ (Microservices), cơ chế tự động co giãn và đội ngũ kỹ sư đủ chuyên môn để vận hành.

Biết rõ giới hạn của công cụ và khiêm nhường trước dữ liệu của người dùng — đó mới là bản lĩnh thực sự của một người làm kiến trúc hệ thống.
