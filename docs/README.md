# Sport-app — Tài liệu thiết kế backend

Tài liệu đặc tả REST API và Database cho backend tương lai của Sport-app, biên soạn từ
các chức năng đã dựng ở frontend (`mobile/`). **Chưa có server** — đây là bản thiết kế
để dựng backend sau này.

## Mục lục
| File | Nội dung |
|---|---|
| [`api-spec.md`](./api-spec.md) | Đặc tả REST dạng bảng (đọc nhanh) + ví dụ. |
| [`openapi.yaml`](./openapi.yaml) | OpenAPI 3.1 đầy đủ (import Swagger/Postman/Redoc). |
| [`database.md`](./database.md) | Mô tả bảng, quan hệ, **ma trận phân quyền**. |
| [`database.dbml`](./database.dbml) | Schema DBML (dán vào dbdiagram.io để xem ERD). |

## Phạm vi chức năng
Auth (email + Google OAuth) · hồ sơ người dùng · sân bãi + lịch sân + tìm kiếm · đặt sân
(cá nhân/CLB) · vé ngày & thẻ hội viên gym · lớp gym · câu lạc bộ (nhiều bộ môn, vai trò
owner/admin/member, quỹ, thành viên, chương trình) · tham gia CLB bằng mã/QR · lịch sinh
hoạt (lịch tuần) · **bình chọn** (gắn lịch, chọn nhiều, ẩn danh, ẩn kết quả, thêm phương
án — **tạo chỉ dành cho quản trị viên**) · tìm bạn chơi · khuyến mãi · thanh toán chung.

## Nguyên tắc thiết kế nổi bật
- **Phân quyền theo CLB:** quyền quản trị (tạo bình chọn, quản quỹ, tạo chương trình, đổi
  role) dựa trên `club_memberships.role` (owner/admin), kiểm ở tầng API — member nhận `403`.
  Khớp với gating UI: nút tạo bình chọn ở `ClubDetailScreen` chỉ hiện khi `isOwner`.
- **Giá trị dẫn xuất** (số thành viên, số dư quỹ, kết quả bình chọn) tính bằng
  COUNT/SUM, không lưu cột trùng lặp.
- **Thanh toán chung** một bảng `payments` tham chiếu đa hình (`ref_type`/`ref_id`).

## Kiểm tra tài liệu
```bash
# Lint OpenAPI
npx @redocly/cli lint docs/openapi.yaml
# Xem ERD: dán nội dung docs/database.dbml vào https://dbdiagram.io
```

## Ngoài phạm vi (chưa làm)
Chưa dựng server/migrations thật; realtime (WebSocket cho poll/booking) mới ở mức gợi ý.
