import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: { index: resolve('scripts/library-entry.ts'), tokens: resolve('src/tokens.ts') }, formats: ['es'], fileName: '[name]', cssFileName: 'styles' },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: { entryFileNames: '[name].js', chunkFileNames: '[name]-[hash].js' },
    },
    sourcemap: true,
  },
});
