<template>
  <!-- 根据 href 是否存在，自动渲染 a 标签或 span（确保语义正确） -->
  <component
    :is="href ? 'a' : 'span'"
    class="y-link"
    :href="href && !disabled ? href : undefined"
    :target="target && !disabled ? target : undefined"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :data-type="type"
    :data-disabled="disabled"
    :data-no-hover="noHover"
    :data-block="block"
    @click="clickHandler"
  >
    <!-- 前置图标插槽 -->
    <slot name="icon-left" class="y-link__icon y-link__icon--left" />
    <!-- 主文本插槽 -->
    <slot class="y-link__text" />
    <!-- 后置图标插槽 -->
    <slot name="icon-right" class="y-link__icon y-link__icon--right" />
  </component>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

defineOptions({ name: 'y-link' })

const props = defineProps({
  // 样式类型（贴合 GitHub 配色变体）
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'danger', 'success', 'info'].includes(value)
  },
  // 链接地址（为空时渲染 span，仅作为交互元素）
  href: {
    type: String,
    default: ''
  },
  // 打开方式（_self/_blank/_parent/_top）
  target: {
    type: String,
    default: '_self',
    validator: (value) => ['_self', '_blank', '_parent', '_top'].includes(value)
  },
  // 禁用状态
  disabled: {
    type: Boolean,
    default: false
  },
  // 禁用 hover 效果
  noHover: {
    type: Boolean,
    default: false
  },
  // 是否块级显示（默认 inline）
  block: {
    type: Boolean,
    default: false
  },
  // 下划线显示策略（默认 hover 显示，可选 always/none）
  underline: {
    type: String,
    default: 'hover',
    validator: (value) => ['hover', 'always', 'none'].includes(value)
  }
})

const emit = defineEmits(['click'])

// 点击处理（禁用状态拦截、非 a 标签触发自定义事件）
const clickHandler = (e) => {
  // 禁用状态拦截
  if (props.disabled) {
    e.preventDefault()
    e.stopPropagation()
    return
  }

  // 非 a 标签（href 为空）触发自定义事件
  if (!props.href) {
    e.preventDefault()
    emit('click', e)
  }
}
</script>

<style lang="less" scoped>
// 依赖全局注入的变量/混入（无需局部导入）
.y-link {
  // 基础样式（GitHub 链接核心：无默认下划线、蓝色文本、inline 对齐）
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: @font-sans;
  font-size: @font-size-sm;
  font-weight: 400; // GitHub 链接默认常规权重（区别于按钮的 500）
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
  // 统一过渡动画（颜色、背景、文本装饰）
  .transition-base();

  // 块级显示适配
  &[data-block="true"] {
    display: flex;
    width: 100%;
    justify-content: flex-start; // 块级链接文本左对齐
  }

  // 禁用状态（全局混入统一处理）
  &[data-disabled="true"] {
    .disabled-state();
    cursor: not-allowed;
    text-decoration: none !important; // 禁用时强制隐藏下划线
  }

  // 聚焦样式（贴合 GitHub 低调风格，不突兀）
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px @neutral-100, 0 0 0 4px fade(@primary-500, 30%);
    border-radius: @border-radius-sm;
  }

  // 下划线策略（通过 props.underline 控制）
  &[data-underline="always"] {
    text-decoration: underline;
    text-underline-offset: 2px; // 下划线偏移，更美观
  }
  &[data-underline="none"] {
    &:hover:not([data-disabled="true"]) {
      text-decoration: none !important;
    }
  }

  // 非禁用且未禁用 hover 时，应用全局链接 hover 混入
  &:not([data-disabled="true"]):not([data-no-hover="true"]) {
    .link-hover();
    // 额外添加 GitHub 风格的浅背景 hover 效果
    &:hover {
      background-color: fade(@primary-500, 5%);
      border-radius: @border-radius-sm;
    }
  }

  // 图标插槽样式（前后图标间距适配）
  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    width: 16px;
    height: 16px;
  }
  &__icon--left {
    margin-right: @spacing-1;
  }
  &__icon--right {
    margin-left: @spacing-1;
  }

  // 文本插槽样式（确保对齐）
  &__text {
    display: inline-flex;
    align-items: center;
  }

  // 类型样式（GitHub 低饱和度配色变体，通过 data-type 匹配）
  // 1. 默认链接（GitHub 标准蓝）
  &[data-type="default"] {
    color: @text-link;
  }

  // 2. 主色链接（深一点的蓝，突出重要链接）
  &[data-type="primary"] {
    color: @primary-600;
    &:hover:not([data-disabled="true"]) {
      color: @primary-700;
    }
  }

  // 3. 次要链接（灰色，用于辅助性链接）
  &[data-type="secondary"] {
    color: @text-secondary;
    &:hover:not([data-disabled="true"]) {
      color: @text-primary;
      background-color: fade(@neutral-200, 20%);
    }
  }

  // 4. 危险链接（红色，用于删除/警告类链接）
  &[data-type="danger"] {
    color: @danger-500;
    &:hover:not([data-disabled="true"]) {
      color: @danger-600;
      background-color: fade(@danger-500, 30%);
    }
    &:focus-visible {
      box-shadow: 0 0 0 2px @neutral-100, 0 0 0 4px fade(@danger-500, 20%);
    }
  }

  // 5. 成功链接（绿色，用于成功状态相关链接）
  &[data-type="success"] {
    color: @success-500;
    &:hover:not([data-disabled="true"]) {
      color: @success-600;
      background-color: fade(@success-500, 30%);
    }
  }

  // 6. 信息链接（浅蓝，用于提示类链接）
  &[data-type="info"] {
    color: @primary-500;
    &:hover:not([data-disabled="true"]) {
      color: @primary-600;
      background-color: fade(@primary-50, 30%);
    }
  }
}

// 响应式适配（小屏设备链接文本略小）
@media (max-width: @sm-max) {
  .y-link {
    font-size: @font-size-xs;
    &__icon {
      width: 14px;
      height: 14px;
    }
  }
}
</style>