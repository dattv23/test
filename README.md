# Node.js Request Echo Server

Server Node.js để nhận **mọi request** từ user, in toàn bộ nội dung request ra màn hình (log), đồng thời hiển thị lịch sử request trên trang chính.

## Tính năng
- Nhận mọi HTTP method và mọi path
- Đọc body request (nếu có)
- Log đầy đủ thông tin request: method, url, headers, body, timestamp
- Hiển thị lịch sử request ngay tại trang `/`
- API xem lịch sử request dạng JSON tại `/requests`
- Không dùng database (lưu tạm trên memory)

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

Sau đó mở:
- `http://localhost:3000/` để xem dashboard request
- `http://localhost:3000/requests` để xem JSON log

## Deploy lên Render
Repo đã có sẵn file `render.yaml` để Render tự nhận diện service.

Các bước:
1. Push code lên GitHub
2. Vào Render > New > Blueprint
3. Chọn repo
4. Render sẽ đọc `render.yaml` và deploy tự động
