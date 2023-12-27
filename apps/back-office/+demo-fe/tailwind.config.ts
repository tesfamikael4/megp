import type { Config } from 'tailwindcss';
import { theme as baseTheme } from '@megp/theme/tailwind';
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../../packages/fe/core-fe/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../../packages/fe/entity/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../../packages/fe/auth/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    ...baseTheme,
  },
  plugins: [],
};
export default config;
