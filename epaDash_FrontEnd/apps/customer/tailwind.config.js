/** @type {import('tailwindcss').Config} */
import { epadashTheme } from '../../packages/shared/src/design-tokens.js';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: epadashTheme,
  },
  plugins: [],
};
