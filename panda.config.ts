import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  syntax: 'template-literal',
  jsxFramework: 'react',
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: './src/shared/design-system',
});
