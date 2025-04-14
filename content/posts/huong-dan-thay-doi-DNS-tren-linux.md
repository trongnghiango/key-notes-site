---
date: 2025-04-14
modified: Monday 14th April 2025 12:00:00
title: Hướng dẫn thay đổi DNS bằng cli trên linux.
categories:
  - network
  - linux
---

Dưới đây là hướng dẫn chi tiết để cấu hình DNS tùy chỉnh trên Arch Linux, áp dụng cho cả **systemd-resolved**, **NetworkManager**, và **static DNS**:

---

## **1. Xác định dịch vụ quản lý mạng đang sử dụng**
Trước tiên, kiểm tra xem hệ thống của bạn đang dùng dịch vụ nào:
```bash
# Kiểm tra NetworkManager
systemctl status NetworkManager

# Kiểm tra systemd-resolved
systemctl status systemd-resolved

# Kiểm tra dhcpcd (nếu không dùng NetworkManager)
systemctl status dhcpcd
```

---

## **2. Cấu hình DNS theo dịch vụ**

### **2.1. Sử dụng systemd-resolved (Khuyến nghị)**
**Bước 1:** Chỉnh sửa file cấu hình:
```bash
sudo nano /etc/systemd/resolved.conf
```
Thêm hoặc sửa các dòng sau (ví dụ dùng Cloudflare DNS):
```ini
[Resolve]
DNS=1.1.1.1 1.0.0.1
DNSOverTLS=yes
FallbackDNS=8.8.8.8 8.8.4.4
```

**Bước 2:** Khởi động lại dịch vụ:
```bash
sudo systemctl restart systemd-resolved
```

**Bước 3:** Tạo symlink cho `/etc/resolv.conf` (nếu chưa có):
```bash
sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
```

### **2.2. Sử dụng NetworkManager**
#### **Cách 1: Dùng `nmcli` (CLI)**
- Liệt kê các kết nối hiện có:
  ```bash
  nmcli connection show
  ```
- Đặt DNS cho kết nối (ví dụ: kết nối `Wired`):
  ```bash
  nmcli connection modify "Wired" ipv4.dns "1.1.1.1 1.0.0.1"
  nmcli connection modify "Wired" ipv4.ignore-auto-dns yes  # Tắt DNS từ DHCP
  nmcli connection up "Wired"
  ```

#### **Cách 2: Dùng GUI**
- Mở NetworkManager từ system tray → Chọn kết nối → IPv4/IPv6 → Nhập DNS.

### **2.3. Cấu hình tĩnh qua `/etc/resolv.conf` (Không khuyến nghị)**
**Cảnh báo:** File này thường bị ghi đè bởi các dịch vụ mạng. Chỉ dùng tạm thời:
```bash
sudo nano /etc/resolv.conf
```
Thêm vào:
```conf
nameserver 1.1.1.1
nameserver 1.0.0.1
```

### **2.4. Cấu hình qua dhcpcd**
Nếu dùng `dhcpcd`, chỉnh sửa file cấu hình:
```bash
sudo nano /etc/dhcpcd.conf
```
Thêm vào cuối file:
```ini
static domain_name_servers=1.1.1.1 1.0.0.1
```
Khởi động lại dịch vụ:
```bash
sudo systemctl restart dhcpcd
```

---

## **3. Kiểm tra DNS**
Sau khi cấu hình, kiểm tra bằng các lệnh:
```bash
# Kiểm tra DNS server đang dùng
resolvectl status  # systemd-resolved
cat /etc/resolv.conf

# Test phân giải DNS
dig archlinux.org
nslookup google.com
ping -c 4 archlinux.org
```

---

## **4. Ví dụ nâng cao**
### **Sử dụng DNS-over-TLS (DoT) với systemd-resolved**
Thêm vào `/etc/systemd/resolved.conf`:
```ini
[Resolve]
DNS=1.1.1.1#cloudflare-dns.com 1.0.0.1#cloudflare-dns.com
DNSOverTLS=yes
```

### **Chặn DNS leak (nếu dùng VPN)**
Thêm rule cho `iptables`/`nftables` để chặn DNS bên ngoài VPN:
```bash
sudo iptables -A OUTPUT -p udp --dport 53 -j DROP
sudo iptables -A OUTPUT -p tcp --dport 53 -j DROP
```

---

## **5. Khắc phục sự cố**
- **DNS bị ghi đè**: Đảm bảo đã tắt DHCP DNS (ví dụ: `ipv4.ignore-auto-dns=yes` trong NetworkManager).
- **Lỗi symlink `/etc/resolv.conf`**: Chạy `sudo chattr +i /etc/resolv.conf` để khóa file (không khuyến nghị).

---

## **Tài liệu tham khảo**
- [Arch Wiki - systemd-resolved](https://wiki.archlinux.org/title/Systemd-resolved)
- [Arch Wiki - NetworkManager](https://wiki.archlinux.org/title/NetworkManager)
- [Cloudflare DNS Docs](https://developers.cloudflare.com/1.1.1.1/)
