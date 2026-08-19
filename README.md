# Sportapp

Mobile app monorepo:

- **mobile/** — React Native (Expo) + TypeScript
- **server/** — Node.js + Express + TypeScript
- **MongoDB** + **Redis** via Docker Compose

## Yêu cầu

- Node.js >= 18 (đang dùng 22)
- Docker Desktop (cho MongoDB + Redis)
- Expo Go trên điện thoại, hoặc Android/iOS emulator

## 1. Khởi động database

```bash
docker compose up -d
```

MongoDB chạy ở `localhost:27017`, Redis ở `localhost:6379`.

## 2. Backend

```bash
cd server
cp .env.example .env      # sửa JWT_SECRET
npm install
npm run dev               # http://localhost:4000
```

Kiểm tra: `GET http://localhost:4000/api/health` trả về trạng thái mongo + redis.

### API có sẵn

| Method | Endpoint            | Mô tả                     |
|--------|---------------------|---------------------------|
| GET    | /api/health         | Health check              |
| POST   | /api/auth/register  | Đăng ký (name/email/pass) |
| POST   | /api/auth/login     | Đăng nhập → trả JWT       |

## 3. Mobile

```bash
cd mobile
cp .env.example .env      # đặt EXPO_PUBLIC_API_URL
npm install
npm start                 # quét QR bằng Expo Go
```

**Lưu ý địa chỉ backend:**
- Android emulator: `http://10.0.2.2:4000`
- Điện thoại thật: `http://<LAN-IP-máy-bạn>:4000` (vd `http://192.168.1.10:4000`)
- iOS simulator / web: `http://localhost:4000`

Màn hình Home có nút "Kiểm tra kết nối backend" để xác nhận toàn bộ chuỗi hoạt động.

## Cấu trúc

```
Sportapp/
├── docker-compose.yml       # MongoDB + Redis
├── server/
│   └── src/
│       ├── config/          # env, db (mongoose), redis (ioredis)
│       ├── models/          # User
│       ├── controllers/     # authController
│       ├── routes/          # health, auth
│       ├── middleware/       # auth (JWT), errorHandler
│       ├── app.ts           # Express app
│       └── index.ts         # entry point
└── mobile/
    ├── App.tsx
    └── src/
        ├── api/client.ts    # axios + JWT interceptor
        └── screens/HomeScreen.tsx
```
