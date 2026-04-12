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
✅ Xem thống kê từng URL ( IP, Browser, OS, Referrer, Clicked At)
✅ Middleware validate request
✅ Xử lý lỗi chuẩn hóa

🛠 Tech Stack
Node.js + Express.js
TypeORM
PostgreSQL
Zod (validation)
TypeScript
Encode base62
🧠 Architecture Overview

Backend được tổ chức theo cấu trúc:

src/
├── controllers/ // Xử lý request/response
├── services/ // Business logic
├── entities/ // TypeORM entities (database models)
├── routes/ // Định nghĩa API routes
├── middlewares/ // Middleware (validate, error handling)
├── schemas/ // Zod validation schemas
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
"id": 16,
"code": "g",
"originalUrl": "https://www.youtube.com/watch?v=9vl4NdT2bnA&list=RD9vl4NdT2bnA&start_radio=1",
"shortUrl": "http://localhost:5000/api/v1/g"
},
"message": "Create shortUrl success"
} 2. Redirect URL
GET /api/v1/:code

👉 Redirect về originalUrl

3. Lấy danh sách URL
   GET /api/v1/urls

4. Lấy thống kê theo ID
   GET /api/v1/shorten/:id/stats

   🗄 Data Model
   ShortUrl Entity
   {
   id: number;
   code: string;
   originalUrl: string;
   totalClicks: number;
   createdAt: Date;
   }

   Giải thích:
   originalUrl: URL gốc
   code: mã rút gọn (unique)
   totalClicks: số lần truy cập
   createdAt: thời gian tạo
   ⚙️ How to Run

   Click Entity
   {
   id: number;
   shortUrlId: number;
   ip: string;
   browser: string;
   os: string;
   country: string;
   referrer: string;
   clickedAt: Date;
   }

   📌 Giải thích:
   id: khóa chính của bản ghi click
   shortUrlId: id của short URL được truy cập
   ip: địa chỉ IP của người dùng
   browser: trình duyệt (Chrome, Firefox,...)
   os: hệ điều hành (Windows, MacOS,...)
   country: quốc gia (xác định từ IP)
   referrer: nguồn truy cập (Google, Facebook, Direct,...)
   clickedAt: thời điểm người dùng click

   🔗 Relationship
   Một ShortUrl có nhiều Click
   Một Click thuộc về một ShortUrl

5. Clone project
   git clone <repo-url>
   cd backend
6. Cài đặt dependencies
   npm install
7. Tạo chỉnh sửa file .env
   vào file env và chỉnh sửa theo cấu hình máy
8. Chạy database
   vào PostgreSQL và tạo database có tên "shortenUrl"
   Đảm bảo PostgreSQL đang chạy và database đã được tạo.

9. Run server
   npm run dev
10. Test API
    Base URL: http://localhost:5000/api/v1
