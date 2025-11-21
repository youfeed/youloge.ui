import { defineConfig } from 'vite'
import {resolve} from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
  },
  build:{
    sourcemap:false,
    lib: {
      format: 'umd',
      entry: 'lib/index.js',
      name: 'youloge',
      fileName: (format) => `youloge.${format}.js`,
    },
    cssCodeSplit:false,
    rollupOptions: { 
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    }
  },
  resolve:{
    alias:{
      '@lib':resolve(__dirname, './lib')
    }
  },
  plugins: [vue()],
  css:{
    preprocessorOptions:{
      less:{
        strictMath: true,
        strictUnits: true,
        // javascriptEnabled: true,
        dumpLineNumbers: 'comments', // 辅助调试，可选
        additionalData: `@import "./lib/styles/index.less";`
      },
      minify: false,
    },
    cacheDir: false,
  }
})
