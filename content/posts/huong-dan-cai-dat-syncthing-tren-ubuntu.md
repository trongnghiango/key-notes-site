---
date: 2025-01-05
modified: Friday 6th January 2025 12:00:00
title: Hướng dẫn cài đặt Syncthing trên Ubuntu
draft: false
categories:
  - Data Synchronization
tags:
  - Syncthing
---


Hướng dẫn cài đặt Syncthing trên Ubuntu:

### Bước 1: Cập nhật hệ thống

Mở terminal và chạy lệnh sau để cập nhật danh sách gói:

```bash
sudo apt update
sudo apt upgrade
```

### Bước 2: Cài đặt Syncthing

1. **Cài đặt gói cần thiết**:

   ```bash
   sudo apt install -y apt-transport-https curl
   ```

2. **Thêm kho lưu trữ của Syncthing**:

   ```bash
   echo "deb https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
   ```

3. **Thêm khóa GPG**:

   ```bash
   curl -s https://syncthing.net/release-key.txt | sudo apt-key add -
   ```

4. **Cập nhật lại danh sách gói**:

   ```bash
   sudo apt update
   ```

5. **Cài đặt Syncthing**:

   ```bash
   sudo apt install syncthing
   ```

### Bước 3: Chạy Syncthing

- Để chạy Syncthing, bạn có thể sử dụng lệnh:

  ```bash
  syncthing
  ```

### Bước 4: Truy cập Giao diện Web

Mở trình duyệt và nhập địa chỉ sau để truy cập giao diện web của Syncthing:

```
http://localhost:8384
```

### Bước 5: Thiết lập Syncthing

1. **Thêm các thiết bị**: Bạn có thể thêm các thiết bị khác bằng cách sử dụng ID thiết bị.
2. **Chọn thư mục để đồng bộ hóa**: Chọn các thư mục mà bạn muốn đồng bộ hóa giữa các thiết bị.

### Bước 6: Chạy Syncthing tự động

Để chạy Syncthing như một dịch vụ, bạn có thể tạo một service file:

1. Tạo file dịch vụ:

   ```bash
   sudo nano /etc/systemd/system/syncthing.service
   ```

2. Dán nội dung sau vào file (thay `username` bằng tên người dùng của bạn):

   ```ini
   [Unit]
   Description=Syncthing - Open Source Continuous File Synchronization
   After=network.target

   [Service]
   User=username
   ExecStart=/usr/bin/syncthing
   Restart=on-failure
   Environment=STNORESTART=1

   [Install]
   WantedBy=multi-user.target
   ```

3. Lưu và thoát (Ctrl + O, Enter, Ctrl + X).

4. Bật và khởi động dịch vụ:

   ```bash
   sudo systemctl enable syncthing
   sudo systemctl start syncthing
   ```

### Bước 7: Kiểm tra trạng thái

Để kiểm tra trạng thái của dịch vụ Syncthing:

```bash
sudo systemctl status syncthing
```

### Kết thúc

Bây giờ bạn đã cài đặt và cấu hình Syncthing trên Ubuntu thành công. Bạn có thể kiểm tra giao diện web để quản lý các thiết bị và thư mục đồng bộ hóa.
