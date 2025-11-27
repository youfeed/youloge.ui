/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./lib/**/*.{js,ts,jsx,tsx,vue}",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "./docs/**/*.{md,vue}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 容器：居中 + 最大宽度 + 内边距（响应式适配）
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [
    // 自定义插件 - 添加快捷方式
    function({ addUtilities, addComponents }) {
      // 布局快捷方式
      addComponents({
        '.container-sm': {
          'margin-left': 'auto',
          'margin-right': 'auto',
          'max-width': '24rem',
          'padding-left': '1rem',
          'padding-right': '1rem',
        },
        '.container-md': {
          'margin-left': 'auto',
          'margin-right': 'auto',
          'max-width': '48rem',
          'padding-left': '1rem',
          'padding-right': '1rem',
        },
        '.container-lg': {
          'margin-left': 'auto',
          'margin-right': 'auto',
          'max-width': '80rem',
          'padding-left': '1rem',
          'padding-right': '1rem',
        },
        '.container-full': {
          'margin-left': 'auto',
          'margin-right': 'auto',
          'max-width': '100%',
          'padding-left': '1rem',
          'padding-right': '1rem',
        },
        
        // 弹性布局快捷方式
        '.flex-center': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.flex-col-center': {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.flex-between': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'space-between',
        },
        '.flex-around': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'space-around',
        },
        '.flex-stretch': {
          display: 'flex',
          'align-items': 'stretch',
        },
        
        // 网格布局快捷方式
        '.grid-responsive': {
          display: 'grid',
          'grid-template-columns': 'repeat(1, minmax(0, 1fr))',
          gap: '1rem',
          '@media (min-width: 768px)': {
            'grid-template-columns': 'repeat(2, minmax(0, 1fr))',
          },
          '@media (min-width: 1024px)': {
            'grid-template-columns': 'repeat(4, minmax(0, 1fr))',
          },
        },
        
        // 定位快捷
        '.absolute-full': {
          position: 'absolute',
          inset: '0px',
        },
        '.absolute-center': {
          position: 'absolute',
          inset: '0px',
          margin: 'auto',
        },
        '.fixed-top': {
          position: 'fixed',
          top: '0px',
          left: '0px',
          right: '0px',
        },
        '.fixed-bottom': {
          position: 'fixed',
          bottom: '0px',
          left: '0px',
          right: '0px',
        },
        
        // 交互反馈类
        '.interactive': {
          transition: 'all 200ms',
          cursor: 'pointer',
        },
        '.interactive-light': {
          transition: 'all 150ms',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
        },
        '.interactive-heavy': {
          transition: 'all 300ms',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
        },
        '.btn-press': {
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
        '.btn-elevate': {
          '&:hover': {
            'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          '&:active': {
            'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
        },
        
        // 组件基础类
        '.btn': {
          display: 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          padding: '0.5rem 1rem',
          'font-size': '0.875rem',
          'font-weight': '500',
          'border-radius': '0.375rem',
          border: '1px solid',
          transition: 'all 200ms',
          '&:focus': {
            outline: 'none',
            'box-shadow': '0 0 0 2px rgba(0, 0, 0, 0.05)',
          },
        },
        '.input': {
          display: 'block',
          width: '100%',
          padding: '0.5rem 0.75rem',
          'font-size': '0.875rem',
          border: '1px solid rgb(209 213 219)',
          'border-radius': '0.375rem',
          'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '&::placeholder': {
            color: 'rgb(156 163 175)',
          },
          '&:focus': {
            outline: 'none',
            'border-color': 'rgb(59 130 246)',
            'box-shadow': '0 0 0 2px rgb(59 130 246)',
          },
        },
        '.card': {
          'background-color': 'rgb(255 255 255)',
          overflow: 'hidden',
          'border-radius': '0.5rem',
          'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid rgb(229 231 235)',
        },
        '.modal-backdrop': {
          position: 'fixed',
          inset: '0px',
          'background-color': 'rgba(0, 0, 0, 0.5)',
          transition: 'opacity 200ms',
        },
        '.modal-content': {
          position: 'relative',
          'margin-left': 'auto',
          'margin-right': 'auto',
          'max-width': '36rem',
          padding: '1rem',
          'background-color': 'rgb(255 255 255)',
          'border-radius': '0.5rem',
          'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        '.dropdown': {
          position: 'absolute',
          right: '0px',
          zIndex: '10',
          width: '12rem',
          'padding-top': '0.25rem',
          'padding-bottom': '0.25rem',
          'margin-top': '0.5rem',
          'transform-origin': 'top right',
          'background-color': 'rgb(255 255 255)',
          'border-radius': '0.375rem',
          'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          '&:focus': {
            outline: 'none',
          },
        },
        '.dropdown-item': {
          display: 'block',
          'padding-left': '1rem',
          'padding-right': '1rem',
          'padding-top': '0.5rem',
          'padding-bottom': '0.5rem',
          'font-size': '0.875rem',
          color: 'rgb(55 65 81)',
          '&:hover': {
            'background-color': 'rgb(243 244 246)',
          },
        },
        '.badge': {
          display: 'inline-flex',
          'align-items': 'center',
          padding: '0.125rem 0.625rem',
          'border-radius': '9999px',
          'font-size': '0.75rem',
          'font-weight': '500',
        },
        '.avatar': {
          display: 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          width: '2rem',
          height: '2rem',
          'border-radius': '9999px',
          'background-color': 'rgb(107 114 128)',
        },
        '.skeleton': {
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'background-color': 'rgb(229 231 235)',
          'border-radius': '0.25rem',
        },
        
        // 标题样式
        '.text-h1': {
          'font-size': '1.875rem',
          'font-weight': '700',
          'line-height': '1.25',
        },
        '.text-h2': {
          'font-size': '1.5rem',
          'font-weight': '600',
          'line-height': '1.25',
        },
        '.text-h3': {
          'font-size': '1.25rem',
          'font-weight': '600',
          'line-height': '1.25',
        },
        '.text-h4': {
          'font-size': '1.125rem',
          'font-weight': '500',
          'line-height': '1.25',
        },
        
        // 正文样式
        '.text-body': {
          'font-size': '1rem',
          'line-height': '1.75',
        },
        '.text-sm-body': {
          'font-size': '0.875rem',
          'line-height': '1.75',
        },
        '.text-muted': {
          color: 'rgb(107 114 128)',
        },
        
        // 状态工具类
        '.show': { display: 'block' },
        '.hide': { display: 'none' },
        '.show-inline': { display: 'inline-block' },
        '.invisible': { visibility: 'hidden' },
        '.clearfix': {
          '&::after': {
            content: '""',
            display: 'table',
            clear: 'both',
          },
        },
        '.no-select': { 'user-select': 'none' },
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          'border-width': '0',
        },
        '.not-sr-only': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: '0',
          margin: '0',
          overflow: 'visible',
          clip: 'auto',
          'white-space': 'normal',
        },
        '.print\\:hidden': {
          '@media print': {
            display: 'none',
          },
        },
        '.space-reset': { margin: '0', padding: '0' },
        '.space-y-reset': { '& > *': { 'margin-top': '0', 'margin-bottom': '0' } },
      });
      
      // 隐藏滚动条但保留滚动功能
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { 
            'background-color': 'rgb(209 213 219)', 
            'border-radius': '3px' 
          },
          '&::-webkit-scrollbar-thumb:hover': { 
            'background-color': 'rgb(156 163 175)' 
          }
        },
        '.safe-top': { 'padding-top': 'env(safe-area-inset-top)' },
        '.safe-bottom': { 'padding-bottom': 'env(safe-area-inset-bottom)' },
        '.safe-left': { 'padding-left': 'env(safe-area-inset-left)' },
        '.safe-right': { 'padding-right': 'env(safe-area-inset-right)' },
      });
    },
  ],
}