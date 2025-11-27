import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
  },
  build: {
    minify: 'esbuild',
    sourcemap: false,
    lib: {
      format: 'umd',
      entry: 'lib/index.js',
      name: 'youloge',
      fileName: (format) => `youloge.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: { 
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    }
  },
  resolve: {
    alias: {
      '@lib': resolve(__dirname, './lib')
    }
  },
  plugins: [vue(), tailwindcss()],
})
