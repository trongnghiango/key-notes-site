---
date: 2025-01-01
modified: Wednesday 1st January 2025 11:00:00
title: Cách tạo nhanh dự án python và quản lý dependencies.
draft: false
categories:
  - python
  - project
  - dependencies
---

- Có rất nhiều công cụ để tạo và quản lý 1 dự án python khác nhau như: poetry, pipenv, conda, ...
- Nhưng việc cài đặt các công cụ đó thì mất thời gian, đặc biệt là cho những người dùng nhiều máy tính cũng như dùng chung cho 1 team.
- Vì vậy tôi sẽ thực hiện việc trên nhưng không cần cài đặt bất kỳ công cụ nào mà tận dụng các package có sẵn của python để thực hiện.
- Dùng pip + venv

### Option: phần này là bổ sung cho cách dùng pip + venv:
- Vì cách này ta không thể set up python version nên ta có thể pyenv để quản lý version cho hệ thống
- điều này đã phá vỡ nguyên tắc không cài bất cứ công cụ nào trên máy tính.
- Vì vậy cách này thường áp dụng cho dự án nhỏ và ít phụ thuộc python version.

### Cách triển khai
#### B1: Cài python nếu chưa cài (yêu cầu tối thiểu để chạy python, có thể cài pyenv -> rồi dùng pyenv cài python)
#### B2: cài môi trường ảo dung venv:
```sh
python -m venv my_venv
```

#### B3: Activate môi trường: (lưu ý trỏ đúng thư mục)
```sh
source my_venv/bin/activate
```
- có thể kiểm tra version python (python sẽ luôn nằm trong thư mục ảo và cô lập với python hệ thống)
```sh
which python
/Users/user/my_project/my_venv/bin/python
```
- Deactivate khi không dùng:
```sh
deactivate
```
#### B4: cài đặt các dependencies bằng pip:
```sh
pip install fastapi uvicorn
```

#### B5: có thể xuất ra file requirement.txt để chia sẻ trong team
```sh
(my_venv)$ pip freeze > requirements.txt
(my_venv)$ cat requirements.txt
```
#### B6: Sử dụng lệnh sau để cài lại dependencies khi chuyển máy:
```sh
pip install -r requirements.txt
```
