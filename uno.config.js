import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  prefix: 'y-',
  presets: [
    presetUno({
      darkMode: 'class',
      variablePrefix: 'y'
    }),
    presetAttributify({
      prefix: 'y-'
    }),
    presetIcons({
      scale: 1.2,
      warn: true
    })
  ],
  
  // CSS 变量定义
  preflights: [
    {
      getCSS: () => `
        :root {
          /* 背景色 */
          --y-bg: #ffffff;
          --y-bg-primary: #ffffff;
          --y-bg-secondary: #fafafa;
          --y-bg-tertiary: #f5f5f5;
          
          /* 文本色 */
          --y-text-primary: #000000e0;
          --y-text-secondary: #000000a6;
          --y-text-tertiary: #00000073;
          --y-text-placeholder: #00000040;
          
          /* 边框色 */
          --y-border: #d9d9d9;
          --y-border-light: #f0f0f0;
          
          /* 功能色浅色 */
          --y-success-light: #95de64;
          --y-success-lighter: #f6ffed;
          --y-success-dark: #389e0d;
          
          --y-warning-light: #ffc069;
          --y-warning-lighter: #fff7e6;
          --y-warning-dark: #d46b08;
          
          --y-danger-light: #ff7875;
          --y-danger-lighter: #fff1f0;
          --y-danger-dark: #cf1322;
          
          --y-info-light: #69b1ff;
          --y-info-lighter: #e6f4ff;
          --y-info-dark: #003a8c;
          
          /* 阴影 */
          --y-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* 暗色模式变量 */
        [class~="dark"] {
          --y-bg: #1f2937;
          --y-bg-primary: #1f2937;
          --y-bg-secondary: #374151;
          --y-bg-tertiary: #4b5563;
          
          --y-text-primary: #f9fafb;
          --y-text-secondary: #d1d5db;
          --y-text-tertiary: #9ca3af;
          --y-text-placeholder: #6b7280;
          
          --y-border: #4b5563;
          --y-border-light: #374151;
          
          --y-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `
    }
  ],
  include: [
    /\.(ts|tsx|js|jsx|vue|svelte)$/,
    'lib/**/*',
    'src/**/*'
  ],
  
  theme: {
    colors: {
      // 主色调 - TDesign风格
      primary: {
        DEFAULT: '#1677ff',
        50: '#e6f4ff',
        100: '#bae0ff', 
        200: '#91caff',
        300: '#69b1ff',
        400: '#4096ff',
        500: '#1677ff',
        600: '#0958d9',
        700: '#0050b3',
        800: '#003a8c',
        900: '#002766',
        dark: '#3c7eff'
      },
      
      // 功能色
      success: {
        DEFAULT: '#00a870',
        25: '#f0fdf4',
        50: '#f6ffed',
        100: '#d9f7be',
        150: '#e6f7e2',
        200: '#b7eb8f', 
        300: '#95de64',
        400: '#73d13d',
        500: '#52c41a',
        600: '#00a870',
        700: '#389e0d',
        800: '#237804',
        900: '#135200',
        dark: '#23c343'
      },
      
      error: {
        DEFAULT: '#e34d59',
        25: '#fef2f2',
        50: '#fff1f0',
        100: '#ffccc7',
        150: '#fee2e2',
        200: '#ffa39e',
        300: '#ff7875', 
        400: '#ff4d4f',
        500: '#f5222d',
        600: '#e34d59',
        700: '#cf1322',
        800: '#a8071a',
        900: '#820014',
        dark: '#f54a45'
      },
      
      warning: {
        DEFAULT: '#ed7b2f',
        25: '#fffbeb',
        50: '#fff7e6',
        100: '#ffe7ba',
        150: '#fff1b8',
        200: '#ffd591',
        300: '#ffc069',
        400: '#ffa940',
        500: '#fa8c16',
        600: '#ed7b2f',
        700: '#d46b08',
        800: '#ad4e00',
        900: '#873800',
        dark: '#f79031'
      },
      
      info: {
        DEFAULT: '#0052d9',
        25: '#f0f9ff',
        50: '#e6f4ff',
        100: '#bae0ff',
        150: '#e1f5fe',
        200: '#91caff',
        300: '#69b1ff',
        400: '#4096ff',
        500: '#1677ff',
        600: '#0052d9',
        700: '#003a8c',
        800: '#002766',
        900: '#001a33',
        dark: '#3c7eff'
      },
      
      // 中性色
      neutral: {
        DEFAULT: '#f3f3f3',
        50: '#ffffff',
        100: '#fafafa',
        200: '#f5f5f5',
        300: '#f0f0f0', 
        400: '#d9d9d9',
        500: '#bfbfbf',
        600: '#8c8c8c',
        700: '#595959',
        800: '#434343',
        900: '#262626',
        dark: '#141414'
      },
      
      // 文本色
      text: {
        DEFAULT: '#000000e0',
        primary: '#000000e0',
        secondary: '#000000a6',
        tertiary: '#00000073',
        placeholder: '#00000040',
        disabled: '#00000025',
        dark: '#ffffff'
      },
      
      // 边框色
      border: {
        DEFAULT: '#d9d9d9',
        light: '#f0f0f0',
        dark: '#434343',
        darkLight: '#595959'
      },
      
      // 背景色
      bg: {
        DEFAULT: '#ffffff',
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f5f5f5',
        dark: '#000000'
      },
      
      // 扩展色彩
      red: '#e34d59',
      blue: '#0052d9', 
      pink: '#ed49b4',
      green: '#00a870',
      orange: '#ed7b2f',
      purple: '#834ec2',
      cyan: '#0594fa',
      volcano: '#e34d59',
      gold: '#ebb105',
      lime: '#7eb712',
      magenta: '#ed49b4',
      geekblue: '#0052d9',
      
      white: '#ffffff',
      black: '#000000'
    },
    
    // 间距系统
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px', 
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px'
    },
    
    // 圆角系统
    borderRadius: {
      none: '0px',
      sm: '2px',
      DEFAULT: '4px',
      md: '4px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '24px',
      full: '9999px'
    },
    
    // 字体
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
    },
    
    // 字号
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['14px', { lineHeight: '20px' }],
      base: ['16px', { lineHeight: '24px' }],
      md: ['16px', { lineHeight: '24px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['20px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      '3xl': ['30px', { lineHeight: '36px' }],
      '4xl': ['36px', { lineHeight: '40px' }],
      '5xl': ['48px', { lineHeight: '1' }]
    },
    
    // 字重
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600', 
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    
    // 阴影
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none'
    },
    
    // 动画时长
    transitionDuration: {
      DEFAULT: '150ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    
    // 动画曲线
    transitionTimingFunction: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  // 自定义规则
  rules: [
    // Button组件规则
    ['y-button', {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid',
      outline: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontWeight: '500',
      lineHeight: '1.5',
      textDecoration: 'none',
      transition: 'all 0.2s ease-in-out',
      userSelect: 'none',
      position: 'relative'
    }],
    
    // 尺寸变体
    ['y-button-sm', {
      padding: '4px 12px',
      fontSize: '12px',
      gap: '4px',
      minHeight: '24px'
    }],
    
    ['y-button-md', {
      padding: '6px 16px', 
      fontSize: '14px',
      gap: '6px',
      minHeight: '32px'
    }],
    
    ['y-button-lg', {
      padding: '8px 20px',
      fontSize: '16px', 
      gap: '8px',
      minHeight: '40px'
    }],
    
    // 状态规则
    ['y-button-block', {
      display: 'flex',
      width: '100%'
    }],
    
    ['y-button-disabled', {
      opacity: '0.6',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }],
    
    ['y-button-loading', {
      color: 'transparent'
    }],
    
    // 加载动画
    ['y-loading-spinner', {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '16px',
      height: '16px',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'y-spin 1s linear infinite'
    }],
    
    // 消息组件规则
    ['y-message', {
      width: 'fit-content',
      maxWidth: '400px',
      background: 'var(--y-bg)',
      border: '1px solid var(--y-border-light)',
      borderRadius: '6px',
      fontSize: '14px',
      lineHeight: '1.4',
      transition: 'all 0.2s ease',
      boxShadow: 'var(--y-shadow-sm)',
      position: 'relative'
    }],
    
    ['y-message-sm', {
      fontSize: '13px',
      padding: '6px 10px'
    }],
    
    ['y-message-md', {
      fontSize: '14px',
      padding: '8px 12px'
    }],
    
    ['y-message-lg', {
      fontSize: '16px',
      padding: '10px 16px'
    }],
    
    ['y-message-success', {
      borderColor: 'var(--y-success-light)',
      backgroundColor: 'var(--y-success-lighter)',
      color: 'var(--y-success-dark)'
    }],
    
    ['y-message-warning', {
      borderColor: 'var(--y-warning-light)',
      backgroundColor: 'var(--y-warning-lighter)',
      color: 'var(--y-warning-dark)'
    }],
    
    ['y-message-error', {
      borderColor: 'var(--y-danger-light)',
      backgroundColor: 'var(--y-danger-lighter)',
      color: 'var(--y-danger-dark)'
    }],
    
    ['y-message-info', {
      borderColor: 'var(--y-info-light)',
      backgroundColor: 'var(--y-info-lighter)',
      color: 'var(--y-info-dark)'
    }],
    
    ['y-message__indicator', {
      position: 'absolute',
      left: '0',
      top: '4px',
      bottom: '4px',
      width: '4px',
      borderRadius: '2px',
      transition: 'all 0.2s ease'
    }],
    
    ['y-message__content', {
      paddingLeft: '8px',
      paddingRight: '24px',
      color: 'var(--y-text-primary)'
    }],
    
    ['y-message__close', {
      position: 'absolute',
      top: '4px',
      right: '4px',
      padding: '4px',
      color: 'var(--y-text-tertiary)',
      cursor: 'pointer',
      borderRadius: '2px',
      transition: 'all 0.15s ease',
      border: 'none',
      background: 'none'
    }],
    
    // 卡片组件规则
    ['y-card', {
      borderRadius: '8px',
      border: '1px solid var(--y-border)',
      backgroundColor: 'var(--y-bg)',
      boxShadow: 'var(--y-shadow-sm)'
    }],
    
    // 输入框组件规则  
    ['y-input', {
      display: 'inline-flex',
      alignItems: 'center',
      border: '1px solid var(--y-border)',
      borderRadius: '4px',
      backgroundColor: 'var(--y-bg)',
      padding: '6px 12px',
      fontSize: '14px',
      transition: 'all 0.2s'
    }],
    
    ['y-input:focus', {
      outline: 'none',
      borderColor: 'var(--y-primary)',
      boxShadow: '0 0 0 2px rgba(22, 119, 255, 0.2)'
    }]
  ],
  
  // 快捷方式
  shortcuts: {
    // 按钮快捷方式
    'y-btn-primary': 'y-button bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700',
    'y-btn-success': 'y-button bg-success-600 text-white border-success-600 hover:bg-success-700 hover:border-success-700', 
    'y-btn-error': 'y-button bg-error-600 text-white border-error-600 hover:bg-error-700 hover:border-error-700',
    'y-btn-warning': 'y-button bg-warning-500 text-white border-warning-500 hover:bg-warning-600 hover:border-warning-600',
    'y-btn-outline': 'y-button bg-transparent text-text-primary border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400',
    'y-btn-ghost': 'y-button bg-transparent text-text-primary border-transparent hover:bg-neutral-100',
    
    // 布局快捷方式
    'y-flex-center': 'flex items-center justify-center',
    'y-flex-between': 'flex items-center justify-between',
    'y-flex-col': 'flex flex-col',
    
    // 文本快捷方式
    'y-text-primary': 'text-text-primary',
    'y-text-secondary': 'text-text-secondary',
    'y-text-disabled': 'text-text-disabled',
    
    // 常用间距
    'y-p-sm': 'p-2',
    'y-p-md': 'p-4', 
    'y-p-lg': 'p-6',
    'y-m-sm': 'm-2',
    'y-m-md': 'm-4',
    'y-m-lg': 'm-6',
    
    // 消息组件快捷方式
    'y-message-success': 'y-message y-message-success',
    'y-message-warning': 'y-message y-message-warning',
    'y-message-error': 'y-message y-message-error',
    'y-message-info': 'y-message y-message-info',
    'y-message-sm': 'y-message y-message-sm',
    'y-message-md': 'y-message y-message-md',
    'y-message-lg': 'y-message y-message-lg'
  },
  
  // 动画关键帧
  keyframes: {
    'y-spin': {
      '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
      '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
    },
    'y-fade-in': {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' }
    },
    'y-slide-up': {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' }
    }
  },
  
  // 确保提取所有用到的样式
  content: {
    filesystem: [
      'lib/**/*.{ts,tsx,js,jsx,vue,svelte}',
      'src/**/*.{ts,tsx,js,jsx,vue,svelte}',
      'docs/**/*.{md,vue}'
    ]
  },
  
  // 主题切换支持
  transformers: [],
  
  // 开发配置
  dev: {
    inspector: true
  }
})