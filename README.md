Backend - Short URL App
🚀 Project Overview

Backend của hệ thống Short URL App được xây dựng nhằm cung cấp API cho việc:

Tạo short URL từ URL gốc
Redirect từ short URL về URL ban đầu
Theo dõi số lượt click
Lấy danh sách các URL đã tạo
Xem thống kê chi tiết cho từng URL

Hệ thống được thiết kế theo hướng RESTful API, dễ mở rộng và maintain.

✨ Features Implemented
✅ Tạo short URL từ original URL
✅ Validate input với Zod
✅ Redirect từ short URL
✅ Lưu số lượt click
✅ Lấy danh sách tất cả URL
✅ Sắp xếp theo số lượt click
✅ Xem thống kê từng URL
✅ Middleware validate request
✅ Xử lý lỗi chuẩn hóa
🛠 Tech Stack
Node.js + Express.js
TypeORM
PostgreSQL
Zod (validation)
TypeScript
UUID / NanoID (generate short code)
🧠 Architecture Overview

Backend được tổ chức theo cấu trúc:

src/
├── controllers/ // Xử lý request/response
├── services/ // Business logic
├── entities/ // TypeORM entities (database models)
├── routes/ // Định nghĩa API routes
├── middlewares/ // Middleware (validate, error handling)
├── schemas/ // Zod validation schemas
├── config/ // Config DB, env
└── utils/ // Helper functions
Flow xử lý request:
Client → Route → Middleware (validate) → Controller → Service → Database
📡 API Design

1. Tạo short URL
   POST /api/v1/shorten

Request body:

{
"originalUrl": "https://example.com"
}

Response:

{
"success": true,
"data": {
"id": 1,
"originalUrl": "https://example.com",
"shortUrl": "http://localhost:5000/api/v1/abc123",
"code": "abc123",
"totalClicks": 0
}
} 2. Redirect URL
GET /api/v1/:code

👉 Redirect về originalUrl

3. Lấy danh sách URL
   GET /api/v1/urls
4. Lấy thống kê theo ID
   GET /api/v1/urls/:id/stats
   🗄 Data Model
   ShortUrl Entity
   {
   id: number;
   originalUrl: string;
   code: string;
   totalClicks: number;
   createdAt: Date;
   }
   Giải thích:
   originalUrl: URL gốc
   code: mã rút gọn (unique)
   totalClicks: số lần truy cập
   createdAt: thời gian tạo
   ⚙️ How to Run
5. Clone project
   git clone <repo-url>
   cd backend
6. Cài đặt dependencies
   npm install
7. Tạo file .env
   PORT=5000
   DATABASE_URL=postgres://username:password@localhost:5432/short_url_db
8. Chạy database

Đảm bảo PostgreSQL đang chạy và database đã được tạo.

5. Run server
   npm run dev
6. Test API
   Base URL: http://localhost:5000/api/v1
