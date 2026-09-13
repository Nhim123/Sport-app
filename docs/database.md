# Sport-app — Thiết kế Database

Tài liệu mô tả mô hình dữ liệu cho backend tương lai của Sport-app. Schema chi tiết
(DBML, dán vào [dbdiagram.io](https://dbdiagram.io)) nằm ở [`database.dbml`](./database.dbml).

- **CSDL đề xuất:** PostgreSQL. Khoá chính `uuid`, thời gian `timestamptz`.
- **Nguồn suy ra:** `mobile/src/types/index.ts` + `AuthContext`, `PassContext`, `PollContext`.
- **Không lưu DB:** các trường thuần trình bày — `gradient`, `initials`, `distanceKm`, `heroTag`. `members_count`, `fund.balance` là **giá trị dẫn xuất** (COUNT/SUM), không lưu cột riêng.

## Sơ đồ quan hệ (tóm tắt)

```
users ─< auth_identities
users ─< club_memberships >─ clubs ─< club_sports
clubs ─< club_join_codes
clubs ─< club_fund_txs
clubs ─< club_programs ─< club_program_participants >─ users
clubs ─< club_events ──< polls ─< poll_options ─< poll_votes >─ users
users ─< bookings >─ venues ─< courts
venues ─< court_schedules ─< time_slots
venues ─< gym_classes ─< class_enrollments >─ users
users ─< day_passes / memberships >─ venues
users ─< matches ─< match_participants >─ users
users ─< payments
```

## Nhóm bảng

### Người dùng & xác thực
| Bảng | Vai trò |
|---|---|
| `users` | Tài khoản (name, email duy nhất, avatar). |
| `auth_identities` | Cách đăng nhập của user: `password` (có `password_hash`) và/hoặc `google` (có `provider_uid` = Google `sub`). Một user nhiều identity. |

Ánh xạ frontend: `AuthContext.AuthUser { name, email, provider }` → `users` + `auth_identities`.

### Sân bãi, lịch sân
| Bảng | Vai trò |
|---|---|
| `venues` | Sân/cơ sở (pickle, gym, football), giá, đánh giá, tiện ích. |
| `venue_amenities` | Danh sách tiện ích (1-N). |
| `courts` | Từng sân con của venue. |
| `court_schedules` | Khung mở theo ngày do chủ sân cấu hình (open/close, session_minutes). |
| `time_slots` | Khung giờ sinh từ schedule; `booked` đánh dấu đã đặt — nguồn "giờ đặt động". |

### Đặt sân
| Bảng | Vai trò |
|---|---|
| `bookings` | Đơn đặt sân; `book_for` = `personal`/`club`, kèm `club_id` khi đặt thay CLB. |

### Gym: vé ngày & hội viên
| Bảng | Vai trò |
|---|---|
| `day_passes` | Vé ngày (cá nhân/CLB), `entries_left`, trạng thái booking→active. |
| `memberships` | Thẻ hội viên tháng, số lần check-in. |
| `gym_classes` | Lớp tập theo giờ. |
| `class_enrollments` | Đăng ký lớp (optional). |

### Câu lạc bộ
| Bảng | Vai trò |
|---|---|
| `clubs` | CLB, có `owner_id`, `privacy` (open/approval). |
| `club_sports` | Bộ môn CLB triển khai (**nhiều bộ môn**). |
| `club_memberships` | Thành viên + **role** (`owner`/`admin`/`member`) → quyết định quyền quản trị. `status` pending khi privacy=approval. |
| `club_join_codes` | Mã tham gia; **QR mã hoá `code`** (luồng quét QR tham gia CLB). |
| `club_fund_txs` | Giao dịch quỹ; số dư = `SUM(+in) - SUM(out)`. |
| `club_programs` / `club_program_participants` | Chương trình sinh hoạt & người tham gia. |
| `club_events` | **Lịch sinh hoạt / lịch tuần**; `status` done/planned; poll gắn vào 1 event. |

### Bình chọn (poll)
| Bảng | Vai trò |
|---|---|
| `polls` | Cuộc bình chọn của CLB; cờ `allow_multiple`, `allow_add_option`, `anonymous`, `hide_results`, `pinned`, `closes_at`; `event_id` gắn lịch. **Tạo poll chỉ owner/admin.** |
| `poll_options` | Phương án; `created_by` khi thành viên tự thêm. |
| `poll_votes` | Phiếu bầu; unique `(poll_id, option_id, user_id)`. Chọn-một: chỉ 1 hàng/poll/user; chọn-nhiều khi `allow_multiple`. |

Ánh xạ frontend: `ClubPoll` (đã gồm `myVotes`, các cờ) → `polls` + `poll_options` + `poll_votes` (myVotes = các vote của user hiện tại).

### Tìm bạn chơi, khuyến mãi, thanh toán
| Bảng | Vai trò |
|---|---|
| `matches` / `match_participants` | Kèo tìm bạn chơi & người tham gia. |
| `promos` | Banner ưu đãi theo bộ môn. |
| `payments` | Đơn thanh toán chung (`purpose` court/daypass/club), tham chiếu bản ghi gốc qua `ref_type`/`ref_id`. |

## Ma trận phân quyền (áp ở tầng API, dựa trên `club_memberships.role`)

| Hành động | owner | admin | member | Ghi chú |
|---|:---:|:---:|:---:|---|
| **Tạo / đóng / ghim bình chọn** | ✅ | ✅ | ❌ | Member gọi `POST /clubs/{id}/polls` → **403**. Khớp gating UI (`ClubDetailScreen` chỉ hiện nút khi `isOwner`). |
| Bỏ phiếu / rút phiếu | ✅ | ✅ | ✅ | Mọi thành viên. |
| Thêm phương án | ✅ | ✅ | ⚠️ | Member chỉ khi `poll.allow_add_option`. |
| Thêm giao dịch quỹ | ✅ | ✅ | ❌ | |
| Tạo chương trình | ✅ | ✅ | ❌ | Member chỉ tham gia. |
| Đổi role thành viên / duyệt thành viên | ✅ | ✅ | ❌ | |
| Xoá CLB | ✅ | ❌ | ❌ | Chỉ owner. |
| Đặt sân / mua vé / thanh toán | — | — | — | Bất kỳ user đã đăng nhập (không phụ thuộc CLB). |

> Quy tắc chung: kiểm quyền bằng cách join `club_memberships` của user hiện tại với CLB rồi so `role`. Không tin `role` do client gửi.
