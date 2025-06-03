// Apple 스타일 컬러 팔레트 (라이트/다크 모드)
// 출처: https://developer.apple.com/design/human-interface-guidelines/foundations/color/
// Apple 공식 및 최신 트렌드 참고

export const appleColors = {
  light: {
    primary: '#0071e3', // Apple Blue
    secondary: '#e5e5ea', // Light Gray
    background: '#f5f5f7', // Apple Light BG
    surface: '#ffffff',
    border: '#d2d2d7',
    text: '#1d1d1f',
    textSecondary: '#6e6e73',
    accent: '#ff9500', // Orange Accent
    success: '#32d74b',
    warning: '#ffd60a',
    error: '#ff3b30',
    info: '#64d2ff',
    // 추가 컬러 필요시 여기에 정의
  },
  dark: {
    primary: '#0a84ff', // Apple Blue (Dark)
    secondary: '#3a3a3c', // Dark Gray
    background: '#1c1c1e', // Apple Dark BG
    surface: '#232325',
    border: '#38383a',
    text: '#f5f5f7',
    textSecondary: '#a1a1aa',
    accent: '#ff9f0a', // Orange Accent (Dark)
    success: '#30d158',
    warning: '#ffd60a',
    error: '#ff453a',
    info: '#64d2ff',
    // 추가 컬러 필요시 여기에 정의
  },
} as const;

export type AppleColorMode = keyof typeof appleColors;
export type AppleColorKey = keyof (typeof appleColors)['light'];
