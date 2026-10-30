import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: { watch: { ignored: [
    '**/dist/**', '**/example-dist/**', '**/storybook-static/**',
    '**/playwright-report/**', '**/test-results/**',
    '**/.dependency-cache/**', '**/tests/browser/__screenshots__/**',
  ] } },
  resolve: command === 'serve' ? { alias: [
    { find: '@tinker-works/ui/styles.css', replacement: fileURLToPath(new URL('./src/styles/index.css', import.meta.url)) },
    { find: '@tinker-works/ui/fonts.css', replacement: fileURLToPath(new URL('./src/styles/fonts.css', import.meta.url)) },
    { find: /^@tinker-works\/ui$/, replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
  ] } : undefined,
  build: { outDir: 'example-dist', emptyOutDir: true },
}));
