<template>
  <!-- 布局容器：直接包裹 y-header/y-aside/y-main/y-footer -->
  <div 
    class="y-layout"
    :style="layoutStyle"
    :data-direction="direction"
    :data-fixed-header="fixedHeader"
    :data-fixed-sidebar="fixedSidebar"
  >
    <slot /> <!-- 直接包裹子组件，无需插槽命名 -->
  </div>
</template>

<script setup>
import { defineProps, computed, onMounted, ref } from 'vue'

defineOptions({ name: 'y-layout' })

const props = defineProps({
  direction: {
    type: String,
    default: 'vertical',
    validator: val => ['vertical', 'horizontal'].includes(val)
  },
  sidebarPosition: {
    type: String,
    default: 'left',
    validator: val => ['left', 'right'].includes(val)
  },
  sidebarWidth: {
    type: [String, Number],
    default: 240,
    validator: val => typeof val === 'number' ? (val >= 160 && val <= 400) : /^\d+(px|rem|em)$/.test(val)
  },
  padding: {
    type: [String, Number],
    default: 0,
    validator: val => typeof val === 'number' ? (val >= 0 && val <= 40) : /^\d+(px|rem|em)$/.test(val)
  },
  contentMaxWidth: {
    type: [String, Number],
    default: 1280,
    validator: val => typeof val === 'number' ? (val >= 800 && val <= 1600) : /^\d+(px|rem|em)$/.test(val)
  },
  bgColor: {
    type: String,
    default: 'var(--y-neutral-50)'
  },
  fixedHeader: {
    type: Boolean,
    default: false
  },
  fixedSidebar: {
    type: Boolean,
    default: false
  }
})

// 处理带单位属性（Vue 原生写法，避免解析错误）
const formatUnit = (val) => typeof val === 'number' ? `${val}px` : val

// 布局基础样式
const layoutStyle = computed(() => ({
  padding: formatUnit(props.padding),
  backgroundColor: props.bgColor,
  minHeight: '100vh',
  boxSizing: 'border-box'
}))

// 暴露 CSS 变量（传递侧边栏宽度、内容区最大宽度，无需 inject）
onMounted(() => {
  const root = document.querySelector('.y-layout')
  if (root) {
    root.style.setProperty('--y-sidebar-width', formatUnit(props.sidebarWidth))
    root.style.setProperty('--y-content-max-width', formatUnit(props.contentMaxWidth))
  }
})
</script>

<style lang="less" scoped>
// 依赖全局注入的 Less 变量，精简 CSS 变量定义
:root {
  --y-neutral-50: @neutral-50;
  --y-neutral-100: @neutral-100;
  --y-border-color: @border-color;
  --y-text-secondary: @text-secondary;
  --y-spacing-3: @spacing-3;
  --y-spacing-4: @spacing-4;
  --y-font-size-xs: @font-size-xs;
  --y-header-height: 56px;
  --y-footer-height: 48px;
  // 动态 CSS 变量（由 JS 注入）
  --y-sidebar-width: 240px;
  --y-content-max-width: 1280px;
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  :root {
    --y-neutral-50: @neutral-900;
    --y-neutral-100: @neutral-800;
    --y-border-color: @neutral-700;
    --y-text-secondary: @neutral-400;
  }
}

// 布局核心样式
.y-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;

  // 子组件统一样式：直接子组件仅 y-header/y-aside/y-main/y-footer
  > y-header,
  > y-aside,
  > y-main,
  > y-footer {
    box-sizing: border-box;
    width: 100%;
  }

  // 1. 顶部栏（y-header）- GitHub 风格
  > y-header {
    display: flex;
    align-items: center;
    height: var(--y-header-height);
    background-color: var(--y-neutral-100);
    border-bottom: 1px solid var(--y-border-color);
    padding: 0 var(--y-spacing-3);
    z-index: 10;

    // 固定顶部栏
    &.y-layout[data-fixed-header="true"] > & {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
    }
  }

  // 2. 水平布局（aside + main 横向排列）
  &[data-direction="horizontal"] {
    > y-aside {
      width: var(--y-sidebar-width) !important;
      background-color: var(--y-neutral-100);
      border-right: 1px solid var(--y-border-color);
      padding: var(--y-spacing-3);
      overflow-y: auto;
      flex-shrink: 0;
      height: calc(100vh - var(--y-header-height));

      // 侧边栏在右侧
      &.y-layout[data-sidebar-position="right"] > & {
        border-right: none;
        border-left: 1px solid var(--y-border-color);
        order: 1;
      }

      // 固定侧边栏
      &.y-layout[data-fixed-sidebar="true"] > & {
        position: sticky;
        top: var(--y-header-height);
        height: calc(100vh - var(--y-header-height));
      }
    }

    > y-main {
      flex: 1;
      overflow-y: auto;
      padding: var(--y-spacing-4);
      background-color: inherit;

      // 内容区最大宽度+居中
      > div {
        max-width: var(--y-content-max-width);
        width: 100%;
        margin: 0 auto;
      }
    }

    // 水平布局时，aside 和 main 横向排列
    > :is(y-aside, y-main) {
      display: inline-flex;
    }
  }

  // 3. 垂直布局（main 占满剩余高度）
  &[data-direction="vertical"] {
    > y-main {
      flex: 1;
      overflow-y: auto;
      padding: var(--y-spacing-4) var(--y-spacing-3);
      background-color: inherit;

      // 内容区最大宽度+居中
      > div {
        max-width: var(--y-content-max-width);
        width: 100%;
        margin: 0 auto;
      }
    }
  }

  // 4. 底部栏（y-footer）- GitHub 风格
  > y-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--y-footer-height);
    background-color: var(--y-neutral-100);
    border-top: 1px solid var(--y-border-color);
    padding: 0 var(--y-spacing-3);
    color: var(--y-text-secondary);
    font-size: var(--y-font-size-xs);
  }

  // 无顶部栏时，调整侧边栏高度
  &:not(:has(> y-header)) > y-aside {
    height: 100vh !important;
    top: 0 !important;
  }
}

// 响应式适配：小屏（≤767px）自动切换垂直布局
@media (max-width: @md-max) {
  .y-layout[data-direction="horizontal"] {
    > :is(y-aside, y-main) {
      display: flex;
      flex-direction: column;
    }

    > y-aside {
      width: 100% !important;
      height: auto !important;
      border-right: none !important;
      border-left: none !important;
      border-bottom: 1px solid var(--y-border-color);
      position: static !important;
      order: 0;
    }

    > y-main {
      padding: var(--y-spacing-3) !important;
    }
  }
}
</style>