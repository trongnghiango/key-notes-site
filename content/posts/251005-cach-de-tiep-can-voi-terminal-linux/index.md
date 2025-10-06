---
date: 2025-10-05
modified: 2025-10-05T11:10:37Z
title: Lộ Trình Học Linux CLI
draft: false
toc: true
categories:
  - linux
  - shell
---

Việc ưu tiên học Linux qua giao diện dòng lệnh (CLI) trên Terminal là một định hướng rất đúng đắn và hiệu quả để có thể hiểu sâu và làm chủ hệ điều hành này. Dưới đây là lộ trình học chi tiết từ cơ bản đến nâng cao, giúp bạn xây dựng nền tảng vững chắc.

### Giai đoạn 1: Nhập môn và những lệnh cơ bản nhất

Ở giai đoạn này, mục tiêu là làm quen với Terminal và thực hiện các thao tác cơ bản nhất trên hệ thống tệp tin.

**1. Làm quen với Terminal (Shell):**
*   **Shell là gì?** Hiểu rằng Shell là một chương trình thông dịch lệnh, cho phép bạn tương tác với hệ điều hành thông qua các câu lệnh. Hầu hết các bản phân phối Linux đều sử dụng giao diện dòng lệnh (CLI) vì nó mạnh mẽ và hiệu quả hơn so với giao diện đồ họa (GUI).
*   **Mở Terminal:** Tìm hiểu cách mở ứng dụng Terminal trên bản phân phối Linux bạn đang sử dụng (thường là tổ hợp phím `Ctrl + Alt + T`).
*   **Cấu trúc một câu lệnh:** Một lệnh trong Linux thường bao gồm: `tên_lệnh -tùy_chọn đối_số`.

**2. Các lệnh điều hướng và quản lý tệp tin, thư mục:**
*   `pwd` (Print Working Directory): Hiển thị đường dẫn của thư mục hiện tại bạn đang làm việc.
*   `ls` (List): Liệt kê danh sách các tệp và thư mục.
    *   Học thêm các tùy chọn phổ biến như `ls -l` (hiển thị chi tiết) và `ls -a` (hiển thị cả các tệp ẩn).
*   `cd` (Change Directory): Thay đổi thư mục làm việc.
    *   `cd ten_thu_muc`: Di chuyển vào một thư mục con.
    *   `cd ..`: Di chuyển ra thư mục cha.
    *   `cd ~` hoặc `cd`: Quay về thư mục nhà (home) của người dùng.
*   `mkdir` (Make Directory): Tạo một thư mục mới.
*   `touch`: Tạo một tệp tin trống.
*   `cp` (Copy): Sao chép tệp tin hoặc thư mục.
*   `mv` (Move): Di chuyển hoặc đổi tên tệp tin, thư mục.
*   `rm` (Remove): Xóa tệp tin.
*   `rmdir` (Remove Directory): Xóa thư mục rỗng.
    *   Lưu ý: Để xóa thư mục có chứa nội dung, bạn sẽ dùng `rm -r ten_thu_muc`.

**3. Xem nội dung tệp tin:**
*   `cat` (Concatenate): Hiển thị toàn bộ nội dung của một tệp.
*   `less` và `more`: Hiển thị nội dung tệp theo từng trang, giúp xem các tệp dài dễ dàng hơn.
*   `head`: Xem 10 dòng đầu tiên của một tệp.
*   `tail`: Xem 10 dòng cuối cùng của một tệp, rất hữu ích khi xem các tệp log.

### Giai đoạn 2: Kỹ năng trung cấp và quản lý hệ thống

Sau khi đã quen với các thao tác cơ bản, bạn sẽ học cách quản lý người dùng, quyền hạn, tiến trình và cài đặt phần mềm.

**1. Quản lý người dùng và quyền hạn:**
*   `sudo` (SuperUser Do): Thực thi một lệnh với quyền quản trị viên (root).
*   `whoami`: Cho biết bạn đang đăng nhập với tư cách người dùng nào.
*   `groups`: Xem các nhóm mà người dùng hiện tại là thành viên.
*   `chmod` (Change Mode): Thay đổi quyền truy cập (đọc, ghi, thực thi) của một tệp hoặc thư mục.
*   `chown` (Change Owner): Thay đổi chủ sở hữu của một tệp hoặc thư mục.

**2. Tìm kiếm và lọc nội dung:**
*   `grep`: Tìm kiếm một chuỗi văn bản bên trong các tệp. Lệnh này sẽ liệt kê tên tệp và hiển thị các dòng khớp, với văn bản khớp được tô sáng.
*   `find`: Tìm kiếm tệp và thư mục dựa trên các tiêu chí như tên, kích thước, ngày sửa đổi...

**3. Quản lý tiến trình (Process):**
*   `ps`: Liệt kê các tiến trình đang chạy.
*   `kill`: Dừng một tiến trình đang bị treo hoặc không phản hồi.
*   `top` / `htop`: Theo dõi tài nguyên hệ thống (CPU, RAM) và các tiến trình đang sử dụng chúng theo thời gian thực.

**4. Trình soạn thảo văn bản trên Terminal:**
*   **Nano:** Một trình soạn thảo đơn giản và dễ sử dụng cho người mới bắt đầu.
*   **Vim/Vi:** Một trình soạn thảo mạnh mẽ hơn nhưng có đường cong học tập dốc hơn. Nắm vững Vim sẽ tăng tốc độ làm việc của bạn lên đáng kể.

**5. Quản lý phần mềm:**
*   Học cách sử dụng trình quản lý gói của bản phân phối bạn đang dùng để cài đặt, cập nhật và gỡ bỏ phần mềm.
    *   **Debian/Ubuntu:** `apt`, `apt-get`
    *   **Red Hat/CentOS/Fedora:** `yum`, `dnf`

### Giai đoạn 3: Nâng cao và tự động hóa

Đây là giai đoạn bạn sẽ học cách tự động hóa các tác vụ và hiểu sâu hơn về cách hoạt động của hệ thống.

**1. Shell Scripting (Lập trình Bash Script):**
*   **Biến và vòng lặp:** Học cách tạo các kịch bản (script) để tự động hóa các chuỗi lệnh lặp đi lặp lại.
*   **Câu lệnh điều kiện (if-else):** Giúp script của bạn có thể đưa ra quyết định dựa trên các điều kiện khác nhau.
*   Mục tiêu là có khả năng tự động hóa các tác vụ và quản lý hệ thống bằng shell script.

**2. Quản lý hệ thống nâng cao:**
*   **I/O Redirection và Pipes:**
    *   `>` và `>>`: Chuyển hướng đầu ra của một lệnh vào một tệp.
    *   `|` (Pipe): Sử dụng đầu ra của lệnh này làm đầu vào cho lệnh khác, một công cụ cực kỳ mạnh mẽ.
*   **Quản lý dịch vụ (Services):**
    *   `systemctl`: Điều khiển các dịch vụ hệ thống (start, stop, restart, enable).
*   **Lập lịch công việc:**
    *   `cron`: Lên lịch để các lệnh hoặc script tự động chạy vào những thời điểm nhất định.

**3. Mạng cơ bản (Networking):**
*   `ping`: Kiểm tra kết nối tới một máy chủ khác.
*   `ifconfig` / `ip addr`: Xem thông tin cấu hình mạng của bạn.
*   `ssh` (Secure Shell): Đăng nhập và điều khiển một máy tính khác từ xa một cách an toàn.

### Tài liệu và khóa học tham khảo

Để hỗ trợ lộ trình học, bạn có thể tìm đến các nguồn tài liệu và khóa học sau:
*   **Sách:** "Linux Command Line and Shell Scripting Bible" là một tài liệu rất hay và chuyên sâu về dòng lệnh Linux.
*   **Khóa học trực tuyến:** Các nền tảng như Udemy, Coursera hay các trung tâm tin học đều có các khóa học quản trị hệ thống Linux từ cơ bản đến nâng cao.

