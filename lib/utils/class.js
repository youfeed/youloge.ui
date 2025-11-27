// css-installer.js - TDesign风格颜色系统
class CSSInstaller {
  constructor(config = {}) {
    this.isInjected = false;
    this.themeInitialized = false;
    this.themeStyleTag = null;
    this.config = this.mergeConfig(config);
    this.cssRules = new Map();
  }

  // ========================= 配置管理 =========================
  static BREAKPOINTS = {
    'xs': '359px',  // ≤359px
    'sm': '575px',  // ≤575px
    'md': '767px',  // ≤767px
    'lg': '1023px', // ≤1023px
    'xl': '1279px'  // ≤1279px
  };

  static BASE_SPACING = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  static GRID_COLUMNS = 24;

  // ========================= 基础颜色配置 =========================
  static BASE_COLORS = {
    light: {
      'primary': '#1677ff',     'success': '#00a870',     'error': '#e34d59',
      'warning': '#ed7b2f',     'info': '#0052d9',       'link': '#0052d9',
      'red': '#e34d59',         'blue': '#0052d9',       'pink': '#ed49b4',
      'green': '#00a870',       'orange': '#ed7b2f',     'purple': '#834ec2',
      'cyan': '#0594fa',        'volcano': '#e34d59',    'gold': '#ebb105',
      'lime': '#7eb712',        'magenta': '#ed49b4',    'geekblue': '#0052d9',
      'neutral': '#f3f3f3',     'text': '#000000e0',     'border': '#dcdcdc',
      'bg': '#ffffff',          'white': '#ffffff',      'black': '#000000'
    },
    dark: {
      'primary': '#3c7eff',     'success': '#23c343',     'error': '#f54a45',
      'warning': '#f79031',     'info': '#3c7eff',       'link': '#3c7eff',
      'red': '#f54a45',         'blue': '#3c7eff',       'pink': '#f765a3',
      'green': '#23c343',       'orange': '#f79031',     'purple': '#a97af8',
      'cyan': '#23c7e7',        'volcano': '#f54a45',    'gold': '#f7ba1e',
      'lime': '#bbf24f',        'magenta': '#f765a3',    'geekblue': '#3c7eff',
      'neutral': '#141414',     'text': '#ffffff',       'border': '#5e5e5e',
      'bg': '#000000',          'white': '#141414',      'black': '#ffffff'
    }
  };

  // ========================= TDesign风格颜色生成算法 =========================
  static generateColorScale(baseColor) {
    // Hex 转 HSL
    const hexToHsl = (hex) => {
      hex = hex.replace(/^#/, '');
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }
      return { h, s: s * 100, l: l * 100 };
    };

    // HSL 转 Hex
    const hslToHex = (h, s, l) => {
      s /= 100;
      l /= 100;
      const k = n => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
      return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
    };

    const { h, s, l } = hexToHsl(baseColor);
    
    // TDesign 风格的颜色配置（视觉均匀）
    const colorConfigs = [
      { name: 'bg', l: 95, s: 100 },           // 背景色 - 非常浅
      { name: 'bg-hover', l: 95, s: 100 },     // 悬浮背景 - 与背景相同
      { name: 'border', l: 80, s: 85 },        // 边框色 - 浅色
      { name: 'border-hover', l: 70, s: 90 },  // 悬浮边框 - 稍深
      { name: 'hover', l: 60, s: 95 },         // 悬浮色 - 中等深度
      { name: 'base', l: l, s: s },            // 主色 - 原始颜色
      { name: 'active', l: 40, s: 95 },        // 点击色 - 深色
      { name: 'text', l: l, s: s },            // 文字色 - 与主色相同
      { name: 'text-hover', l: 60, s: 95 },    // 悬浮文字 - 与悬浮色相同
      { name: 'text-active', l: 40, s: 95 }     // 点击文字 - 与点击色相同
    ];

    return colorConfigs.reduce((acc, { name, l: targetL, s: targetS }) => {
      acc[name] = hslToHex(h, targetS, targetL);
      return acc;
    }, {});
  }

  // 生成100-900色阶（TDesign风格）
  static generateColorScale100900(baseColor) {
    const hexToHsl = (hex) => {
      hex = hex.replace(/^#/, '');
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }
      return { h, s: s * 100, l: l * 100 };
    };

    const hslToHex = (h, s, l) => {
      s /= 100;
      l /= 100;
      const k = n => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
      return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
    };

    const { h, s } = hexToHsl(baseColor);
    
    // TDesign 风格的100-900色阶（视觉均匀分布）
    const levels = {
      100: { l: 95, s: 30 },  // 最浅
      200: { l: 90, s: 40 },
      300: { l: 80, s: 50 },
      400: { l: 60, s: 70 },
      500: { l: 50, s: 90 },   // 中等
      600: { l: 40, s: 95 },
      700: { l: 30, s: 95 },
      800: { l: 20, s: 90 },
      900: { l: 10, s: 85 }    // 最深
    };

    return Object.entries(levels).reduce((acc, [level, { l, s: targetS }]) => {
      acc[level] = hslToHex(h, targetS, l);
      return acc;
    }, {});
  }

  // 为所有颜色生成语义化Token
  static generateAllSemanticTokens(colors) {
    const tokens = {};
    
    // 功能色
    const functionalColors = ['primary', 'success', 'error', 'warning', 'info', 'link'];
    // 扩展彩色
    const extendedColors = [
      'red', 'blue', 'pink', 'green', 'orange', 'purple', 'cyan', 
      'volcano', 'gold', 'lime', 'magenta', 'geekblue'
    ];
    
    const allColors = [...functionalColors, ...extendedColors];
    
    allColors.forEach(colorName => {
      if (colors[colorName]) {
        const scale = this.generateColorScale(colors[colorName]);
        Object.entries(scale).forEach(([token, value]) => {
          tokens[`${colorName}-${token}`] = value;
        });
        
        // 同时生成100-900色阶
        const scale100900 = this.generateColorScale100900(colors[colorName]);
        Object.entries(scale100900).forEach(([level, value]) => {
          tokens[`${colorName}-${level}`] = value;
        });
      }
    });

    return tokens;
  }

  // ========================= 规则配置 =========================
  static RULES = {
    // 间距类
    'm': v => `margin: ${v}px;`,
    'mx': v => `margin-left: ${v}px; margin-right: ${v}px;`,
    'my': v => `margin-top: ${v}px; margin-bottom: ${v}px;`,
    'mt': v => `margin-top: ${v}px;`,
    'mr': v => `margin-right: ${v}px;`,
    'mb': v => `margin-bottom: ${v}px;`,
    'ml': v => `margin-left: ${v}px;`,
    'p': v => `padding: ${v}px;`,
    'px': v => `padding-left: ${v}px; padding-right: ${v}px;`,
    'py': v => `padding-top: ${v}px; padding-bottom: ${v}px;`,
    'pt': v => `padding-top: ${v}px;`,
    'pr': v => `padding-right: ${v}px;`,
    'pb': v => `padding-bottom: ${v}px;`,
    'pl': v => `padding-left: ${v}px;`,
    
    // 尺寸类
    'w': v => `width: ${v}px;`,
    'h': v => `height: ${v}px;`,
    'min-w': v => `min-width: ${v}px;`,
    'max-w': v => `max-width: ${v}px;`,
    'min-h': v => `min-height: ${v}px;`,
    'max-h': v => `max-height: ${v}px;`,
    
    // 布局类
    'flex': () => 'display: flex;',
    'flex-col': () => 'flex-direction: column;',
    'justify-center': () => 'justify-content: center;',
    'items-center': () => 'align-items: center;',
    'hidden': () => 'display: none;',
    'block': () => 'display: block;',
    
    // 边框圆角
    'border': () => 'border: 1px solid;',
    'rounded': () => 'border-radius: 4px;',
    
    // 颜色类
    'text': c => `color: var(--${c});`,
    'bg': c => `background-color: var(--${c});`,
    'border-color': c => `border-color: var(--${c});`
  };

  mergeConfig(userConfig = {}) {
    const theme = userConfig.theme || 'light';
    return {
      unit: userConfig.unit || 4,
      theme: theme,
      breakpoints: { ...CSSInstaller.BREAKPOINTS, ...userConfig.breakpoints },
      colors: { ...CSSInstaller.BASE_COLORS[theme], ...userConfig.colors },
      rules: { ...CSSInstaller.RULES, ...userConfig.rules },
      gridColumns: userConfig.gridColumns || CSSInstaller.GRID_COLUMNS,
      ...userConfig
    };
  }

  // ========================= CSS生成 =========================
  generateBaseCSS() {
    let css = '';

    // 1. 生成CSS变量
    css += this.generateCSSVariables();

    // 2. 生成工具类
    css += this.generateUtilityClasses();

    // 3. 生成24宫格系统
    css += this.generate24GridSystem();

    // 4. 生成响应式类
    css += this.generateResponsiveCSS();

    return css;
  }

  generateCSSVariables() {
    const { colors, theme } = this.config;
    let css = ':root {\n';
    
    // 1. 基础颜色变量
    Object.entries(colors).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`;
    });

    // 2. 生成语义化Token（TDesign风格）
    const semanticTokens = CSSInstaller.generateAllSemanticTokens(colors);
    Object.entries(semanticTokens).forEach(([token, value]) => {
      css += `  --${token}: ${value};\n`;
    });

    css += '}\n\n';

    // 3. 暗色主题支持
    css += '@media (prefers-color-scheme: dark) {\n';
    css += '  :root {\n';
    Object.entries(CSSInstaller.BASE_COLORS.dark).forEach(([key, value]) => {
      css += `    --${key}: ${value};\n`;
    });
    
    // 暗色主题语义化Token
    const darkSemanticTokens = CSSInstaller.generateAllSemanticTokens(CSSInstaller.BASE_COLORS.dark);
    Object.entries(darkSemanticTokens).forEach(([token, value]) => {
      css += `    --${token}: ${value};\n`;
    });
    
    css += '  }\n';
    css += '}\n\n';

    return css;
  }

  generateUtilityClasses() {
    const { unit, rules } = this.config;
    let css = '';

    // 生成间距类
    ['m', 'p'].forEach(prefix => {
      CSSInstaller.BASE_SPACING.slice(0, 13).forEach(num => {
        const value = num * unit;
        const rule = rules[prefix];
        if (rule) {
          css += `.${prefix}-${num} { ${rule(value)} }\n`;
        }
      });
    });

    // 生成无参数类
    Object.entries(rules).forEach(([name, rule]) => {
      if (typeof rule === 'function' && rule.length === 0) {
        css += `.${name} { ${rule()} }\n`;
      }
    });

    // 生成颜色工具类
    const colorPrefixes = ['text', 'bg', 'border-color'];
    
    // 基础颜色类
    const allColors = this.getAllColorNames();
    allColors.forEach(color => {
      colorPrefixes.forEach(prefix => {
        const rule = rules[prefix];
        if (rule) {
          css += `.${prefix}-${color} { ${rule(color)} }\n`;
        }
      });
    });

    // 生成语义化Token类
    const semanticTokens = [
      'bg', 'bg-hover', 'border', 'border-hover', 
      'hover', 'base', 'active', 'text', 'text-hover', 'text-active'
    ];
    
    const semanticColors = [
      'primary', 'success', 'error', 'warning', 'info', 'link',
      'red', 'blue', 'pink', 'green', 'orange', 'purple', 'cyan',
      'volcano', 'gold', 'lime', 'magenta', 'geekblue'
    ];
    
    colorPrefixes.forEach(prefix => {
      semanticColors.forEach(color => {
        semanticTokens.forEach(token => {
          const rule = rules[prefix];
          if (rule) {
            css += `.${prefix}-${color}-${token} { ${rule(`${color}-${token}`)} }\n`;
          }
        });
      });
    });

    // 生成100-900色阶类
    colorPrefixes.forEach(prefix => {
      allColors.forEach(color => {
        for (let i = 1; i <= 9; i++) {
          const level = i * 100;
          const rule = rules[prefix];
          if (rule) {
            css += `.${prefix}-${color}-${level} { ${rule(`${color}-${level}`)} }\n`;
          }
        }
      });
    });

    return css;
  }

  getAllColorNames() {
    return [
      'primary', 'success', 'error', 'warning', 'info', 'link',
      'red', 'blue', 'pink', 'green', 'orange', 'purple', 'cyan',
      'volcano', 'gold', 'lime', 'magenta', 'geekblue',
      'neutral', 'text', 'border', 'bg', 'white', 'black'
    ];
  }

  // ========================= 24宫格系统 =========================
  generate24GridSystem() {
    const { gridColumns } = this.config;
    let css = '';

    // 容器类
    css += `.container { width: 100%; margin-left: auto; margin-right: auto; padding-left: 16px; padding-right: 16px; }\n`;

    // 栅格行
    css += `.row { display: flex; flex-wrap: wrap; margin-left: -8px; margin-right: -8px; }\n`;

    // 列跨度 (1-24)
    for (let i = 1; i <= gridColumns; i++) {
      const width = (i / gridColumns) * 100;
      css += `.span-${i} { flex: 0 0 ${width}%; max-width: ${width}%; padding-left: 8px; padding-right: 8px; }\n`;
    }

    // 偏移 (1-23)
    for (let i = 1; i < gridColumns; i++) {
      const margin = (i / gridColumns) * 100;
      css += `.offset-${i} { margin-left: ${margin}%; }\n`;
    }

    return css;
  }

  generateResponsiveCSS() {
    const { breakpoints, gridColumns } = this.config;
    let css = '';

    Object.entries(breakpoints).forEach(([breakpoint, maxWidth]) => {
      if (breakpoint === 'xs') return;
      
      css += `@media (max-width: ${maxWidth}) {\n`;
      
      // 响应式显示类
      ['block', 'hidden', 'flex'].forEach(display => {
        css += `  .${breakpoint}\\:${display} { display: ${display} !important; }\n`;
      });

      // 响应式栅格列
      for (let i = 1; i <= gridColumns; i++) {
        const width = (i / gridColumns) * 100;
        css += `  .${breakpoint}\\:span-${i} { flex: 0 0 ${width}%; max-width: ${width}%; }\n`;
      }

      css += '}\n\n';
    });

    return css;
  }

  // ========================= 公共方法 =========================
  inject() {
    if (this.isInjected || typeof document === 'undefined') return false;
    
    try {
      const style = document.createElement('style');
      style.id = 'css-installer-styles';
      style.textContent = this.generateBaseCSS();
      document.head.appendChild(style);
      
      this.isInjected = true;
      console.log('✅ CSS注入成功');
      return true;
    } catch (error) {
      console.error('❌ CSS注入失败:', error);
      return false;
    }
  }

  addRule(selector, styles) {
    const rule = `${selector} { ${styles} }`;
    this.cssRules.set(selector, rule);
    this.updateDynamicStyles();
  }

  updateDynamicStyles() {
    if (!this.isInjected) return;
    
    const style = document.getElementById('css-installer-styles');
    if (style) {
      const dynamicCSS = Array.from(this.cssRules.values()).join('\n');
      style.textContent = this.generateBaseCSS() + '\n' + dynamicCSS;
    }
  }
}

// ========================= 测试函数 =========================
// 测试TDesign风格的颜色生成
function testTDesignColorGeneration() {
  const blueScale = CSSInstaller.generateColorScale('#1677ff');
  console.log('TDesign风格蓝色系:', blueScale);
  /* 预期输出：
  {
    bg: '#e6f4ff',
    'bg-hover': '#e6f4ff',
    border: '#91caff',
    'border-hover': '#69b1ff',
    hover: '#4096ff',
    base: '#1677ff',
    active: '#0958d9',
    text: '#1677ff',
    'text-hover': '#4096ff',
    'text-active': '#0958d9'
  }
  */

  const blueScale100900 = CSSInstaller.generateColorScale100900('#1677ff');
  console.log('蓝色100-900色阶:', blueScale100900);
}

// ========================= 使用示例 =========================
// const css = new CSSInstaller({
//   unit: 4,
//   theme: 'light',
//   colors: {
//     primary: '#1677ff', // 使用您指定的主色
//     red: '#e34d59',
//     blue: '#0052d9',
//     green: '#00a870'
//   }
// });

// css.inject();

// // 测试颜色生成
// testTDesignColorGeneration();

// // 添加TDesign风格样式
// css.addRule('.btn-primary', `
//   background: var(--primary-base);
//   color: white;
//   border: 1px solid var(--primary-border);
//   padding: 8px 16px;
//   border-radius: 6px;
//   transition: all 0.3s;
// `);

// css.addRule('.btn-primary:hover', `
//   background: var(--primary-hover);
//   border-color: var(--primary-border-hover);
// `);

// css.addRule('.btn-primary:active', `
//   background: var(--primary-active);
// `);

// css.addRule('.card-primary', `
//   background: var(--primary-bg);
//   border: 1px solid var(--primary-border);
//   border-radius: 8px;
//   padding: 16px;
// `);

// css.addRule('.text-primary', `
//   color: var(--primary-text);
// `);

// css.addRule('.text-primary:hover', `
//   color: var(--primary-text-hover);
// `);

// // ========================= 快捷函数 =========================
const installCSS = (config = {}) => {
  const installer = new CSSInstaller(config);
  installer.inject();
  return installer;
};

const switchTheme = (theme, customColors = {}) => {
  const installer = new CSSInstaller();
  installer.switchTheme(theme, customColors);
  return installer;
};

export default CSSInstaller;
export { installCSS, switchTheme };