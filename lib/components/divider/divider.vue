<template>
  <div class="transition-colors duration-200" :class="computedClass" :style="computedStyle">
    <span v-if="direction === 'horizontal' && slots.default" class="divider-text">
      <slot></slot>
    </span>
  </div>
</template>

<script setup>
import { computed,useSlots  } from 'vue';
const slots = useSlots();
const props = defineProps({
  // 方向：水平（默认）/垂直
  direction: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val)
  },
  // 颜色：贴合GitHub灰调风格，支持自定义
  color: {
    type: String,
    default: 'gray-200' // GitHub默认分割线颜色
  },
  // 粗细：默认1px，支持自定义
  thickness: {
    type: String,
    default: '1px'
  },
  // 间距：水平方向控制上下间距，垂直方向控制左右间距
  gap: {
    type: [Number,String],
    default: '0',
  },
  // 是否虚线
  dashed: {
    type: Boolean,
    default: false
  },
  // 水平分割线文本位置（仅水平方向生效）
  position: {
    type: String,
    default: 'center',
    validator: (value) => ['center', 'left', 'right'].includes(value)
  }
});
const computedClass = computed(() => {
  // 方向基础样式
  const directionClasses = {
    horizontal: 'w-full flex items-center',
    vertical: 'h-full inline-flex align-middle'
  }
  // 线条样式（实线/虚线）
  const lineStyle = props.dashed ? 'border-dashed' : 'border-solid';
  // 间距样式：水平=上下间距，垂直=左右间距
  const gapClasses = props.direction === 'horizontal'
    ? `my-${props.gap}` // 提取数值（如"8px"→"8"），适配Unocss的my-8
    : `mx-${props.gap}`;
  // 文本样式（仅水平方向）
  const textClasses = props.direction === 'horizontal' && slots.default
    ? `divider-text:px-3 divider-text:text-gray-500 divider-text:text-sm ${props.position === 'left' ? 'justify-start' :
      props.position === 'right' ? 'justify-end' : 'justify-center'
    }`
    : ''
  return `${directionClasses[props.direction]} ${lineStyle} ${gapClasses} ${textClasses}`
});
const computedStyle = computed(() => {
  const baseStyle = {
    // 水平分割线=边框底部，垂直分割线=边框左侧
    borderColor: props.color,
    [props.direction === 'horizontal' ? 'borderBottomWidth' : 'borderLeftWidth']: props.thickness
  }
  return baseStyle;
});
</script>

<style scoped>
/* 继承父容器背景，避免线条穿过文本 */
.divider-text {
  background-color: inherit;
}
</style>