import { defineConfig } from 'vite'
import {resolve} from 'path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  build:{
    sourcemap:false,
    lib: {
      format: 'umd',
      entry: 'lib/index.js',
      name: 'youloge',
      fileName: (format) => `youloge.${format}.js`,
    },
    cssCodeSplit:true,
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
  plugins: [vue(),UnoCSS()],
  css:{
    preprocessorOptions:{
      scss:{
        additionalData: `@import "./lib/style/index.scss";`
      },
    }
  }
})
