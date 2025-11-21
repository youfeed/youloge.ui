<template>
  <div 
    class="y-row"
    :style="rowStyle"
    :data-justify="justify"
    :data-align="align"
    :data-wrap="wrap"
  >
    <slot /> <!-- 直接包裹 y-col 子组件 -->
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

defineOptions({ name: 'y-row' })

const props = defineProps({
  // 列间距（支持数字/带单位字符串，默认 @spacing-2=16px，贴合 GitHub 紧凑风格）
  gutter: {
    type: [String, Number],
    default: 16,
    validator: val => typeof val === 'number' ? (val >= 0 && val <= 48) : /^\d+(px|rem|em)$/.test(val)
  },
  // 水平对齐方式（flex 布局属性）
  justify: {
    type: String,
    default: 'flex-start',
    validator: val => ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].includes(val)
  },
  // 垂直对齐方式（flex 布局属性）
  align: {
    type: String,
    default: 'stretch',
    validator: val => ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'].includes(val)
  },
  // 是否换行（默认换行，避免溢出）
  wrap: {
    type: Boolean,
    default: true
  }
})

// 处理带单位属性（Vue 原生写法，统一单位格式）
const formatUnit = (val) => typeof val === 'number' ? `${val}px` : val

// 行样式：主要处理间距（gutter）
const rowStyle = computed(() => {
  const gutter = formatUnit(props.gutter)
  // 行内边距 = 间距/2，列外边距 = -间距/2，实现列之间的间距
  return {
    paddingLeft: `calc(${gutter} / 2)`,
    paddingRight: `calc(${gutter} / 2)`,
    boxSizing: 'border-box',
    width: '100%'
  }
})
</script>

<style lang="less" scoped>
// 依赖全局注入的 Less 变量
.y-row {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  width: 100%;

  // 水平对齐方式（通过 data-justify 绑定）
  &[data-justify="flex-start"] { justify-content: flex-start; }
  &[data-justify="center"] { justify-content: center; }
  &[data-justify="flex-end"] { justify-content: flex-end; }
  &[data-justify="space-between"] { justify-content: space-between; }
  &[data-justify="space-around"] { justify-content: space-around; }
  &[data-justify="space-evenly"] { justify-content: space-evenly; }

  // 垂直对齐方式（通过 data-align 绑定）
  &[data-align="stretch"] { align-items: stretch; }
  &[data-align="flex-start"] { align-items: flex-start; }
  &[data-align="center"] { align-items: center; }
  &[data-align="flex-end"] { align-items: flex-end; }
  &[data-align="baseline"] { align-items: baseline; }

  // 是否换行（通过 data-wrap 绑定）
  &[data-wrap="false"] { flex-wrap: nowrap; }
  &[data-wrap="true"] { flex-wrap: wrap; }

  // 直接子组件仅允许 y-col，统一样式重置
  > y-col {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    // 列外边距抵消行内边距，实现真实间距
    margin-left: calc(var(--y-row-gutter) / 2);
    margin-right: calc(var(--y-row-gutter) / 2);
    margin-top: calc(var(--y-row-gutter) / 2);
    margin-bottom: calc(var(--y-row-gutter) / 2);
  }
}

// 注入行间距 CSS 变量（关联 props.gutter）
:root {
  --y-row-gutter: @spacing-2; // 默认 16px
}
</style>