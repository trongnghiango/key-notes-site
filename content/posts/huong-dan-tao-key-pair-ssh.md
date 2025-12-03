+++
title = 'Huong Dan Tao Key Pair Ssh'
description = ""
date = '2025-07-05T14:02:17+07:00'
image = ""
imageBig = ""
authors = ["Kaka"]
tags = ["ssh"]
categories = ["general"]
draft = false
+++

## Đây là hướng dẫn chi tiết từng bước để tạo và sử dụng cặp khóa SSH (SSH key pair) cho việc kết nối an toàn giữa máy client (máy tính của bạn) và server, áp dụng cho cả trường hợp chung (như đăng nhập VPS) và trường hợp riêng cho Git (GitHub, GitLab, Bitbucket).

### Phần A: Hiểu về SSH Key

SSH Key là một phương thức xác thực an toàn hơn nhiều so với mật khẩu. Nó bao gồm một cặp khóa:

1.  **Private Key (Khóa riêng tư):**

    - File này nằm trên máy client của bạn.
    - **TUYỆT ĐỐI KHÔNG** chia sẻ file này cho bất kỳ ai. Nó giống như chìa khóa nhà của bạn.
    - Tên file thường là `id_ed25519` hoặc `id_rsa`.

2.  **Public Key (Khóa công khai):**
    - File này bạn sẽ sao chép và đặt lên các server mà bạn muốn kết nối.
    - Nó giống như ổ khóa bạn gắn trên cửa. Ai có chìa khóa (private key) tương ứng mới mở được.
    - Tên file thường là `id_ed25519.pub` hoặc `id_rsa.pub`.

**Lợi ích:**

- **Bảo mật hơn:** Khó bị tấn công brute-force (dò mật khẩu) hơn rất nhiều.
- **Tiện lợi hơn:** Không cần nhập mật khẩu mỗi lần kết nối (nếu bạn không đặt passphrase cho key).

---

### Phần B: Hướng Dẫn Tạo Cặp Khóa SSH

Quá trình này giống nhau cho mọi mục đích (cả chung và cho Git).

**Bước 1: Mở Terminal (Dòng lệnh)**

- **Trên macOS hoặc Linux:** Mở ứng dụng `Terminal`.
- **Trên Windows:** Mở `Git Bash` (được cài đặt cùng với Git for Windows) hoặc `Windows Terminal` với PowerShell/WSL. **Khuyến khích dùng Git Bash** vì nó có sẵn các công cụ cần thiết.

**Bước 2: Chạy lệnh `ssh-keygen`**

Trong terminal, gõ lệnh sau. Chúng ta sẽ dùng thuật toán `Ed25519` vì nó hiện đại, an toàn và hiệu quả hơn RSA.

```bash
ssh-keygen -t ed25519 -C "ts@gmail.com"
```

- `-t ed25519`: Chỉ định loại khóa là Ed25519. Nếu bạn cần tương thích với các hệ thống rất cũ, có thể dùng `rsa` với `-t rsa -b 4096`.
- `-C "your_email@example.com"`: Thêm một "comment" vào cuối key. Đây là một thói quen tốt để nhận diện key này thuộc về ai hoặc dùng cho máy nào. Hãy thay bằng email thật của bạn (email bạn dùng cho GitHub/GitLab).

**Bước 3: Trả lời các câu hỏi**

Sau khi chạy lệnh trên, bạn sẽ được hỏi một vài câu:

1.  **`Enter file in which to save the key (/home/user/.ssh/id_ed25519):`**

    - Đây là nơi lưu cặp khóa của bạn. Đường dẫn mặc định (`~/.ssh/id_ed25519`) là tốt nhất.
    - **Chỉ cần nhấn `Enter` để chấp nhận mặc định.**

2.  **`Enter passphrase (empty for no passphrase):`**

    - Đây là một lớp bảo mật bổ sung. Nếu bạn đặt passphrase, mỗi lần sử dụng key, bạn sẽ phải nhập passphrase này. Nó giống như mật khẩu cho chính chìa khóa của bạn.
    - **Khuyến nghị:** Nên đặt một passphrase đủ mạnh để bảo vệ private key nếu máy tính của bạn bị xâm nhập.
    - Nếu bạn muốn tiện lợi tối đa và chấp nhận rủi ro, có thể nhấn `Enter` để bỏ trống.

3.  **`Enter same passphrase again:`**
    - Nhập lại passphrase bạn vừa đặt. Nếu bỏ trống ở trên, cứ nhấn `Enter`.

**Bước 4: Hoàn tất**

Nếu thành công, bạn sẽ thấy một thông báo tương tự như sau:

```
Your identification has been saved in /home/user/.ssh/id_ed25519
Your public key has been saved in /home/user/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:someRandomCharacters your_email@example.com
The key's randomart image is:
+--[ED25519 256]--+
|        .o+=+.   |
|         o=o..   |
|        . ooo    |
|         o...    |
|        S. . .   |
|       . +.   .  |
|      . +..  . . |
|       =o+  . E .|
|      .=o+.  ... |
+----[SHA256]-----+
```

Bây giờ bạn đã có 2 file trong thư mục `~/.ssh`:

- `id_ed25519`: **KHÓA RIÊNG TƯ (PRIVATE KEY)** - Giữ bí mật!
- `id_ed25519.pub`: **KHÓA CÔNG KHAI (PUBLIC KEY)** - Dùng để chia sẻ.

---

### Phần C: Sử dụng SSH Key

#### I. Cho Kết Nối Server Chung (VPS, Máy chủ Linux...)

Mục tiêu: Đăng nhập vào server `user@server_ip` mà không cần mật khẩu.

**Bước 1: Lấy nội dung Public Key**

Mở terminal trên máy client của bạn và chạy lệnh sau để hiển thị nội dung khóa công khai:

```bash
cat ~/.ssh/id_ed25519.pub
```

Bạn sẽ thấy một chuỗi dài bắt đầu bằng `ssh-ed25519...` và kết thúc bằng email của bạn. Hãy sao chép toàn bộ chuỗi này.

**Bước 2: Thêm Public Key vào Server**

Có 2 cách:

**Cách 1: Dùng `ssh-copy-id` (Dễ nhất & Khuyến khích)**

Nếu máy client của bạn (Linux/macOS/Git Bash trên Windows) có lệnh `ssh-copy-id`, hãy dùng nó. Lệnh này sẽ tự động sao chép và cài đặt public key của bạn lên server.

```bash
ssh-copy-id user@server_ip
```

- Thay `user` bằng username của bạn trên server.
- Thay `server_ip` bằng địa chỉ IP hoặc domain của server.
- Lệnh này sẽ hỏi mật khẩu của `user` trên server **một lần cuối cùng** để thực hiện việc sao chép.

**Cách 2: Sao chép thủ công**

Nếu không có `ssh-copy-id`, bạn làm như sau:

1.  Đăng nhập vào server bằng mật khẩu như bình thường:
    ```bash
    ssh user@server_ip
    ```
2.  Trên server, chạy lệnh sau để mở (hoặc tạo) file `authorized_keys`:
    ```bash
    nano ~/.ssh/authorized_keys
    ```
3.  Dán nội dung public key bạn đã sao chép ở Bước 1 vào file này. Mỗi key nên nằm trên một dòng riêng.
4.  Lưu lại và thoát (Trong `nano`: `Ctrl+X`, sau đó `Y`, rồi `Enter`).
5.  Thiết lập quyền truy cập cho file và thư mục để đảm bảo an toàn:
    ```bash
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    ```

**Bước 3: Kiểm tra kết nối**

Thoát khỏi server và thử đăng nhập lại từ máy client:

```bash
ssh user@server_ip
```

Lần này, bạn sẽ được đăng nhập thẳng vào server mà không cần mật khẩu (hoặc chỉ cần nhập passphrase nếu bạn đã đặt).

#### II. Cho Kết Nối Git (GitHub, GitLab, Bitbucket...)

Mục tiêu: `git push`, `git pull` từ các dịch vụ Git mà không cần nhập username/password.

**Bước 1: Lấy nội dung Public Key**

Giống như trên, chạy lệnh này trên máy client để sao chép khóa công khai:

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy toàn bộ output.

**Bước 2: Thêm Public Key vào tài khoản Git của bạn (Ví dụ với GitHub)**

1.  Đăng nhập vào **GitHub**.
2.  Click vào ảnh đại diện của bạn ở góc trên bên phải, chọn **Settings**.
3.  Trong menu bên trái, chọn **SSH and GPG keys**.
4.  Click vào nút **New SSH key**.
5.  **Title:** Đặt một cái tên dễ nhận biết cho key này (ví dụ: "My Macbook Pro", "Work PC").
6.  **Key:** Dán toàn bộ nội dung public key bạn đã sao chép ở Bước 1 vào đây.
7.  Click **Add SSH key**.

_Quá trình này tương tự cho GitLab và Bitbucket trong phần Settings của tài khoản._

**Bước 3: Kiểm tra kết nối**

Mở terminal trên máy client và chạy lệnh sau để xác thực với GitHub:

```bash
ssh -T git@github.com
```

- Nếu kết nối lần đầu, bạn có thể thấy cảnh báo `Are you sure you want to continue connecting (yes/no/[fingerprint])?`. Gõ `yes` và nhấn Enter.
- Nếu thành công, bạn sẽ nhận được thông báo:
  `Hi username! You've successfully authenticated, but GitHub does not provide shell access.`
  Như vậy là đã kết nối thành công!

**Bước 4: Sử dụng Git với SSH**

Khi bạn `clone` một repository, hãy đảm bảo bạn dùng URL dạng SSH, không phải HTTPS.

- URL dạng HTTPS: `https://github.com/username/repository.git`
- URL dạng SSH: `git@github.com:username/repository.git`

Nếu bạn đã clone bằng HTTPS, bạn có thể chuyển sang SSH bằng lệnh sau (chạy trong thư mục repo của bạn):

```bash
git remote set-url origin git@github.com:USERNAME/REPONAME.git
```

Từ giờ, mọi thao tác `git push`, `git pull` sẽ sử dụng SSH key của bạn để xác thực.

Chúc bạn thành công
