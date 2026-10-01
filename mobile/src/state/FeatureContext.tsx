import { createContext, useContext, ReactNode } from 'react';

/**
 * Cờ bật/tắt chức năng theo nhu cầu chủ sân/gym.
 * Hiện dùng giá trị mặc định (mock). Về sau nạp từ API của phần mềm quản lý sân
 * (mỗi cơ sở trả về cấu hình riêng) và truyền vào <FeatureProvider value={...}>.
 */
export interface FeatureFlags {
  personalDayPass: boolean;   // đặt vé ngày cá nhân
  gymClasses: boolean;        // lớp gym / huấn luyện
}

// Mặc định demo: ẩn "vé cá nhân", vẫn hiện "lớp gym".
export const DEFAULT_FEATURES: FeatureFlags = {
  personalDayPass: false,
  gymClasses: true,
};

const FeatureContext = createContext<FeatureFlags>(DEFAULT_FEATURES);

export function FeatureProvider({ children, value = DEFAULT_FEATURES }: { children: ReactNode; value?: FeatureFlags }) {
  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}

export function useFeatures() {
  return useContext(FeatureContext);
}
