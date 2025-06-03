import { defineConfig } from '@pandacss/dev';
import { appleColors } from './src/shared/design-system/apple-colors';

const toPandaColorTokens = (colors: Record<string, string>) =>
  Object.fromEntries(Object.entries(colors).map(([k, v]) => [k, { value: v }]));

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          ...toPandaColorTokens(appleColors.light),
          // 다크 모드는 semanticTokens에서 처리 권장
        },
      },
      semanticTokens: {
        colors: Object.fromEntries(
          Object.keys(appleColors.light).map((key) => [
            key,
            {
              value: {
                base: `{colors.${key}}`,
                _dark: appleColors.dark[key],
              },
            },
          ])
        ),
      },
    },
  },

  // The output directory for your css system
  outdir: './src/shared/design-system',
});
