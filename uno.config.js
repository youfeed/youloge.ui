import {defineConfig,presetAttributify,presetIcons,presetTypography,presetUno,presetWebFonts,} from 'unocss'

export default defineConfig({
  shortcuts:[
    ['f-c-c', 'flex justify-center items-center'],
    ['f-c-b', 'flex justify-between items-center'],
  ],
  theme:{
    breakpoints:{
      sm:'640px',
      md:'768px',
      lg:'1024px',
      xl:'1280px',
      xxl:'1536px',
    }
  },
  presets: [
    presetUno({ attributifyPseudo: true,}),presetAttributify(),
    presetIcons({ scale: 1.2, warn: true}),
    presetTypography(),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: 'Roboto',
        script: 'Homemade Apple',
      },
    }),
  ],
})