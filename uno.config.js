import {defineConfig,presetAttributify,presetIcons,presetTypography,presetUno,presetWebFonts,} from 'unocss'

export default defineConfig({
  shortcuts:[
    ['f-c-c', 'flex justify-center items-center'],
    ['f-c-b', 'flex justify-between items-center'],
  ],
  theme:{
    colors:{
      primary: '#3498db', // 主色
      secondary: '#2ecc71', // 辅助色
      accent: '#e74c3c', // 强调色
      background: '#ecf0f1', // 背景色
      text: '#2c3e50', // 文字颜色
      border: '#bdc3c7', // 边框颜色

      success: '#2ecc71', // 成功色
      warning: '#f39c12', // 警告色
      info: '#3498db', // 信息色
      danger: '#e74c3c', // 危险色
      default: '#7f8c8d', // 默认色
    },
    extend:{
      fontFamily:{
        sans: ['Inter var', 'sans-serif'],
      },
    },
    breakpoints:{
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    }
  },
  safelist:[
    'bg-primary','bg-secondary','bg-accent','bg-background','bg-text','bg-border',
    'text-primary','text-secondary','text-accent','text-background','text-text','text-border',
    'border-primary','border-secondary','border-accent','border-background','border-text','border-border',
    'rounded-none','rounded-sm','rounded-md','rounded-lg','rounded-xl','rounded-2xl','rounded-3xl','rounded-full'
  ],
  presets: [
    presetUno({ attributifyPseudo: true,}),presetAttributify(),
    presetTypography(),
    presetIcons({ scale: 1.2, warn: true}),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: 'Roboto',
        script: 'Homemade Apple',
      },
    }),
  ],
})