import QRCode from 'react-native-qrcode-svg';

/**
 * Mã QR THẬT (mã hoá `value`) dựng bằng SVG — quét được bằng camera/điện thoại khác.
 * Giữ nguyên API cũ ({ value, size }) nên mọi nơi đang dùng tự động thành QR thật.
 */
export function QrCode({ value, size = 118 }: { value: string; size?: number }) {
  return (
    <QRCode
      value={value && value.length ? value : ' '}
      size={size}
      color="#0C0F0A"
      backgroundColor="#FFFFFF"
      ecl="M"
    />
  );
}
