<template>
  <main 
    class="y-content"
    :style="contentStyle"
    :class="{ 
      'y-content--shadow': showShadow,
      'y-content--fixed': fixed,
      'y-content--scroll': overflow !== 'hidden'
    }"
  >
    <!-- 内容容器：控制最大宽度、居中对齐 -->
    <div class="y-content__container" :style="containerStyle">
      <slot></slot> <!-- 页面核心业务内容 -->
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-content' })

// Props 设计：与 header/aside 联动，灵活适配各类布局
const props = defineProps({
  // 内边距（支持 CSS 简写，默认贴合 GitHub 内容区风格）
  padding: {
    type: String,
    default: '24px',
    validator: val => {
      const reg = /^\d+(px|rem)(\s+\d+(px|rem)){0,3}$/
      return reg.test(val)
    }
  },
  // 背景色（默认透明，贴合 GitHub 纯白/深色背景风格）
  bgColor: {
    type: String,
    default: 'transparent'
  },
  // 深色模式背景色
  darkBgColor: {
    type: String,
    default: '#111827'
  },
  // 是否显示阴影（增强内容区层次，默认不显示）
  showShadow: {
    type: Boolean,
    default: false
  },
  // 滚动控制（auto/scroll/hidden，默认自动）
  overflow: {
    type: String,
    default: 'auto',
    validator: val => ['auto', 'scroll', 'hidden', 'visible'].includes(val)
  },
  // 滚动方向（vertical/horizontal/both，默认垂直）
  scrollDirection: {
    type: String,
    default: 'vertical',
    validator: val => ['vertical', 'horizontal', 'both'].includes(val)
  },
  // 与侧边栏联动：侧边栏宽度（用于自动计算左边距）
  asideWidth: {
    type: [String, Number],
    default: 0
  },
  // 与侧边栏联动：折叠后宽度（用于切换时自适应）
  asideCollapseWidth: {
    type: [String, Number],
    default: 0
  },
  // 与侧边栏联动：是否折叠（控制左边距切换）
  asideCollapsed: {
    type: Boolean,
    default: false
  },
  // 与顶部导航联动：头部高度（固定布局时避免遮挡）
  headerHeight: {
    type: [String, Number],
    default: 0
  },
  // 最大宽度（避免大屏内容过宽，默认 1200px，贴合阅读体验）
  maxWidth: {
    type: [String, Number],
    default: 1200
  },
  // 是否固定布局（配合 header/aside 固定时使用）
  fixed: {
    type: Boolean,
    default: false
  },
  // 固定布局时的 z-index（默认 10，低于 header/aside）
  zIndex: {
    type: Number,
    default: 10
  }
})

// 格式化单位（统一处理数字/字符串）
const formatUnit = (val) => {
  if (typeof val === 'number') return `${val}px`
  return val
}

// 计算内容区核心样式（联动适配 + 基础布局）
const contentStyle = computed(() => {
  const style = {
    backgroundColor: props.bgColor,
    transition: 'all 0.3s ease', // 与 aside 折叠/展开同步过渡
    boxSizing: 'border-box',
    width: '100%'
  }

  // 固定布局样式（配合 header/aside 固定）
  if (props.fixed) {
    style.position = 'fixed'
    style.top = formatUnit(props.headerHeight) // 避开顶部导航
    style.left = props.asideCollapsed 
      ? formatUnit(props.asideCollapseWidth) 
      : formatUnit(props.asideWidth) // 避开侧边栏
    style.right = 0
    style.bottom = 0
    style.zIndex = props.zIndex
    style.height = `calc(100vh - ${formatUnit(props.headerHeight)})` // 占满剩余高度
  } else {
    // 非固定布局：自动计算左边距（避开侧边栏）
    style.marginLeft = props.asideCollapsed 
      ? formatUnit(props.asideCollapseWidth) 
      : formatUnit(props.asideWidth)
    // 非固定布局：顶部内边距（避开顶部导航，优先 padding-top）
    const headerHeight = formatUnit(props.headerHeight)
    if (headerHeight !== '0px') {
      style.paddingTop = `calc(${props.padding.split(' ')[0] || '0px'} + ${headerHeight})`
    }
  }

  // 滚动样式控制
  if (props.overflow !== 'visible') {
    if (props.scrollDirection === 'vertical') {
      style.overflowY = props.overflow
      style.overflowX = 'hidden'
    } else if (props.scrollDirection === 'horizontal') {
      style.overflowX = props.overflow
      style.overflowY = 'hidden'
    } else {
      style.overflow = props.overflow
    }
  }

  // 深色模式适配
  style['@media (prefers-color-scheme: dark)'] = {
    backgroundColor: props.darkBgColor
  }

  return style
})

// 内容容器样式（控制内边距、最大宽度、居中）
const containerStyle = computed(() => {
  return {
    padding: props.padding,
    maxWidth: formatUnit(props.maxWidth),
    margin: '0 auto', // 水平居中
    height: '100%',
    boxSizing: 'border-box'
  }
})
</script>

<style lang="less" scoped>
// 内容区基础样式：重置默认margin/padding
.y-content {
  overflow: hidden; // 配合滚动控制，避免溢出

  // 内容容器：优化内容排版
  &__container {
    // 内容区默认文本样式（贴合 GitHub 阅读体验）
    color: #1f2937;
    font-size: 14px;
    line-height: 1.6;

    // 深色模式文本样式
    @media (prefers-color-scheme: dark) {
      color: #f3f4f6;
    }
  }

  // 阴影样式：低调不突兀（与 aside/header 阴影风格一致）
  &--shadow {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
  }

  // 滚动模式：优化滚动条样式（与 y-aside 统一）
  &--scroll {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    // 深色模式滚动条
    @media (prefers-color-scheme: dark) {
      &::-webkit-scrollbar-thumb {
        background: #4b5563;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
    }
  }

  // 响应式适配：小屏幕优化
  @media (max-width: 575px) {
    &__container {
      padding: @mobile-padding; // 缩小内边距
      max-width: calc(100% - 16px); // 留出左右边距
    }

    // 小屏幕固定布局：取消左边距（aside 折叠/隐藏）
    &--fixed {
      left: 0 !important;
      margin-left: 0 !important;
    }
  }
}

// 响应式变量（与 header/aside 统一）
@mobile-padding: 16px;
</style>