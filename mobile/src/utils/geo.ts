// Tiện ích toạ độ cho bản đồ tìm kiếm.
// Vị trí mặc định khi chưa có GPS: khu Quận 7 / Nhà Bè, TP.HCM.
export const DEFAULT_CENTER = { lat: 10.7265, lng: 106.7215 };

// Dời một toạ độ theo khoảng cách (km) và hướng (độ) — rải marker sân quanh vị trí người dùng (demo).
export function offsetCoord(lat: number, lng: number, km: number, bearingDeg: number) {
  const R = 6371; // bán kính Trái Đất (km)
  const br = (bearingDeg * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lng1 = (lng * Math.PI) / 180;
  const dr = km / R;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dr) + Math.cos(lat1) * Math.sin(dr) * Math.cos(br));
  const lng2 = lng1 + Math.atan2(
    Math.sin(br) * Math.sin(dr) * Math.cos(lat1),
    Math.cos(dr) - Math.sin(lat1) * Math.sin(lat2),
  );
  return { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI };
}

// Góc ổn định suy từ id (0..359) để mỗi sân có hướng rải cố định.
export function angleFromId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}
