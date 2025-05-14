import type { Config } from 'tailwindcss';
import sharedUiTailwindConfig from '@repo/ui/tailwind-config';

const config: Config = {
  darkMode: sharedUiTailwindConfig.darkMode,
  presets: [sharedUiTailwindConfig],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};
export default config; 