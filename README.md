# 📦 Backend - Short URL App

## 🚀 Project Overview

Backend của hệ thống Short URL App được xây dựng nhằm cung cấp API cho việc:

- Tạo short URL từ URL gốc
- Redirect từ short URL về URL ban đầu
- Theo dõi số lượt click
- Lấy danh sách các URL đã tạo
- Xem thống kê chi tiết cho từng URL ( IP, Browser, OS, Referrer, Clicked At)

Hệ thống được thiết kế theo hướng RESTful API, dễ mở rộng và maintain.

---

## ✨ Features Implemented

- ✅ Tạo short URL từ original URL
- ✅ Validate input với Zod
- ✅ Redirect từ short URL
- ✅ Lưu số lượt click
- ✅ Lấy danh sách tất cả URL
- ✅ Sắp xếp theo số lượt click
- ✅ Xem thống kê từng URL (IP, Browser, OS, Referrer, Clicked At)
- ✅ Middleware validate request
- ✅ Xử lý lỗi chuẩn hóa

---

## 🛠 Tech Stack

- **Node.js** + **Express.js**
- **TypeORM**
- **PostgreSQL**
- **Zod** (validation)
- **TypeScript**
- **Base62** encoding

---

## 🧠 Architecture Overview

Backend được tổ chức theo cấu trúc:

    src/
    ├── controllers/   # Xử lý request/response
    ├── services/      # Business logic
    ├── entities/      # TypeORM entities (database models)
    ├── routes/        # Định nghĩa API routes
    ├── middlewares/   # Middleware (validate, error handling)
    ├── schemas/       # Zod validation schemas
    └── utils/         # Helper functions

**Flow xử lý request:**

Client → Route → Middleware (validate) → Controller → Service → Database
---

## 📡 API Design

### 1. Tạo short URL
POST /api/v1/shorten
**Request body:**
```json
{
  "originalUrl": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "code": "g",
    "originalUrl": "https://www.youtube.com/...",
    "shortUrl": "http://localhost:5000/api/v1/g"
  },
  "message": "Create shortUrl success"
}
```

### 2. Redirect URL
GET /api/v1/:code
👉 Redirect về `originalUrl`

### 3. Lấy danh sách URL
GET /api/v1/urls
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "code": "2",
      "originalUrl": "https://typeorm.io/docs/query-builder/insert-query-builder",
      "totalClicks": 2,
      "createdAt": "2026-04-11T15:26:17.881Z"
    },
    {
      "id": 3,
      "code": "3",
      "originalUrl": "dsadsadsa",
      "totalClicks": 0,
      "createdAt": "2026-04-11T15:41:41.679Z"
    }
  ],
  "message": "Get all URLs successfully"
}
```



### 4. Lấy thống kê theo ID

```
GET /api/v1/shorten/:id/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "originalUrl": "https://www.youtube.com/watch?v=qaVjA4a9O7w&list=RDrxC5Nig2Pf0&index=2",
    "shortUrl": "http://localhost:5000/api/v1/1",
    "totalClicks": 6,
    "createdAt": "2026-04-11T15:24:37.568Z",
    "countries": [{ "name": "Unknown", "count": 6 }],
    "referrers": [{ "name": "Direct", "count": 6 }],
    "os": [{ "name": "Windows", "count": 6 }],
    "browsers": [{ "name": "Chrome", "count": 6 }],
    "ips": [{ "name": "::1", "count": 6 }],
    "clicksByHour": [
      { "hour": "00:00", "clicks": 0 },
      "...",
      { "hour": "22:00", "clicks": 5 },
      { "hour": "23:00", "clicks": 1 }
    ],
    "peakHour": { "hour": "22:00", "clicks": 5 },
    "clickDetails": [
      {
        "ip": "::1",
        "browser": "Chrome",
        "os": "Windows",
        "country": "Unknown",
        "referrer": "Direct",
        "clickedAt": "2026-04-11T16:34:55.888Z"
      },
     {
         "ip": "::1",
         "browser": "Chrome",
         "os": "Windows",
         "country": "Unknown",
         "referrer": "Direct",
         "clickedAt": "2026-04-11T15:25:33.608Z"
       },
      
    ]
  },
  "message": "Get stats successfully"
}
```

---

## 🗄 Data Model

### 🔹 ShortUrl Entity

```ts
{
  id: number;
  code: string;
  originalUrl: string;
  totalClicks: number;
  createdAt: Date;
}
```

| Field | Mô tả |
|---|---|
| `originalUrl` | URL gốc |
| `code` | Mã rút gọn (unique) |
| `totalClicks` | Số lần truy cập |
| `createdAt` | Thời gian tạo |

### 🔹 Click Entity

```ts
{
  id: number;
  shortUrlId: number;
  ip: string;
  browser: string;
  os: string;
  referrer: string;
  clickedAt: Date;
}
```

| Field | Mô tả |
|---|---|
| `id` | Khóa chính của bản ghi click |
| `shortUrlId` | ID của short URL được truy cập |
| `ip` | Địa chỉ IP của người dùng |
| `browser` | Trình duyệt (Chrome, Firefox,...) |
| `os` | Hệ điều hành (Windows, MacOS,...) |
| `referrer` | Nguồn truy cập (Google, Facebook, Direct,...) |
| `clickedAt` | Thời điểm người dùng click |

### 🔗 Relationship
ShortUrl (1) ──── (N) Click

Một `ShortUrl` có nhiều `Click` — một `Click` thuộc về một `ShortUrl`.

---

## ⚙️ How to Run
  Mở terminal và thực hiện các lệnh sau
### 1. Clone project

```bash
git clone https://github.com/NgThanhTinC500/shortenUrl-BE.git
cd shortenUrl-BE
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Vào file `.env` và chỉnh sửa theo máy của bạn:


### 4. Chạy database

- Mở PostgreSQL
- Tạo database tên: `shortenUrl`
- Đảm bảo PostgreSQL đang chạy

### 5. Run server

```bash
npm run dev
```

### 6. Test API

Base URL: `http://localhost:5000`

Dùng **Postman** hoặc **Thunder Client** để test.










