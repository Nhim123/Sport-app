# Sport-app — Đặc tả REST API (tóm tắt)

Bản đầy đủ máy-đọc: [`openapi.yaml`](./openapi.yaml) (import vào Swagger/Postman/Redoc).
Tài liệu này là bản Markdown để đọc nhanh.

## Quy ước chung
- **Base URL:** `/api/v1`
- **Xác thực:** `Authorization: Bearer <JWT>` cho mọi endpoint trừ `POST /auth/register|login|google`.
- **Định dạng:** JSON. Ngày `date` (YYYY-MM-DD), thời gian hiển thị dạng chuỗi ("18:00").
- **Phân trang:** `?page=&limit=` (mặc định 1 / 20).
- **Lỗi:** `{ "error": { "code": "...", "message": "..." } }`
- **Mã trạng thái:** `401` chưa đăng nhập · `403` sai quyền · `404` không thấy · `409` xung đột.
- **Cột Role:** quyền tối thiểu — `auth` = user đã đăng nhập bất kỳ; `member/admin/owner` = vai trò trong CLB.

## Auth
| Method | Path | Role | Mô tả |
|---|---|---|---|
| POST | `/auth/register` | công khai | Đăng ký email + mật khẩu |
| POST | `/auth/login` | công khai | Đăng nhập email + mật khẩu |
| POST | `/auth/google` | công khai | Đăng nhập Google (đổi idToken lấy phiên) |
| POST | `/auth/logout` | auth | Đăng xuất |
| GET | `/auth/me` | auth | User hiện tại |

## Users
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET/PATCH | `/users/me` | auth | Xem / cập nhật hồ sơ |
| GET | `/users/me/stats` | auth | Số liệu hồ sơ |

## Venues (sân bãi & tìm kiếm)
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/venues?sport=&q=&district=` | auth | Danh sách / tìm kiếm |
| GET | `/venues/{id}` | auth | Chi tiết |
| GET | `/venues/{id}/schedule?date=` | auth | Khung giờ đặt được |
| GET | `/venues/{id}/classes` | auth | Lớp gym |

## Bookings (đặt sân)
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/bookings?status=` | auth | Lịch đặt của tôi |
| POST | `/bookings` | auth | Đặt sân (cá nhân/CLB) |
| GET | `/bookings/{id}` | auth | Chi tiết |
| DELETE | `/bookings/{id}` | auth | Huỷ |

## Gym (vé ngày & hội viên)
| Method | Path | Role | Mô tả |
|---|---|---|---|
| POST | `/day-passes` | auth | Mua vé ngày (cá nhân/CLB) |
| GET | `/day-passes/{id}` | auth | Chi tiết vé |
| GET | `/memberships/me` | auth | Thẻ hội viên của tôi |

## Schedule (lịch tuần)
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/me/schedule?week=` | auth | Buổi đã tham dự / dự kiến |

## Clubs
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/clubs?sport=&q=` | auth | Khám phá / tìm CLB |
| POST | `/clubs` | auth | Tạo CLB (thành owner) |
| GET | `/clubs/{id}` | auth | Chi tiết |
| GET | `/me/clubs` | auth | CLB của tôi |
| POST | `/clubs/join` | auth | Tham gia bằng mã / QR |

## Club Admin (quản trị CLB)
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/clubs/{id}/members` | member | Danh sách thành viên |
| PATCH | `/clubs/{id}/members/{userId}` | **owner/admin** | Đổi role / duyệt |
| GET | `/clubs/{id}/fund/transactions` | member | Xem quỹ |
| POST | `/clubs/{id}/fund/transactions` | **owner/admin** | Thêm thu/chi |
| GET | `/clubs/{id}/programs` | member | Danh sách chương trình |
| POST | `/clubs/{id}/programs` | **owner/admin** | Tạo chương trình |
| POST | `/programs/{id}/join` | member | Tham gia chương trình |

## Polls (bình chọn) — tạo chỉ dành cho quản trị viên
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/clubs/{id}/polls` | member | Danh sách bình chọn |
| POST | `/clubs/{id}/polls` | **owner/admin** | **Tạo bình chọn — member nhận 403** |
| GET | `/polls/{id}` | member | Chi tiết |
| PATCH | `/polls/{id}` | **owner/admin** | Đóng / ghim |
| POST | `/polls/{id}/options` | member* | Thêm phương án (*chỉ khi `allowAddOption`) |
| POST | `/polls/{id}/votes` | member | Bỏ phiếu (1 hoặc nhiều theo `allowMultiple`) |
| DELETE | `/polls/{id}/votes?optionId=` | member | Rút phiếu |

## Matches / Promos / Payments
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET/POST | `/matches` | auth | Kèo tìm bạn chơi |
| POST | `/matches/{id}/join` | auth | Tham gia kèo |
| GET | `/promos?tab=` | auth | Banner ưu đãi |
| POST | `/payments` | auth | Tạo đơn thanh toán chung |
| GET | `/payments/{id}` | auth | Trạng thái đơn |
| POST | `/payments/{id}/confirm` | auth | Xác nhận đã thanh toán (QR) |

## Ví dụ

**Tạo bình chọn (owner/admin):**
```http
POST /api/v1/clubs/cl1/polls
Authorization: Bearer <JWT>

{
  "title": "Chốt giờ sinh hoạt tuần tới",
  "eventId": "evt_88",
  "options": ["Thứ 5 · 19:30", "Thứ 7 · 18:00", "Chủ nhật · 08:00"],
  "allowMultiple": true,
  "allowAddOption": true,
  "anonymous": false,
  "hideResults": false,
  "closesAt": "2026-09-20T12:00:00Z"
}
```
→ `201` trả về `Poll`. Nếu người gọi là **member** → `403`:
```json
{ "error": { "code": "forbidden", "message": "Chỉ quản trị viên CLB được tạo bình chọn" } }
```

**Bỏ phiếu:**
```http
POST /api/v1/polls/poll1/votes
{ "optionIds": ["p1a"] }
```
→ `200` trả về `Poll` với `myVotes` và `votes` cập nhật.

## Phân quyền
Xem [`database.md` → Ma trận phân quyền](./database.md#ma-trận-phân-quyền-áp-ở-tầng-api-dựa-trên-club_membershipsrole).
Quy tắc: kiểm quyền bằng vai trò lấy từ `club_memberships` của user hiện tại — **không tin role do client gửi**.
