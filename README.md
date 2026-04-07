# Node.js Request Echo Server

Server Node.js đơn giản để nhận **mọi request** từ user, in toàn bộ nội dung request ra màn hình (log), và trả lại dữ liệu request dưới dạng JSON.

## Tính năng
- Nhận mọi HTTP method và mọi path
- Đọc body request (nếu có)
- Log đầy đủ thông tin request: method, url, headers, body, timestamp
- Không dùng database

## Chạy local
```bash
npm install
npm start
```

Server chạy mặc định ở cổng `3000` hoặc dùng `PORT` từ môi trường.

## Test nhanh
```bash
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"hello":"world"}'
```

## Deploy lên Render
Repo đã có sẵn file `render.yaml` để Render tự nhận diện service.

Các bước:
1. Push code lên GitHub
2. Vào Render > New > Blueprint
3. Chọn repo
4. Render sẽ đọc `render.yaml` và deploy tự động
