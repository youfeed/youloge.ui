# y-Button 组件使用示例

## 基础用法

```vue
<template>
  <div class="space-y-4">
    <!-- 默认按钮 -->
    <y-button>默认按钮</y-button>
    
    <!-- 主要按钮 -->
    <y-button type="primary">主要按钮</y-button>
    
    <!-- 成功按钮 -->
    <y-button type="success">成功按钮</y-button>
    
    <!-- 危险按钮 -->
    <y-button type="danger">危险按钮</y-button>
    
    <!-- 警告按钮 -->
    <y-button type="warning">警告按钮</y-button>
    
    <!-- 信息按钮 -->
    <y-button type="info">信息按钮</y-button>
  </div>
</template>
```

## 按钮尺寸

```vue
<template>
  <div class="space-x-4">
    <!-- 小按钮 -->
    <y-button size="sm">小按钮</y-button>
    
    <!-- 中等按钮 -->
    <y-button>默认按钮</y-button>
    
    <!-- 大按钮 -->
    <y-button size="lg">大按钮</y-button>
  </div>
</template>
```

## 按钮状态

```vue
<template>
  <div class="space-x-4">
    <!-- 禁用状态 -->
    <y-button disabled>禁用按钮</y-button>
    
    <!-- 加载状态 -->
    <y-button :loading="true">加载中</y-button>
    
    <!-- 块级按钮 -->
    <y-button block>块级按钮</y-button>
  </div>
</template>
```

## 按钮样式

```vue
<template>
  <div class="space-x-4">
    <!-- 轮廓按钮 -->
    <y-button type="outline">轮廓按钮</y-button>
    
    <!-- 幽灵按钮 -->
    <y-button type="ghost">幽灵按钮</y-button>
    
    <!-- 链接按钮 -->
    <y-button type="link">链接按钮</y-button>
  </div>
</template>
```

## 圆角设置

```vue
<template>
  <div class="space-x-4">
    <!-- 无圆角 -->
    <y-button rounded="none">无圆角</y-button>
    
    <!-- 小圆角 -->
    <y-button rounded="sm">小圆角</y-button>
    
    <!-- 默认圆角 -->
    <y-button>默认圆角</y-button>
    
    <!-- 大圆角 -->
    <y-button rounded="lg">大圆角</y-button>
    
    <!-- 全圆角 -->
    <y-button rounded="full">全圆角</y-button>
  </div>
</template>
```

## 带图标的按钮

```vue
<template>
  <div class="space-x-4">
    <!-- 左侧图标 -->
    <y-button>
      <template #icon>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </template>
      确认
    </y-button>
    
    <!-- 仅图标 -->
    <y-button>
      <template #icon>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      </template>
    </y-button>
  </div>
</template>
```

## 事件处理

```vue
<template>
  <div class="space-x-4">
    <y-button @click="handleClick">点击事件</y-button>
    <y-button @click="handleAsyncAction" :loading="loading">
      {{ loading ? '处理中...' : '异步操作' }}
    </y-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const handleClick = () => {
  alert('按钮被点击了！')
}

const handleAsyncAction = async () => {
  loading.value = true
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('异步操作完成！')
  } finally {
    loading.value = false
  }
}
</script>
```

## 与布局快捷方式结合使用

```vue
<template>
  <!-- 使用 flex-center 居中按钮组 -->
  <div class="flex-center min-h-64 bg-gray-50 rounded-lg p-8">
    <div class="space-x-4">
      <y-button type="primary">主要操作</y-button>
      <y-button type="outline">取消</y-button>
    </div>
  </div>
</template>
```

## 优化说明

优化后的 `y-button` 组件使用了以下 UnoCSS 配置：

1. **基础样式**：使用了 `btn` 快捷方式，包含所有按钮的基础样式
2. **类型样式**：使用 Tailwind 4 原生颜色系统，如 `bg-blue-600`、`text-white` 等
3. **尺寸样式**：直接使用 Tailwind 原生尺寸类，如 `px-4 py-1.5 text-sm`
4. **交互反馈**：使用 `btn-press` 快捷方式提供按下效果
5. **禁用状态**：使用 `disabled` 快捷方式处理禁用状态

这种实现方式：
- 代码更简洁
- 更充分利用了 UnoCSS 的预设功能
- 更容易维护和扩展
- 更符合 Tailwind 4 的设计理念