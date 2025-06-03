import { describe, expect, it } from 'vitest';
import { type AppleColorKey, appleColors } from '../apple-colors';

describe('appleColors', () => {
  it('라이트/다크 모드가 존재해야 한다', () => {
    expect(appleColors.light).toBeDefined();
    expect(appleColors.dark).toBeDefined();
  });

  it('모든 컬러 키가 라이트/다크에 동일하게 존재해야 한다', () => {
    const lightKeys = Object.keys(appleColors.light);
    const darkKeys = Object.keys(appleColors.dark);
    expect(lightKeys).toEqual(darkKeys);
  });

  it('모든 컬러 값이 HEX 포맷이어야 한다', () => {
    const isHex = (v: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(v);
    Object.values(appleColors).forEach((mode) => {
      Object.values(mode).forEach((color) => {
        expect(typeof color).toBe('string');
        expect(isHex(color)).toBe(true);
      });
    });
  });

  it('주요 컬러 키가 포함되어야 한다', () => {
    const requiredKeys: AppleColorKey[] = [
      'primary',
      'secondary',
      'background',
      'surface',
      'border',
      'text',
      'textSecondary',
      'accent',
      'success',
      'warning',
      'error',
      'info',
    ];
    requiredKeys.forEach((key) => {
      expect(appleColors.light).toHaveProperty(key);
      expect(appleColors.dark).toHaveProperty(key);
    });
  });
});
