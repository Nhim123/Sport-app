# Tích hợp VMS — API trỏ sang phần mềm quản lý sân bãi & phòng tập

> **VMS** = *Venue Management System* — phần mềm của **chủ sân / chủ phòng tập** (sân bãi, gym).
> Đây là **nguồn sự thật (source of truth)** cho: danh sách sân/gym, lịch trống, bảng giá,
> gói hội viên, **giải đấu** (chủ sân tạo), check-in.
>
> **Sportapp** (app người dùng) **không tạo** sân/gym/giải — chỉ **tra cứu + đặt + đăng ký**.
> Backend Sportapp đóng vai **adapter/gateway**: mobile gọi `/api/v1/...` của Sportapp,
> Sportapp gọi tiếp sang VMS qua một **VMS client**.

```
┌──────────┐  /api/v1/...   ┌────────────────┐  /vms/v1/...   ┌─────────────┐
│  Mobile  │ ─────────────▶ │ Sportapp (BE)  │ ─────────────▶ │     VMS     │
│  (Expo)  │ ◀───────────── │  adapter/GW    │ ◀───────────── │ (chủ sân)   │
└──────────┘    JSON        └────────────────┘   REST+webhook └─────────────┘
```

---

## 1. Phân chia trách nhiệm (ai sở hữu dữ liệu gì)

| Dữ liệu | Nguồn sự thật | Ghi chú |
|---|---|---|
| Sân, bảng giá, giờ mở/đóng | **VMS** | Sportapp cache đọc |
| Lịch trống / đã đặt (realtime) | **VMS** | Sportapp **proxy**, cache rất ngắn (≤30s) |
| Gói hội viên gym, vé ngày | **VMS** | |
| Giải đấu (tạo giải, thể lệ, lệ phí) | **VMS** | App chỉ đăng ký |
| Check-in (QR) | **VMS** | |
| Tài khoản người dùng, hồ sơ | **Sportapp** | Gửi kèm khi đặt/đăng ký |
| CLB, quỹ CLB, bình chọn, thông báo | **Sportapp** | Không đẩy sang VMS |
| "Ý định" đặt sân / đăng ký giải | **Sportapp → VMS** | Sportapp tạo, VMS xác nhận |

---

## 2. Xác thực & cấu hình

VMS cấp cho Sportapp một **service credential** (OAuth2 *client-credentials* hoặc API key per-partner).

```
# server/.env  (thêm)
VMS_BASE_URL=https://api.vms-partner.vn       # gốc API của phần mềm quản lý sân
VMS_CLIENT_ID=sportapp
VMS_CLIENT_SECRET=***                          # hoặc VMS_API_KEY nếu VMS dùng API key
VMS_WEBHOOK_SECRET=***                          # HMAC xác thực webhook VMS → Sportapp
VMS_TIMEOUT_MS=8000
```

- **Outbound (Sportapp → VMS)**: header `Authorization: Bearer <token>` (token lấy qua
  `POST {VMS_BASE_URL}/oauth/token`, cache tới khi hết hạn) **hoặc** `X-Api-Key: <VMS_API_KEY>`.
- **Idempotency**: mọi `POST` tạo đơn/đăng ký gửi header `Idempotency-Key: <uuid>` để tránh tạo trùng khi retry.
- **Danh tính người dùng**: Sportapp gửi `X-End-User-Id` (id người dùng Sportapp) để VMS đối soát/ghi nhận; **không** gửi JWT người dùng sang VMS.
- **Inbound webhook (VMS → Sportapp)**: VMS ký `X-VMS-Signature: sha256=<hmac(body, VMS_WEBHOOK_SECRET)>`.

---

## 3. Hợp đồng API của VMS (Sportapp gọi)

Base: `{VMS_BASE_URL}/vms/v1`. Tất cả trả JSON; lỗi theo mục [§6](#6-chuẩn-lỗi).

### 3.1 Sân bãi (Courts / Venues)

| Method | Path | Mục đích |
|---|---|---|
| `GET` | `/venues?sport=&district=&q=&page=&limit=` | Danh sách sân |
| `GET` | `/venues/{venueId}` | Chi tiết sân + bảng giá |
| `GET` | `/venues/{venueId}/availability?date=YYYY-MM-DD` | Khung giờ trống/đã đặt |
| `POST` | `/venues/{venueId}/bookings` | Giữ chỗ / đặt sân |
| `GET` | `/bookings/{bookingId}` | Trạng thái đặt sân |
| `DELETE` | `/bookings/{bookingId}` | Hủy đặt |

`GET /venues/{id}/availability` →
```json
{
  "venueId": "v_123",
  "date": "2026-10-18",
  "sessionMinutes": 60,
  "slots": [
    { "id": "s0600", "time": "06:00", "state": "free",   "price": 180000 },
    { "id": "s0700", "time": "07:00", "state": "booked", "price": 180000 }
  ]
}
```

`POST /venues/{id}/bookings` (body) →
```json
{
  "courtId": "c_1",
  "date": "2026-10-18",
  "slotIds": ["s0700"],
  "customer": { "name": "Nguyen Van A", "phone": "0901234567" },
  "note": "Đặt qua Sportapp",
  "payment": { "method": "indirect", "amount": 180000 }
}
```
→ `201`
```json
{ "bookingId": "bk_789", "status": "pending", "holdExpiresAt": "2026-10-18T06:55:00Z", "amount": 180000 }
```
`status`: `pending` → (webhook) → `confirmed` | `cancelled` | `expired`.

### 3.2 Phòng tập (Gym)

| Method | Path | Mục đích |
|---|---|---|
| `GET` | `/gyms/{gymId}/plans` | Gói hội viên + vé ngày (giá) |
| `POST` | `/gyms/{gymId}/day-passes` | Mua vé ngày (cá nhân / CLB) |
| `POST` | `/gyms/{gymId}/memberships` | Đăng ký hội viên |
| `GET` | `/memberships/{membershipId}` | Trạng thái thẻ |
| `POST` | `/gyms/{gymId}/checkins` | Check-in bằng QR |

`POST /gyms/{id}/day-passes` →
```json
{ "passId": "dp_55", "kind": "personal", "status": "paid", "qr": "SPORTAPP:dp_55", "validFor": "2026-10-18" }
```

### 3.3 Giải đấu (Tournaments) — chủ sân tạo, user đăng ký

| Method | Path | Mục đích |
|---|---|---|
| `GET` | `/tournaments?status=open&sport=` | Danh sách giải |
| `GET` | `/tournaments/{id}` | Chi tiết giải (thể lệ, lệ phí, sức chứa) |
| `POST` | `/tournaments/{id}/registrations` | **Đăng ký tham dự** (cá nhân / CLB) |
| `GET` | `/registrations/{regId}` | Trạng thái đăng ký |
| `DELETE` | `/registrations/{regId}` | Hủy đăng ký |

`POST /tournaments/{id}/registrations` (khớp màn `TournamentRegisterScreen`) →
```json
{
  "mode": "club",                     // "solo" | "club"
  "teamName": "Q7 Smashers",          // bắt buộc khi mode=club
  "representative": { "name": "Nguyen Van A", "email": "a@example.com", "phone": "0901234567" },
  "sport": "pickle",
  "clubId": "cl1"                      // tùy chọn, khi đăng ký theo CLB Sportapp
}
```
→ `201`
```json
{ "registrationId": "rg_42", "status": "pending", "feeAmount": 300000 }
```
`status`: `pending` → `approved` | `rejected` | `waitlist`.

---

## 4. Webhook VMS → Sportapp (cập nhật ngược)

VMS gọi `POST {SPORTAPP}/api/v1/integrations/vms/webhook`, ký HMAC (mục [§2](#2-xác-thực--cấu-hình)).
Sportapp xác thực chữ ký → cập nhật DB → bắn **event bus** (Redis Streams) + **notification** cho người dùng.

```json
{ "id": "evt_1", "type": "booking.confirmed", "occurredAt": "2026-10-18T06:40:00Z",
  "data": { "bookingId": "bk_789", "endUserId": "u_1", "status": "confirmed" } }
```

| `type` | Hành động phía Sportapp |
|---|---|
| `booking.confirmed` / `booking.cancelled` / `booking.expired` | cập nhật đơn đặt sân + notify |
| `membership.activated` / `daypass.paid` | kích hoạt thẻ/vé + notify |
| `checkin.recorded` | ghi nhận check-in |
| `tournament.updated` | làm mới cache giải (số đội, trạng thái) |
| `registration.approved` / `registration.rejected` / `registration.waitlisted` | cập nhật đăng ký + notify |

Webhook phải **idempotent** theo `id` (lưu `processedEventIds`), trả `200` nhanh; xử lý nặng đẩy qua worker.

---

## 5. Ánh xạ: Tính năng mobile → Sportapp → VMS

| Màn hình mobile | Sportapp endpoint | → VMS endpoint |
|---|---|---|
| Danh sách / tìm sân | `GET /api/v1/venues` | `GET /vms/v1/venues` |
| Chi tiết + khung giờ | `GET /api/v1/venues/:id/schedule` | `GET /vms/v1/venues/:id/availability` |
| Đặt sân / thanh toán | `POST /api/v1/bookings` | `POST /vms/v1/venues/:id/bookings` |
| Thẻ hội viên / vé ngày gym | `GET /api/v1/gym/plans`, `POST /api/v1/gym/day-passes` | `/vms/v1/gyms/:id/plans`, `/day-passes` |
| Check-in QR gym | `POST /api/v1/gym/checkins` | `POST /vms/v1/gyms/:id/checkins` |
| Giải đấu CLB (danh sách) | `GET /api/v1/tournaments` | `GET /vms/v1/tournaments` |
| **Đăng ký giải (cá nhân/CLB)** | `POST /api/v1/tournaments/:id/registrations` | `POST /vms/v1/tournaments/:id/registrations` |

---

## 6. Chuẩn lỗi

VMS trả lỗi dạng:
```json
{ "error": { "code": "SLOT_TAKEN", "message": "Khung giờ đã có người đặt" } }
```
Sportapp ánh xạ sang `ApiError(status, message)` hiện có (`middleware/errorHandler`):

| VMS code | HTTP | ApiError |
|---|---|---|
| `SLOT_TAKEN`, `TOURNAMENT_FULL` | 409 | `ApiError(409, …)` |
| `NOT_FOUND` | 404 | `ApiError(404, …)` |
| `UNAUTHORIZED` | 401/403 | `ApiError(502, 'VMS auth')` *(ẩn chi tiết nội bộ)* |
| timeout / 5xx | — | `ApiError(502, 'VMS không phản hồi')` |

Nguyên tắc: lỗi hạ tầng của VMS → **502 Bad Gateway** cho mobile (không lộ chi tiết đối tác); lỗi nghiệp vụ (hết chỗ, đã đặt) → giữ nguyên 4xx.

---

## 7. Khung code đề xuất (modular monolith hiện tại)

```
server/src/
  config/env.ts                      # + VMS_BASE_URL, VMS_CLIENT_* , VMS_WEBHOOK_SECRET
  integrations/vms/
    client.ts        # fetch có timeout + auth token cache + map lỗi → ApiError
    venues.ts        # listVenues / getAvailability / createBooking / ...
    gym.ts           # getPlans / buyDayPass / checkin / ...
    tournaments.ts   # listTournaments / register / getRegistration / ...
    webhook.ts       # verifySignature(body, sig) + handler theo type
    types.ts         # kiểu dữ liệu hợp đồng VMS (Booking, Registration, ...)
  modules/
    venues/service.ts     # gọi integrations/vms/venues thay cho mock/DB
    gym/service.ts
    matches/service.ts    # (giải đấu) → integrations/vms/tournaments
  routes/… hoặc modules/integrations/
    POST /api/v1/integrations/vms/webhook  → webhook.ts
```

Quy tắc ranh giới: **chỉ** `integrations/vms/*` biết URL/headers/định dạng của VMS;
các module nghiệp vụ gọi hàm trong `integrations/vms`, không gọi `fetch` thẳng.
Khi tách microservice, `integrations/vms` trở thành *adapter* của service tương ứng.

---

## 8. Chiến lược triển khai (gợi ý theo giai đoạn)

1. **I0 — Client nền**: `env.ts` + `integrations/vms/client.ts` (auth token cache, timeout, map lỗi) + `types.ts`.
2. **I1 — Đọc (read-through)**: `venues.ts` (list/detail/availability), `tournaments.ts` (list/detail) — thay nguồn mock ở `modules/venues`, `modules/matches`. Cache ngắn availability.
3. **I2 — Ghi (đặt/đăng ký)**: `createBooking`, `tournaments.register`, `gym.buyDayPass` + Idempotency-Key.
4. **I3 — Webhook**: endpoint + verify HMAC + idempotent + nối **event bus** & notification.
5. **I4 — Gym còn lại**: plans / memberships / check-in QR.

> Có thể chạy **chế độ mock** khi chưa có VMS thật: `VMS_BASE_URL` rỗng → `integrations/vms`
> trả dữ liệu mẫu (giữ nguyên hợp đồng), bật dần từng domain khi đối tác sẵn sàng.
