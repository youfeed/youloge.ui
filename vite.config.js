import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build:{
    sourcemap:false,
    cssCodeSplit:true,
    lib: {
      format: 'umd',
      entry: 'lib/index.js',
      name: 'youloge',
      fileName: (format) => `youloge.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    }
  },
  css:{
    preprocessorOptions:{
      scss:{
        additionalData: `@import "./lib/style/index.scss";`
      },
    }
  }
})
