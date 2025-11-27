# Youloge.ui 组件样式管理指南

## 设计原则

本组件库使用 Tailwind CSS v4 进行样式管理，遵循以下设计原则：

1. **使用原生 Tailwind 4 颜色系统**：直接使用 Tailwind 4 内置的颜色系统和设计规范
2. **组件内嵌样式**：组件样式直接写在 Vue 文件的 `class` 属性中，使用 Tailwind 类名
3. **通过插件添加快捷方式**：在 `tailwind.config.js` 中通过插件定义布局和常用快捷方式
4. **优先使用原生 Tailwind 类**：充分利用 Tailwind CSS 提供的预设类
5. **使用语义化快捷方式**：只定义最常用的布局和交互快捷方式

## 组件样式实现方式

### 1. 使用原生 Tailwind 类

```vue
<template>
  <!-- 按钮组件示例 -->
  <button 
    class="
      inline-flex items-center justify-center
      border border-solid
      cursor-pointer font-medium
      transition-all duration-200
      px-4 py-2 rounded-md
      hover:bg-primary-50
      focus:outline-none focus:ring-2 focus:ring-primary-300
    "
  >
    <slot />
  </button>
</template>
```

### 2. 根据 props 动态添加类

```vue
<template>
  <button
    :class="[
      // 基础样式
      'inline-flex items-center justify-center border cursor-pointer font-medium transition-all',
      
      // 尺寸变体
      sizeClasses[size],
      
      // 类型变体
      typeClasses[type],
      
      // 状态样式
      {
        'opacity-50 cursor-not-allowed': disabled,
        'bg-transparent text-text-primary border-neutral-300': variant === 'outline',
      }
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  size: { type: String, default: 'md' },
  type: { type: String, default: 'primary' },
  variant: { type: String, default: 'solid' },
  disabled: { type: Boolean, default: false }
})

// 尺寸映射
const sizeClasses = {
  sm: 'px-3 py-1 text-sm min-h-8',
  md: 'px-4 py-2 text-base min-h-10',
  lg: 'px-6 py-3 text-lg min-h-12',
}

// 类型映射
const typeClasses = {
  primary: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700',
  success: 'bg-success-600 text-white border-success-600 hover:bg-success-700',
  warning: 'bg-warning-500 text-white border-warning-500 hover:bg-warning-600',
  error: 'bg-error-600 text-white border-error-600 hover:bg-error-700',
  ghost: 'bg-transparent text-text-primary border-transparent hover:bg-neutral-100'
}
</script>
```

### 3. 使用组合式函数

对于复杂组件，可以创建 composables 来管理样式：

```js
// lib/composables/useButtonStyles.js
import { computed } from 'vue'

export function useButtonStyles(props) {
  const baseClasses = 'inline-flex items-center justify-center border cursor-pointer font-medium transition-all duration-200'
  
  const sizeClasses = computed(() => ({
    sm: 'px-3 py-1 text-sm min-h-8 gap-1',
    md: 'px-4 py-2 text-base min-h-10 gap-2',
    lg: 'px-6 py-3 text-lg min-h-12 gap-3',
  }[props.size] || props.size || sizeClasses.md))
  
  const typeClasses = computed(() => ({
    primary: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700',
    secondary: 'bg-neutral-100 text-text-primary border-neutral-300 hover:bg-neutral-200',
    danger: 'bg-error-600 text-white border-error-600 hover:bg-error-700',
  }[props.type] || props.type || typeClasses.primary))
  
  const classes = computed(() => [
    baseClasses,
    sizeClasses.value,
    typeClasses.value,
    {
      'opacity-50 cursor-not-allowed pointer-events-none': props.disabled,
      'w-full': props.block,
    }
  ])
  
  return {
    classes,
  }
}
```

然后在组件中使用：

```vue
<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>

<script setup>
import { useButtonStyles } from '@/composables/useButtonStyles'

const props = defineProps({
  size: String,
  type: String,
  disabled: Boolean,
  block: Boolean
})

const { classes: buttonClasses } = useButtonStyles(props)
</script>
```

## 颜色系统使用指南

本组件库直接使用 Tailwind 4 原生的颜色系统，无需额外配置。

### 使用 Tailwind 4 原生颜色

```vue
<template>
  <!-- Tailwind 4 原生颜色系统 -->
  <div class="bg-blue-600 text-white">主要操作按钮</div>
  <div class="bg-blue-100 text-blue-800">次要背景</div>
  
  <!-- 功能色 -->
  <div class="bg-green-500 text-white">成功提示</div>
  <div class="bg-amber-500 text-white">警告提示</div>
  <div class="bg-red-500 text-white">错误提示</div>
  <div class="bg-cyan-500 text-white">信息提示</div>
  
  <!-- 中性色 -->
  <div class="bg-slate-50 border border-slate-200">卡片背景</div>
  <div class="text-slate-900">主要文本</div>
  <div class="text-slate-600">次要文本</div>
</template>
```

### 颜色类名格式

Tailwind 4 使用标准的颜色类名格式：
- `bg-{color}-{shade}` - 背景色
- `text-{color}-{shade}` - 文本色
- `border-{color}-{shade}` - 边框色
- `ring-{color}-{shade}` - 焦点环色

支持的颜色：slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose

支持的颜色深度：50, 100, 200, ..., 900, 950

### 响应式颜色

```vue
<template>
  <!-- 根据主题自动适配 -->
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    响应主题的内容区域
  </div>
  
  <!-- 使用 opacity 变体调整颜色深度 -->
  <div class="bg-blue-500 bg-opacity-10">浅蓝色背景</div>
</template>
```

### 暗黑模式支持

使用 UnoCSS 的 dark mode 类：

```vue
<template>
  <div class="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
    内容区域
  </div>
</template>
```

## 响应式设计

使用 Tailwind 的响应式前缀：

```vue
<template>
  <!-- 在小屏幕上隐藏，中等屏幕显示 -->
  <div class="hidden md:block">桌面端内容</div>
  
  <!-- 不同屏幕尺寸的不同布局 -->
  <div class="flex-col md:flex-row">
    <!-- 内容 -->
  </div>
</template>
```

## 常见组件样式示例

### 消息组件

```vue
<template>
  <div 
    :class="[
      'relative w-fit max-w-96 rounded-md border p-2 text-sm transition-all shadow-sm',
      typeClasses[props.type],
      sizeClasses[props.size]
    ]"
  >
    <div class="absolute left-0 top-1 bottom-1 w-1 rounded-sm" :class="indicatorClasses[props.type]"></div>
    <div class="pl-2 pr-6" :class="textClasses[props.type]">
      <slot>{{ content }}</slot>
    </div>
    <button 
      v-if="closable"
      class="absolute right-2 top-1 flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
      @click="handleClose"
    >
      ×
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'info' },
  size: { type: String, default: 'md' },
  closable: { type: Boolean, default: false },
  content: String
})

const typeClasses = {
  success: 'border-success-200 bg-success-50',
  warning: 'border-warning-200 bg-warning-50',
  error: 'border-error-200 bg-error-50',
  info: 'border-info-200 bg-info-50',
}

const indicatorClasses = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
}

const textClasses = {
  success: 'text-success-700',
  warning: 'text-warning-700',
  error: 'text-error-700',
  info: 'text-info-700',
}

const sizeClasses = {
  sm: 'p-1 text-xs',
  md: 'p-2 text-sm',
  lg: 'p-3 text-base',
}
</script>
```

### 卡片组件

```vue
<template>
  <div class="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
    <div v-if="$slots.header" class="border-b border-neutral-200 p-4 pb-3">
      <slot name="header"></slot>
    </div>
    <div class="p-4">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="border-t border-neutral-200 p-4 pt-3">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

## 自定义快捷方式

在 `uno.config.js` 中只保留最通用的快捷方式，组件特定的样式应该直接写在组件中。

### 推荐添加到 `uno.config.js` 的快捷方式

```js
shortcuts: {
  // 布局
  'y-flex-center': 'flex items-center justify-center',
  'y-flex-between': 'flex items-center justify-between',
  'y-flex-col': 'flex flex-col',
  
  // 文本
  'y-text-primary': 'text-text-primary',
  'y-text-secondary': 'text-text-secondary',
  
  // 间距
  'y-p-sm': 'p-2',
  'y-p-md': 'p-4',
  'y-p-lg': 'p-6',
  
  // 边框
  'y-border': 'border border-neutral-200',
}
```

## 组件迁移指南

如果你有一个使用旧样式规则的组件，需要迁移到 Tailwind 类：

1. 识别现有 CSS 规则
2. 找到对应的 Tailwind 类
3. 使用动态类绑定处理不同变体
4. 将样式直接应用到组件模板中

### 示例迁移

旧代码（使用 UnoCSS 自定义规则）：
```vue
<template>
  <button class="y-button y-button-md y-btn-primary">按钮</button>
</template>
```

新代码（使用 Tailwind 4 原生类）：
```vue
<template>
  <button class="inline-flex items-center justify-center px-4 py-2 font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700">
    按钮
  </button>
</template>
```

或使用动态类绑定：
```vue
<template>
  <button :class="buttonClasses">按钮</button>
</template>

<script setup>
const buttonClasses = 'inline-flex items-center justify-center px-4 py-2 font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700'
</script>
```

## 最佳实践

1. **保持一致性**：在整个组件库中使用相同的命名约定和结构
2. **使用语义化类名**：优先选择有语义的 Tailwind 类，而不是任意的数值
3. **组件封装**：将组件相关的样式逻辑封装在组件内部
4. **避免过度定制**：只在必要时创建自定义样式
5. **性能考虑**：避免过度使用动态类绑定，特别是条件过于复杂的场景

## 布局快捷方式

UnoCSS 配置中已添加以下布局快捷方式，方便组件排版：

### 容器
```vue
<template>
  <!-- 响应式容器 -->
  <div class="container-sm">小容器（移动端）</div>
  <div class="container-md">中等容器（平板/桌面）</div>
  <div class="container-lg">大容器（宽屏）</div>
  <div class="container-full">全屏容器</div>
</template>
```

### 弹性布局
```vue
<template>
  <!-- 居中布局 -->
  <div class="flex-center">水平+垂直居中</div>
  <div class="flex-col-center">纵向居中</div>
  
  <!-- 分布布局 -->
  <div class="flex-between">两端对齐</div>
  <div class="flex-around">均匀分布</div>
  <div class="flex-stretch">子元素高度拉伸</div>
</template>
```

### 网格布局
```vue
<template>
  <!-- 固定列数网格 -->
  <div class="grid-2">2列网格</div>
  <div class="grid-3">3列网格</div>
  <div class="grid-4">4列网格</div>
  
  <!-- 响应式网格 -->
  <div class="grid-responsive">1列移动端，2列平板，4列桌面</div>
</template>
```

### 定位快捷
```vue
<template>
  <!-- 绝对定位 -->
  <div class="relative">
    <div class="absolute-full">占满父元素</div>
    <div class="absolute-center">居中定位</div>
  </div>
  
  <!-- 固定定位 -->
  <div class="fixed-top">固定顶部</div>
  <div class="fixed-bottom">固定底部</div>
</template>
```

## 参考

- [Tailwind CSS v4 文档](https://tailwindcss.com/)
- [Tailwind CSS 插件开发指南](https://tailwindcss.com/docs/plugins)
- [Vite 集成 Tailwind CSS](https://tailwindcss.com/docs/guides/vite)