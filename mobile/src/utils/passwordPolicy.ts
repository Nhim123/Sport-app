// Chinh sach mat khau manh cho dang ky tai khoan (bao ve an ninh).
export interface PwCheck { key: string; label: string; ok: boolean }
export interface PwResult {
  checks: PwCheck[];
  passed: number;
  score: number;   // 0..4 (dung cho thanh do)
  label: string;
  strong: boolean; // dat MOI yeu cau bat buoc
}

// Mot so mat khau pho bien bi chan.
const COMMON = new Set([
  'password', 'password1', '123456', '12345678', '123456789', 'qwerty',
  '111111', 'abc123', 'iloveyou', 'admin', 'matkhau', 'sportapp',
]);

export function evaluatePassword(pw: string): PwResult {
  const checks: PwCheck[] = [
    { key: 'len', label: 'Ít nhất 8 ký tự', ok: pw.length >= 8 },
    { key: 'upper', label: 'Có chữ in hoa (A-Z)', ok: /[A-Z]/.test(pw) },
    { key: 'lower', label: 'Có chữ thường (a-z)', ok: /[a-z]/.test(pw) },
    { key: 'digit', label: 'Có chữ số (0-9)', ok: /\d/.test(pw) },
    { key: 'special', label: 'Có ký tự đặc biệt (!@#$…)', ok: /[^A-Za-z0-9]/.test(pw) },
    { key: 'common', label: 'Không phải mật khẩu phổ biến', ok: pw.length > 0 && !COMMON.has(pw.toLowerCase()) },
  ];
  const passed = checks.filter(c => c.ok).length;
  const strong = checks.every(c => c.ok);

  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score = Math.min(4, score + 1);
  // Mat khau pho bien luon bi ha diem.
  if (pw && COMMON.has(pw.toLowerCase())) score = Math.min(score, 1);

  const label = ['Rất yếu', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'][score] ?? 'Yếu';
  return { checks, passed, score, label, strong };
}
