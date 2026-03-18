import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
const root = path.resolve(process.cwd(), 'src');

export default defineConfig({
  root,
  base: '/',
  plugins: [
    tailwindcss()
  ],
  build: {
    outDir: path.resolve(process.cwd(), '_site'),
    emptyOutDir: false,
    cssCodeSplit: false,
    assetsDir: 'assets',
    manifest: true,
    rollupOptions: {
      input: {
        app: path.resolve(root, 'assets', 'main.js'),
      },
      output: {
        entryFileNames: 'assets/main-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.names?.[0] === 'style.css') return 'assets/main-[hash].css';
          return 'assets/[name][extname]';
        }
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 8088,
    strictPort: true,
    watch: {
      ignored: ['!**/src/**']
    }
  }
});
