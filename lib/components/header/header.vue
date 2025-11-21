<template>
  <header 
    class="y-header"
    :style="headerStyle"
    :class="{ 'y-header--shadow': showShadow, 'y-header--fixed': fixed }"
  >
    <div class="y-header__container" :style="containerStyle">
      <slot></slot> <!-- 头部内容（Logo、导航、操作区等） -->
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-header' })

// Props 增强：支持更多布局配置，默认值贴合 GitHub 风格
const props = defineProps({
  // 高度（支持数字/字符串，默认 56px，贴合 GitHub 导航栏高度）
  height: {
    type: [String, Number],
    default: 56,
    validator: val => typeof val === 'number' ? val >= 32 && val <= 120 : /^\d+(px|rem)$/.test(val)
  },
  // 内边距（支持简写，如 "8px 16px"，默认水平 16px、垂直 0）
  padding: {
    type: String,
    default: '0 16px',
    validator: val => {
      // 支持 "16px"、"8px 16px"、"4px 8px 12px 16px" 格式
      const reg = /^\d+(px|rem)(\s+\d+(px|rem)){0,3}$/
      return reg.test(val)
    }
  },
  // 边框颜色（直接传颜色值，默认贴合组件库浅灰风格）
  borderColor: {
    type: String,
    default: '#e5e7eb' // 与 y-input/y-select 边框色统一
  },
  // 深色模式边框颜色（自动适配）
  darkBorderColor: {
    type: String,
    default: '#374151'
  },
  // 背景色（默认透明，贴合 GitHub 导航栏）
  bgColor: {
    type: String,
    default: 'transparent'
  },
  // 深色模式背景色
  darkBgColor: {
    type: String,
    default: '#111827'
  },
  // 子元素水平对齐方式（flex 布局 justify-content）
  justify: {
    type: String,
    default: 'flex-start',
    validator: val => ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].includes(val)
  },
  // 子元素垂直对齐方式（flex 布局 align-items）
  align: {
    type: String,
    default: 'center',
    validator: val => ['flex-start', 'center', 'flex-end', 'baseline', 'stretch'].includes(val)
  },
  // 是否显示底部阴影（增强视觉层次）
  showShadow: {
    type: Boolean,
    default: false
  },
  // 是否固定在顶部
  fixed: {
    type: Boolean,
    default: false
  },
  // 固定时的 z-index（默认 100，避免被覆盖）
  zIndex: {
    type: Number,
    default: 100
  }
})

// 格式化单位（数字自动转 px，字符串直接使用）
const formatUnit = (val) => {
  if (typeof val === 'number') return `${val}px`
  return val
}

// 头部核心样式（高度、背景、边框、定位）
const headerStyle = computed(() => {
  return {
    height: formatUnit(props.height),
    minHeight: formatUnit(props.height), // 防止高度塌陷
    backgroundColor: props.bgColor,
    borderBottom: `1px solid ${props.borderColor}`,
    transition: 'all 0.2s ease', // 平滑过渡
    position: props.fixed ? 'fixed' : 'relative',
    top: props.fixed ? 0 : 'auto',
    left: props.fixed ? 0 : 'auto',
    right: props.fixed ? 0 : 'auto',
    zIndex: props.fixed ? props.zIndex : 'auto',
    // 深色模式适配
    '@media (prefers-color-scheme: dark)': {
      backgroundColor: props.darkBgColor,
      borderBottomColor: props.darkBorderColor
    }
  }
})

// 容器样式（内边距、flex 对齐）
const containerStyle = computed(() => {
  return {
    width: '100%',
    height: '100%',
    padding: props.padding,
    display: 'flex',
    justifyContent: props.justify,
    alignItems: props.align,
    boxSizing: 'border-box'
  }
})
</script>

<style lang="less" scoped>
// 头部基础样式：重置默认margin/padding
.y-header {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden; // 防止子元素溢出

  // 容器：包裹所有子内容，控制对齐和内边距
  &__container {
    // 子元素默认间距（可选：通过 gap 增强布局灵活性）
    gap: 8px;
  }

  // 阴影样式：低调不突兀，贴合 GitHub 风格
  &--shadow {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  // 固定顶部时：避免遮挡下方内容（需配合页面样式，此处提供基础适配）
  &--fixed {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // 固定时默认显示轻微阴影
  }

  // 响应式适配：小屏幕优化
  @media (max-width: 575px) {
    &__container {
      padding: @media-padding-mobile; // 小屏幕缩小内边距
      gap: 4px; // 缩小子元素间距
    }

    // 固定顶部时，小屏幕增强阴影
    &--fixed {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

// 定义响应式变量（简化小屏幕适配）
@media-padding-mobile: 0 8px;
</style>