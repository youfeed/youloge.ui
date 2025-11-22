// css-installer.js（完整响应式版）
let isInjected = false, themeInitialized = false, themeStyleTag = null;

// ========================= 响应式断点配置 =========================
const BREAKPOINTS = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
};

// ========================= 基础间距配置 =========================
const BASE_SPACING = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 基于基础间距生成各种范围
const generateRanges = (spacingArray) => ({
  spacing: spacingArray, // 基础间距：0-10 * 4px
  size: spacingArray.map(i => i * 2), // 尺寸：0-20 * 4px
  gap: spacingArray, // 间隙：0-10 * 4px
  position: spacingArray.map(i => i * 4), // 位置：0-40 * 4px
  percentage: spacingArray.map(i => i * 10) // 百分比：0-100%
});

// ========================= 工具函数 =========================
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
};

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

const adjustBrightness = (rgb, factor) => rgb.map(c => Math.max(0, Math.min(255, Math.round(c * factor))));

// ========================= 颜色生成算法 =========================
const generateColorScale = (baseColor, type = 'light') => {
  const [r, g, b] = hexToRgb(baseColor);
  const factors = type === 'light' 
    ? [0.95, 0.85, 0.75, 0.60, 0.45, 0.35, 0.25, 0.15, 0.08]
    : [1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 1];
  
  return ['100', '200', '300', '400', '500', '600', '700', '800', '900'].reduce((acc, scale, i) => {
    acc[scale] = rgbToHex(...adjustBrightness([r, g, b], factors[i]));
    return acc;
  }, {});
};

const generateFunctionalColors = (baseColor) => {
  const [r, g, b] = hexToRgb(baseColor);
  return {
    'base': baseColor,
    'hover': rgbToHex(...adjustBrightness([r, g, b], 1.15)),
    'active': rgbToHex(...adjustBrightness([r, g, b], 0.85))
  };
};

// ========================= 基础颜色配置 =========================
const BASE_COLORS = {
  light: {
    'neutral': '#f9fafb', 'primary': '#0969da', 'success': '#10b981', 'error': '#cf222e', 
    'warning': '#f59e0b', 'info': '#6366f1', 'red': '#dc2626', 'orange': '#ea580c', 
    'yellow': '#ca8a04', 'green': '#16a34a', 'teal': '#0d9488', 'blue': '#2563eb', 
    'indigo': '#4f46e5', 'purple': '#7c3aed', 'pink': '#db2777', 'rose': '#e11d48', 
    'cyan': '#0891b2', 'lime': '#65a30d', 'white': '#ffffff', 'black': '#000000'
  },
  dark: {
    'neutral': '#111827', 'primary': '#2584f0', 'success': '#34d399', 'error': '#f87171',
    'warning': '#fbbf24', 'info': '#818cf8', 'red': '#ef4444', 'orange': '#fb923c', 
    'yellow': '#facc15', 'green': '#22c55e', 'teal': '#2dd4bf', 'blue': '#3b82f6', 
    'indigo': '#6366f1', 'purple': '#a855f7', 'pink': '#ec4899', 'rose': '#fb7185', 
    'cyan': '#06b6d4', 'lime': '#84cc16', 'white': '#111827', 'black': '#f9fafb'
  }
};

// ========================= 自动生成完整主题 =========================
const generateCompleteTheme = (baseColors, themeType) => {
  const neutralScale = generateColorScale(baseColors.neutral, themeType);
  const functionalColors = ['primary', 'success', 'error', 'warning', 'info'].reduce((acc, color) => {
    const colors = generateFunctionalColors(baseColors[color]);
    acc[color] = colors.base;
    acc[`${color}-hover`] = colors.hover;
    acc[`${color}-active`] = colors.active;
    return acc;
  }, {});

  const extendedColors = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink', 'rose', 'cyan', 'lime']
    .reduce((acc, colorName) => {
      const colorScale = generateColorScale(baseColors[colorName], themeType);
      acc[colorName] = baseColors[colorName];
      Object.entries(colorScale).forEach(([scale, value]) => {
        acc[`${colorName}-${scale}`] = value;
      });
      return acc;
    }, {});

  return {
    'font-family': 'PingFang SC, Microsoft YaHei, Arial Regular',
    'font-family-medium': 'PingFang SC, Microsoft YaHei, Arial Medium',
    'spacing-unit': '4px', 'border-width': '1px', 'border-radius-sm': '2px',
    'border-radius': '4px', 'border-radius-lg': '8px', 'font-size-xs': '12px',
    'font-size-sm': '14px', 'font-size-base': '16px', 'font-size-lg': '18px',
    'transition-duration': '0.2s', 'transition-timing': 'ease-in-out',
    
    'neutral': baseColors.neutral,
    ...Object.entries(neutralScale).reduce((acc, [key, value]) => {
      acc[`neutral-${key}`] = value;
      return acc;
    }, {}),
    ...functionalColors,
    ...extendedColors,
    'white': baseColors.white,
    'black': baseColors.black,
    
    'shadow': themeType === 'light' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.3)',
    'shadow-md': themeType === 'light' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
  };
};

// ========================= 配置和规则 =========================
const BASE_THEMES = {
  light: generateCompleteTheme(BASE_COLORS.light, 'light'),
  dark: generateCompleteTheme(BASE_COLORS.dark, 'dark')
};

const RANGES = generateRanges(BASE_SPACING);

const RULES = {
  // 间距类
  'm': v => `margin: ${v}px;`,
  'mx': v => `margin-left: ${v}px; margin-right: ${v}px;`, 
  'my': v => `margin-top: ${v}px; margin-bottom: ${v}px;`, 
  'mt': v => `margin-top: ${v}px;`, 'mr': v => `margin-right: ${v}px;`,
  'mb': v => `margin-bottom: ${v}px;`, 'ml': v => `margin-left: ${v}px;`,
  'p': v => `padding: ${v}px;`, 'px': v => `padding-left: ${v}px; padding-right: ${v}px;`,
  'py': v => `padding-top: ${v}px; padding-bottom: ${v}px;`, 'pt': v => `padding-top: ${v}px;`,
  'pr': v => `padding-right: ${v}px;`, 'pb': v => `padding-bottom: ${v}px;`, 'pl': v => `padding-left: ${v}px;`,
  
  // 尺寸类
  'w': v => `width: ${v}px;`, 'h': v => `height: ${v}px;`,
  'min-w': v => `min-width: ${v}px;`, 'max-w': v => `max-width: ${v}px;`,
  'min-h': v => `min-height: ${v}px;`, 'max-h': v => `max-height: ${v}px;`,
  
  // 布局类
  'flex': () => 'display: flex;', 'flex-col': () => 'display: flex; flex-direction: column;',
  'flex-row': () => 'display: flex; flex-direction: row;', 'justify-start': () => 'justify-content: flex-start;',
  'justify-center': () => 'justify-content: center;', 'justify-end': () => 'justify-content: flex-end;',
  'justify-between': () => 'justify-content: space-between;', 'justify-around': () => 'justify-content: space-around;',
  'items-start': () => 'align-items: flex-start;', 'items-center': () => 'align-items: center;',
  'items-end': () => 'align-items: flex-end;', 'items-baseline': () => 'align-items: baseline;',
  'flex-shrink-0': () => 'flex-shrink: 0;', 'gap': v => `gap: ${v}px;`, 
  
  // 边框类
  'border': () => `border: 1px solid var(--neutral-200);`, 'border-0': () => 'border: 0;',
  'border-t': () => `border-top: 1px solid var(--neutral-200);`, 'border-r': () => `border-right: 1px solid var(--neutral-200);`,
  'border-b': () => `border-bottom: 1px solid var(--neutral-200);`, 'border-l': () => `border-left: 1px solid var(--neutral-200);`,
  
  // 圆角类
  'rounded-sm': () => 'border-radius: 2px;', 'rounded-md': () => 'border-radius: 4px;',
  'rounded-lg': () => 'border-radius: 8px;', 'rounded-full': () => 'border-radius: 9999px;',
  
  // 颜色类
  'text': c => `color: ${c};`, 'bg': c => `background-color: ${c};`, 'border-color': c => `border-color: ${c};`,
  
  // 阴影类
  'shadow': () => `box-shadow: var(--shadow);`, 'shadow-md': () => `box-shadow: var(--shadow-md);`,
  
  // 轮廓类
  'outline-0': () => 'outline: 0;',
  
  // 溢出类
  'overflow-hidden': () => 'overflow: hidden;', 'overflow-auto': () => 'overflow: auto;',
  
  // 交互类
  'cursor-pointer': () => 'cursor: pointer;', 'cursor-default': () => 'cursor: default;',
  
  // 透明度类
  'opacity-50': () => 'opacity: 0.5;', 'opacity-75': () => 'opacity: 0.75;',
  
  // 状态类
  'disabled': () => `background-color: var(--neutral-300); color: var(--neutral-500); opacity: 0.7; cursor: not-allowed; pointer-events: none;`,
  
  // 文本类
  'text-ellipsis': () => 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
  'text-center': () => 'text-align: center;', 'text-left': () => 'text-align: left;', 'text-right': () => 'text-align: right;',
  
  // 位置类
  'top': v => `top: ${v};`, 'right': v => `right: ${v};`, 'bottom': v => `bottom: ${v};`, 'left': v => `left: ${v};`,
  
  // 定位类
  'relative': () => 'position: relative;', 'absolute': () => 'position: absolute;',
  'fixed': () => 'position: fixed;', 'sticky': () => 'position: sticky;',
  
  // 显示类
  'block': () => 'display: block;', 'inline-block': () => 'display: inline-block;',
  'inline': () => 'display: inline;', 'hidden': () => 'display: none;',
  'inline-flex': () => 'display: inline-flex;', 'grid': () => 'display: grid;', 'inline-grid': () => 'display: inline-grid;'
};

const DEFAULT_CONFIG = {
  unit: 4,
  ranges: RANGES,
  get colors() {
    const colorVars = {};
    
    colorVars['neutral'] = 'var(--neutral)';
    for (let i = 1; i <= 9; i++) colorVars[`neutral-${i}00`] = `var(--neutral-${i}00)`;
    
    ['primary', 'success', 'error', 'warning', 'info'].forEach(color => {
      colorVars[color] = `var(--${color})`;
      colorVars[`${color}-hover`] = `var(--${color}-hover)`;
      colorVars[`${color}-active`] = `var(--${color}-active)`;
    });
    
    ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink', 'rose', 'cyan', 'lime']
      .forEach(color => {
        colorVars[color] = `var(--${color})`;
        colorVars[`${color}-500`] = `var(--${color})`;
        for (let i = 1; i <= 9; i++) colorVars[`${color}-${i}00`] = `var(--${color}-${i}00)`;
      });
    
    Object.assign(colorVars, {
      'blue-500': 'var(--primary)', 'blue-600': 'var(--primary-active)',
      'red-500': 'var(--error)', 'green-500': 'var(--success)',
      'white': 'var(--white)', 'black': 'var(--black)', 'transparent': 'transparent'
    });
    
    return colorVars;
  },
  rules: RULES,
  breakpoints: BREAKPOINTS
};

// ========================= CSS生成核心函数 =========================
const mergeConfig = (userConfig = {}) => ({
  unit: userConfig.unit || DEFAULT_CONFIG.unit,
  ranges: { ...RANGES, ...userConfig.ranges },
  colors: { ...DEFAULT_CONFIG.colors, ...userConfig.colors },
  rules: { ...RULES, ...userConfig.rules },
  breakpoints: userConfig.breakpoints || BREAKPOINTS
});

/**
 * 生成基础CSS类
 */
const generateBaseClasses = (config) => {
  const { ranges, colors, rules } = config;
  let css = '';
  
  // 基础类前缀定义
  const spacingPrefixes = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'];
  const sizePrefixes = ['w', 'h', 'min-w', 'max-w', 'min-h', 'max-h'];
  const colorPrefixes = ['text', 'bg', 'border-color'];
  const positionPrefixes = ['top', 'right', 'bottom', 'left'];

  // 生成间距类
  spacingPrefixes.forEach(prefix => ranges.spacing.forEach(num => {
    const style = rules[prefix]?.(num * config.unit);
    if (style) css += `.${prefix}-${num} { ${style} }\n`;
  }));

  // 生成尺寸类
  sizePrefixes.forEach(prefix => ranges.size.forEach(num => {
    const style = rules[prefix]?.(num * config.unit);
    if (style) css += `.${prefix}-${num} { ${style} }\n`;
  }));

  // 生成gap类
  ranges.gap.forEach(num => {
    const style = rules.gap?.(num * config.unit);
    if (style) css += `.gap-${num} { ${style} }\n`;
  });

  // 生成位置类（px值）
  positionPrefixes.forEach(prefix => ranges.position.forEach(num => {
    const style = rules[prefix]?.(`${num * config.unit}px`);
    if (style) css += `.${prefix}-${num} { ${style} }\n`;
  }));

  // 生成位置类（百分比值）
  positionPrefixes.forEach(prefix => ranges.percentage.forEach(percent => {
    const style = rules[prefix]?.(`${percent}%`);
    if (style) css += `.${prefix}-${percent}p { ${style} }\n`;
  }));

  // 生成颜色类
  colorPrefixes.forEach(prefix => Object.entries(colors).forEach(([color, value]) => {
    const style = rules[prefix]?.(value);
    if (style) css += `.${prefix}-${color} { ${style} }\n`;
  }));

  // 生成边框颜色类
  Object.entries(colors).forEach(([color, value]) => {
    css += `.border-${color} { border-color: ${value}; }\n`;
    ['t', 'r', 'b', 'l'].forEach(dir => css += `.border-${dir}-${color} { border-${dir}-color: ${value}; }\n`);
  });

  // 生成无参数类
  const allPrefixes = [...spacingPrefixes, ...sizePrefixes, ...colorPrefixes, ...positionPrefixes, 'gap'];
  Object.entries(rules).forEach(([name, fn]) => {
    if (!allPrefixes.includes(name)) {
      const style = fn?.();
      if (style) css += `.${name} { ${style} }\n`;
    }
  });

  return css;
};

/**
 * 生成响应式CSS
 */
const generateResponsiveCss = (config, breakpoints) => {
  const { rules, colors, ranges } = config;
  let responsiveCss = '';
  
  // 所有需要响应式支持的类
  const responsiveClasses = {
    // 数值类前缀
    numericPrefixes: {
      spacing: ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'],
      sizing: ['w', 'h', 'min-w', 'max-w', 'min-h', 'max-h'],
      positioning: ['top', 'right', 'bottom', 'left'],
      gap: ['gap']
    },
    // 无参数类
    utilityClasses: [
      // 显示类
      'hidden', 'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid',
      // 布局类
      'flex-col', 'flex-row', 'justify-start', 'justify-center', 'justify-end', 
      'justify-between', 'justify-around', 'items-start', 'items-center', 
      'items-end', 'items-baseline', 'flex-shrink-0',
      // 边框类
      'border', 'border-0', 'border-t', 'border-r', 'border-b', 'border-l',
      'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-full',
      // 阴影类
      'shadow', 'shadow-md',
      // 溢出类
      'overflow-hidden', 'overflow-auto',
      // 交互类
      'cursor-pointer', 'cursor-default',
      // 透明度类
      'opacity-50', 'opacity-75',
      // 文本类
      'text-ellipsis', 'text-center', 'text-left', 'text-right',
      // 定位类
      'relative', 'absolute', 'fixed', 'sticky'
    ],
    // 颜色类前缀
    colorPrefixes: ['text', 'bg']
  };

  Object.entries(breakpoints).forEach(([breakpoint, minWidth]) => {
    let breakpointCss = '';
    
    // 1. 生成数值类响应式（间距、尺寸、位置、间隙）
    const { numericPrefixes } = responsiveClasses;
    
    // 间距类
    numericPrefixes.spacing.forEach(prefix => {
      ranges.spacing.forEach(num => {
        const style = rules[prefix]?.(num * config.unit);
        if (style) breakpointCss += `.${breakpoint}\\:${prefix}-${num} { ${style} }\n`;
      });
    });
    
    // 尺寸类
    numericPrefixes.sizing.forEach(prefix => {
      ranges.size.forEach(num => {
        const style = rules[prefix]?.(num * config.unit);
        if (style) breakpointCss += `.${breakpoint}\\:${prefix}-${num} { ${style} }\n`;
      });
    });
    
    // 位置类
    numericPrefixes.positioning.forEach(prefix => {
      ranges.position.forEach(num => {
        const style = rules[prefix]?.(`${num * config.unit}px`);
        if (style) breakpointCss += `.${breakpoint}\\:${prefix}-${num} { ${style} }\n`;
      });
    });
    
    // 间隙类
    numericPrefixes.gap.forEach(prefix => {
      ranges.gap.forEach(num => {
        const style = rules[prefix]?.(num * config.unit);
        if (style) breakpointCss += `.${breakpoint}\\:${prefix}-${num} { ${style} }\n`;
      });
    });
    
    // 2. 生成无参数工具类响应式
    responsiveClasses.utilityClasses.forEach(className => {
      const style = rules[className]?.();
      if (style) breakpointCss += `.${breakpoint}\\:${className} { ${style} }\n`;
    });
    
    // 3. 生成颜色类响应式
    responsiveClasses.colorPrefixes.forEach(prefix => {
      Object.entries(colors).forEach(([color, value]) => {
        const style = rules[prefix]?.(value);
        if (style) breakpointCss += `.${breakpoint}\\:${prefix}-${color} { ${style} }\n`;
      });
    });
    
    // 4. 生成边框颜色类响应式
    Object.entries(colors).forEach(([color, value]) => {
      const style = rules['border-color']?.(value);
      if (style) breakpointCss += `.${breakpoint}\\:border-${color} { ${style} }\n`;
    });

    if (breakpointCss) {
      responsiveCss += `@media (min-width: ${minWidth}) { ${breakpointCss} }\n`;
    }
  });

  return responsiveCss;
};

const generateCss = (config) => {
  let css = generateBaseClasses(config);
  css += generateResponsiveCss(config, config.breakpoints);
  return css;
};

// ========================= 样式注入和主题管理 =========================
const injectCss = (css) => {
  if (!css || isInjected || typeof window === 'undefined') return;
  const styleTag = document.createElement('style');
  styleTag.id = 'css-utils-styles';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
  isInjected = true;
};

const generateThemeCss = (colors) => `:root { ${Object.entries(colors).map(([k, v]) => `--${k}: ${v};`).join(' ')} }`;

const getThemeStyleTag = () => {
  if (themeStyleTag) return themeStyleTag;
  themeStyleTag = document.getElementById('theme-vars-style') || document.createElement('style');
  themeStyleTag.id = 'theme-vars-style';
  const cssUtilsTag = document.getElementById('css-utils-styles');
  if (cssUtilsTag) document.head.insertBefore(themeStyleTag, cssUtilsTag);
  else document.head.appendChild(themeStyleTag);
  return themeStyleTag;
};

// ========================= 导出API =========================
export const initThemeVars = (options = {}) => {
  if (typeof window === 'undefined' || themeInitialized) return;
  const { theme = 'light', customColors = {} } = options;
  const finalColors = { ...BASE_THEMES[theme], ...customColors };
  getThemeStyleTag().textContent = generateThemeCss(finalColors);
  localStorage.setItem('youloge-ui-theme', JSON.stringify({ theme, colors: finalColors }));
  themeInitialized = true;
};

export const switchTheme = (theme) => {
  if (!['light', 'dark'].includes(theme)) { console.warn(`无效主题: ${theme}`); theme = 'light'; }
  const savedColors = JSON.parse(localStorage.getItem('youloge-ui-theme'))?.colors || {};
  const finalColors = { ...BASE_THEMES[theme], ...savedColors };
  getThemeStyleTag().textContent = generateThemeCss(finalColors);
  localStorage.setItem('youloge-ui-theme', JSON.stringify({ theme, colors: finalColors }));
  window.dispatchEvent(new CustomEvent('youlogeThemeChange', { detail: { theme, colors: finalColors } }));
};

export const customThemeColors = (customColors = {}) => {
  if (typeof window === 'undefined') return;
  const saved = JSON.parse(localStorage.getItem('youloge-ui-theme')) || { theme: 'light', colors: BASE_THEMES.light };
  const finalColors = { ...saved.colors, ...customColors };
  Object.entries(finalColors).forEach(([k, v]) => document.documentElement.style.setProperty(`--${k}`, v));
  localStorage.setItem('youloge-ui-theme', JSON.stringify({ ...saved, colors: finalColors }));
  window.dispatchEvent(new CustomEvent('youlogeThemeChange', { detail: { theme: saved.theme, colors: finalColors } }));
  return finalColors;
};

export const getCurrentTheme = () => JSON.parse(localStorage.getItem('youloge-ui-theme')) || { theme: 'light', colors: BASE_THEMES.light };

export const customizeBaseColors = (baseColors, themeType = 'light') => {
  if (typeof window === 'undefined') return;
  const completeTheme = generateCompleteTheme({ ...BASE_COLORS[themeType], ...baseColors }, themeType);
  getThemeStyleTag().textContent = generateThemeCss(completeTheme);
  localStorage.setItem('youloge-ui-theme', JSON.stringify({ theme: themeType, colors: completeTheme, baseColors }));
};

export const switchNeutralTone = (tone = 'cool') => {
  const baseColors = { cool: { neutral: '#f9fafb' }, warm: { neutral: '#fdf6f0' } };
  const currentTheme = getCurrentTheme();
  customizeBaseColors(baseColors[tone] || baseColors.cool, currentTheme.theme);
};

export const installCss = (userConfig = {}) => {
  const config = mergeConfig(userConfig);
  const css = generateCss(config);
  injectCss(css);
  const { theme = 'light', customColors = {} } = userConfig;
  initThemeVars({ theme, customColors });
};

export const uninstallCss = () => {
  const styleTag = document.getElementById('css-utils-styles');
  if (styleTag) { document.head.removeChild(styleTag); isInjected = false; }
};

export const getBreakpoints = () => BREAKPOINTS;
export const setCustomBreakpoints = (customBreakpoints) => {
  Object.assign(BREAKPOINTS, customBreakpoints);
};

export const getBaseSpacing = () => BASE_SPACING;
export const setCustomSpacing = (customSpacing) => {
  BASE_SPACING.splice(0, BASE_SPACING.length, ...customSpacing);
};

// ========================= 使用示例 =========================
/*
// 基本使用
installCss();

// 自定义配置
installCss({
  theme: 'dark',
  unit: 8, // 修改基础单位
  customColors: {
    'primary': '#ff0000',
    'neutral': '#f0f0f0'
  }
});

// 切换主题
switchTheme('light');

// 自定义断点
setCustomBreakpoints({
  'sm': '576px',
  'md': '768px', 
  'lg': '992px',
  'xl': '1200px'
});

// 响应式使用示例
<div class="block md:hidden lg:flex">
  <div class="w-full md:w-1/2 lg:w-1/4 p-2 md:p-4 lg:p-6">
    <button class="bg-primary md:bg-error lg:bg-success text-white rounded-sm md:rounded-lg">
      响应式按钮
    </button>
  </div>
</div>
*/