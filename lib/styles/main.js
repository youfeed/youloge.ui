// css-installer.js
let isInjected = false; // 防止重复插入样式

// ========================= 默认配置（可完全自定义）=========================
const DEFAULT_CONFIG = {
  unit: 4, // 1单位 = 4px（基础间距单位）
  // 预设类名参数范围（覆盖99%场景，减少冗余）
  ranges: {
    spacing: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // m-*/p-* 类参数范围
    size: [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64], // w-*/h-* 类参数范围
    gap: [0, 1, 2, 3, 4, 5] // gap-* 类参数范围
  },
  // 预设颜色（贴合常用设计规范，支持用户扩展）
  colors: {
    'gray-100': '#f9fafb',
    'gray-200': '#e5e7eb',
    'gray-300': '#d1d5db',
    'gray-400': '#9ca3af',
    'gray-500': '#6b7280',
    'gray-700': '#374151',
    'gray-800': '#1f2937',
    'gray-900': '#111827',
    'blue-500': '#0969da',
    'blue-600': '#075985',
    'red-500': '#cf222e',
    'green-500': '#10b981',
    'white': '#ffffff',
    'black': '#000000',
    'transparent': 'transparent'
  },
  // 类名规则映射（key=类名前缀，value=样式生成逻辑）
  rules: {
    // 1. 间距类（margin）
    'm': (val) => `margin: ${val}px;`,
    'mx': (val) => `margin-left: ${val}px; margin-right: ${val}px;`,
    'my': (val) => `margin-top: ${val}px; margin-bottom: ${val}px;`,
    'mt': (val) => `margin-top: ${val}px;`,
    'mr': (val) => `margin-right: ${val}px;`,
    'mb': (val) => `margin-bottom: ${val}px;`,
    'ml': (val) => `margin-left: ${val}px;`,

    // 2. 内边距类（padding）
    'p': (val) => `padding: ${val}px;`,
    'px': (val) => `padding-left: ${val}px; padding-right: ${val}px;`,
    'py': (val) => `padding-top: ${val}px; padding-bottom: ${val}px;`,
    'pt': (val) => `padding-top: ${val}px;`,
    'pr': (val) => `padding-right: ${val}px;`,
    'pb': (val) => `padding-bottom: ${val}px;`,
    'pl': (val) => `padding-left: ${val}px;`,

    // 3. 尺寸类（width/height）
    'w': (val) => `width: ${val}px;`,
    'h': (val) => `height: ${val}px;`,
    'min-w': (val) => `min-width: ${val}px;`,
    'max-w': (val) => `max-width: ${val}px;`,
    'min-h': (val) => `min-height: ${val}px;`,
    'max-h': (val) => `max-height: ${val}px;`,

    // 4. Flex 布局类
    'flex': () => 'display: flex;',
    'flex-col': () => 'display: flex; flex-direction: column;',
    'flex-row': () => 'display: flex; flex-direction: row;',
    'justify-start': () => 'justify-content: flex-start;',
    'justify-center': () => 'justify-content: center;',
    'justify-end': () => 'justify-content: flex-end;',
    'justify-between': () => 'justify-content: space-between;',
    'justify-around': () => 'justify-content: space-around;',
    'items-start': () => 'align-items: flex-start;',
    'items-center': () => 'align-items: center;',
    'items-end': () => 'align-items: flex-end;',
    'items-baseline': () => 'align-items: baseline;',
    'flex-shrink-0': () => 'flex-shrink: 0;',
    'gap': (val) => `gap: ${val}px;`,

    // 5. 边框类
    'border': () => `border: 1px solid #e5e7eb;`,
    'border-t': () => `border-top: 1px solid #e5e7eb;`,
    'border-r': () => `border-right: 1px solid #e5e7eb;`,
    'border-b': () => `border-bottom: 1px solid #e5e7eb;`,
    'border-l': () => `border-left: 1px solid #e5e7eb;`,

    // 6. 圆角类
    'rounded-sm': () => 'border-radius: 2px;',
    'rounded-md': () => 'border-radius: 4px;',
    'rounded-lg': () => 'border-radius: 8px;',
    'rounded-full': () => 'border-radius: 9999px;',

    // 7. 颜色类（text/bg/border-color）
    'text': (color) => `color: ${color};`,
    'bg': (color) => `background-color: ${color};`,
    'border-color': (color) => `border-color: ${color};`,

    // 8. 其他高频类
    'shadow': () => 'box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);',
    'shadow-md': () => 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);',
    'overflow-hidden': () => 'overflow: hidden;',
    'overflow-auto': () => 'overflow: auto;',
    'cursor-pointer': () => 'cursor: pointer;',
    'opacity-50': () => 'opacity: 0.5;',
    'opacity-75': () => 'opacity: 0.75;',
    'disabled': () => 'opacity: 0.5; cursor: not-allowed; pointer-events: none;',
    'text-ellipsis': () => 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'
  }
};

// ========================= 核心工具函数 =========================
/**
 * 合并用户配置与默认配置
 * @param {Object} userConfig - 用户自定义配置
 * @returns {Object} 合并后的配置
 */
function mergeConfig(userConfig = {}) {
  return {
    unit: userConfig.unit || DEFAULT_CONFIG.unit,
    ranges: { ...DEFAULT_CONFIG.ranges, ...(userConfig.ranges || {}) },
    colors: { ...DEFAULT_CONFIG.colors, ...(userConfig.colors || {}) },
    rules: { ...DEFAULT_CONFIG.rules, ...(userConfig.rules || {}) }
  };
}

/**
 * 生成完整的 CSS 样式文本
 * @param {Object} config - 合并后的配置
 * @returns {string} CSS 文本
 */
function generateCss(config) {
  const { unit, ranges, colors, rules } = config;
  let css = '';

  // 1. 生成带参数的类名（如 m-1、w-8、gap-2）
  // 间距类（m-*/p-*）
  const spacingPrefixes = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'];
  spacingPrefixes.forEach(prefix => {
    ranges.spacing.forEach(num => {
      const val = num * unit;
      const className = `${prefix}-${num}`;
      const style = rules[prefix]?.(val);
      if (style) css += `.${className} { ${style} }\n`;
    });
  });

  // 尺寸类（w-*/h-*）
  const sizePrefixes = ['w', 'h', 'min-w', 'max-w', 'min-h', 'max-h'];
  sizePrefixes.forEach(prefix => {
    ranges.size.forEach(num => {
      const val = num * unit;
      const className = `${prefix}-${num}`;
      const style = rules[prefix]?.(val);
      if (style) css += `.${className} { ${style} }\n`;
    });
  });

  // Gap 类
  ranges.gap.forEach(num => {
    const val = num * unit;
    const className = `gap-${num}`;
    const style = rules.gap?.(val);
    if (style) css += `.${className} { ${style} }\n`;
  });

  // 2. 生成颜色相关类名（text-*/bg-*/border-color-*）
  const colorPrefixes = ['text', 'bg', 'border-color'];
  colorPrefixes.forEach(prefix => {
    Object.entries(colors).forEach(([colorName, colorValue]) => {
      const className = `${prefix}-${colorName}`;
      const style = rules[prefix]?.(colorValue);
      if (style) css += `.${className} { ${style} }\n`;
    });
  });

  // 3. 生成边框颜色变体（如 border-gray-200、border-t-blue-500）
  Object.entries(colors).forEach(([colorName, colorValue]) => {
    // 全边框颜色
    css += `.border-${colorName} { border-color: ${colorValue}; }\n`;
    // 单边框颜色（t/r/b/l）
    ['t', 'r', 'b', 'l'].forEach(dir => {
      css += `.border-${dir}-${colorName} { border-${dir}-color: ${colorValue}; }\n`;
    });
  });

  // 4. 生成无参数的类名（如 flex、rounded-md、shadow）
  Object.entries(rules).forEach(([className, styleFn]) => {
    // 跳过已处理的带参数前缀，避免重复
    if (spacingPrefixes.includes(className) || sizePrefixes.includes(className) || colorPrefixes.includes(className) || className === 'gap') return;
    const style = styleFn?.();
    if (style) css += `.${className} { ${style} }\n`;
  });

  return css;
}

/**
 * 将 CSS 插入到页面 head 中的 style 标签
 * @param {string} css - 要插入的 CSS 文本
 */
function injectCss(css) {
  if (!css || isInjected || typeof window === 'undefined') return;

  // 创建 style 标签
  const styleTag = document.createElement('style');
  styleTag.id = 'css-utils-styles';
  styleTag.setAttribute('type', 'text/css');
  styleTag.textContent = css;

  // 插入到 head 末尾
  document.head.appendChild(styleTag);

  isInjected = true;
  console.log('CSS 工具样式已成功注入页面');
}

/**
 * 样式注入入口函数（用户调用此函数即可）
 * @param {Object} userConfig - 用户自定义配置（可选）
 * @example
 * installCss({ unit: 8, colors: { 'primary': '#1890ff' } })
 */
export function installCss(userConfig = {}) {
  // 合并配置
  const config = mergeConfig(userConfig);
  // 生成 CSS
  const css = generateCss(config);
  // 插入页面
  injectCss(css);
}

// 导出重置函数（可选，用于开发环境）
export function uninstallCss() {
  if (typeof window === 'undefined') return;
  const styleTag = document.getElementById('css-utils-styles');
  if (styleTag) {
    document.head.removeChild(styleTag);
    isInjected = false;
    console.log('CSS 工具样式已移除');
  }
}