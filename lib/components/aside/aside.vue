<template>
  <aside 
    class="y-aside"
    :style="asideStyle"
    :class="{ 
      'y-aside--fixed': fixed, 
      'y-aside--shadow': showShadow,
      'y-aside--collapsed': collapsed 
    }"
  >
    <!-- 内容容器：控制内边距、溢出滚动 -->
    <div class="y-aside__content" :style="contentStyle">
      <slot></slot> <!-- 侧边栏内容（菜单、导航等） -->
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-aside' })

// Props 增强：支持更多适配场景，默认值贴合 GitHub 风格
const props = defineProps({
  // 正常宽度（支持数字/字符串，默认 240px）
  width: {
    type: [String, Number],
    default: 240,
    validator: val => typeof val === 'number' ? val >= 64 && val <= 480 : /^\d+(px|rem)$/.test(val)
  },
  // 折叠后宽度（支持数字/字符串，默认 64px）
  collapseWidth: {
    type: [String, Number],
    default: 64,
    validator: val => typeof val === 'number' ? val >= 32 && val <= 120 : /^\d+(px|rem)$/.test(val)
  },
  // 是否折叠
  collapsed: {
    type: Boolean,
    default: false
  },
  // 是否显示右侧边框（默认显示，贴合分割逻辑）
  showBorder: {
    type: Boolean,
    default: true
  },
  // 边框颜色（默认贴合组件库浅灰风格）
  borderColor: {
    type: String,
    default: '#e5e7eb'
  },
  // 深色模式边框颜色
  darkBorderColor: {
    type: String,
    default: '#374151'
  },
  // 内边距（支持 CSS 简写，如 "8px 16px"，默认 16px）
  padding: {
    type: String,
    default: '16px',
    validator: val => {
      const reg = /^\d+(px|rem)(\s+\d+(px|rem)){0,3}$/
      return reg.test(val)
    }
  },
  // 是否固定在左侧
  fixed: {
    type: Boolean,
    default: false
  },
  // 固定时的 z-index（默认 90，低于 y-header 的 100）
  zIndex: {
    type: Number,
    default: 90
  },
  // 是否显示阴影（增强视觉层次）
  showShadow: {
    type: Boolean,
    default: false
  },
  // 与顶部导航栏联动：头部高度（固定模式下避免遮挡）
  headerHeight: {
    type: [String, Number],
    default: 0
  },
  // 背景色（默认透明，贴合 GitHub 风格）
  bgColor: {
    type: String,
    default: 'transparent'
  },
  // 深色模式背景色
  darkBgColor: {
    type: String,
    default: '#111827'
  }
})

// 格式化单位（数字自动转 px，字符串直接使用）
const formatUnit = (val) => {
  if (typeof val === 'number') return `${val}px`
  return val
}

// 侧边栏核心样式（宽度、定位、边框、背景）
const asideStyle = computed(() => {
  const style = {
    width: props.collapsed ? formatUnit(props.collapseWidth) : formatUnit(props.width),
    flexShrink: 0, // 避免被压缩
    transition: 'width 0.3s ease, border-color 0.2s ease, background-color 0.2s ease', // 平滑过渡
    backgroundColor: props.bgColor,
    boxSizing: 'border-box'
  }

  // 边框控制
  if (props.showBorder) {
    style.borderRight = `1px solid ${props.borderColor}`
  }

  // 固定模式样式
  if (props.fixed) {
    style.position = 'fixed'
    style.top = formatUnit(props.headerHeight) // 避开顶部导航栏
    style.left = 0
    style.bottom = 0
    style.zIndex = props.zIndex
    style.height = `calc(100vh - ${formatUnit(props.headerHeight)})` // 占满剩余高度
  } else {
    style.position = 'relative'
    style.height = '100%' // 跟随父容器高度
  }

  // 深色模式适配
  style['@media (prefers-color-scheme: dark)'] = {
    backgroundColor: props.darkBgColor,
    ...(props.showBorder && { borderRightColor: props.darkBorderColor })
  }

  return style
})

// 内容容器样式（内边距、溢出滚动）
const contentStyle = computed(() => {
  return {
    padding: props.padding,
    width: '100%',
    height: '100%',
    overflowY: 'auto', // 内容超出时滚动
    overflowX: 'hidden', // 禁止横向滚动
    boxSizing: 'border-box'
  }
})
</script>

<style lang="less" scoped>
// 侧边栏基础样式：重置默认margin/padding
.y-aside {
  overflow: hidden; // 确保折叠时内容不溢出

  // 内容容器：优化滚动体验
  &__content {
    // 滚动条样式（贴合 GitHub 风格，仅 WebKit 浏览器）
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
  }

  // 固定模式：增强视觉层次（可选阴影）
  &--fixed {
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
  }

  // 阴影增强：独立控制，不依赖固定模式
  &--shadow {
    box-shadow: 1px 0 4px rgba(0, 0, 0, 0.08);
  }

  // 折叠状态：优化内容显示（避免拥挤）
  &--collapsed {
    .y-aside__content {
      padding: @collapsed-padding; // 折叠时缩小内边距
    }
  }

  // 响应式适配：小屏幕优化
  @media (max-width: 575px) {
    // 小屏幕默认折叠，点击展开（需配合业务逻辑实现切换）
    &:not(&--collapsed) {
      width: 100% !important;
      z-index: 100 !important; // 展开时覆盖其他内容
    }

    // 固定模式小屏幕适配
    &--fixed {
      height: calc(100vh - @mobile-header-height) !important;
      top: @mobile-header-height !important;
    }

    .y-aside__content {
      padding: @mobile-padding;
    }
  }
}

// 定义响应式变量（统一管理）
@collapsed-padding: 8px; // 折叠时内边距
@mobile-padding: 8px 12px; // 小屏幕内边距
@mobile-header-height: 56px; // 小屏幕默认头部高度（与 y-header 默认高度一致）
</style>