<template>
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
    :data-underline="underline"
    @click="clickHandler"
  >
    <slot name="icon-left" class="y-link__icon y-link__icon--left" />
    <slot class="y-link__text" />
    <slot name="icon-right" class="y-link__icon y-link__icon--right" />
  </component>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineOptions({ name: 'y-link' })

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'danger', 'success', 'info'].includes(value)
  },
  href: { type: String, default: '' },
  target: {
    type: String,
    default: '_self',
    validator: (value) => ['_self', '_blank', '_parent', '_top'].includes(value)
  },
  disabled: { type: Boolean, default: false },
  noHover: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  underline: {
    type: String,
    default: 'hover',
    validator: (value) => ['hover', 'always', 'none'].includes(value)
  }
})

const emit = defineEmits(['click'])

const clickHandler = (e) => {
  if (props.disabled) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  if (!props.href) {
    e.preventDefault()
    emit('click', e)
  }
}
</script>

<style lang="less" scoped>
// 终极方案：无任何全局变量，所有值均为固定值，100% 无报错
.y-link {
  // 基础样式：GitHub 原生字体 + 固定尺寸
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: color 0.2s ease, background-color 0.2s ease, text-decoration 0.2s ease;
  color: inherit;

  // 块级显示适配
  &[data-block="true"] {
    display: flex;
    width: 100%;
    justify-content: flex-start;
  }

  // ------------ 颜色核心：固定 GitHub 风格色，无任何变量 ------------
  &[data-type="default"] {
    color: #0969da !important; // GitHub 标准链接蓝
  }
  &[data-type="primary"] {
    color: #0550ae !important; // 深一点的蓝
  }
  &[data-type="secondary"] {
    color: #6b7280 !important; // 灰色（辅助链接）
  }
  &[data-type="danger"] {
    color: #cf222e !important; // GitHub 危险红
  }
  &[data-type="success"] {
    color: #1a7f37 !important; // GitHub 成功绿
  }
  &[data-type="info"] {
    color: #2563eb !important; // 浅蓝（提示链接）
  }

  // ------------ 禁用状态：固定浅灰色，无变量 ------------
  &[data-disabled="true"] {
    color: #9ca3af !important; // 禁用浅灰
    background-color: transparent !important;
    cursor: not-allowed;
    text-decoration: none !important;
    pointer-events: none; // 彻底禁用交互
  }

  // ------------ Hover 状态：固定深色版，无变量 ------------
  &:not([data-disabled="true"]):not([data-no-hover="true"]):hover {
    &[data-type="default"] {
      color: #064eaa !important; // 链接蓝 hover 深色
    }
    &[data-type="primary"] {
      color: #044086 !important; // 深蓝 hover 深色
    }
    &[data-type="secondary"] {
      color: #1f2937 !important; // 灰色 hover 深色
    }
    &[data-type="danger"] {
      color: #a91c23 !important; // 危险红 hover 深色
    }
    &[data-type="success"] {
      color: #14632f !important; // 成功绿 hover 深色
    }
    &[data-type="info"] {
      color: #1d4ed8 !important; // 浅蓝 hover 深色
    }
    // GitHub 风格浅背景（固定透明色）
    background-color: rgba(229, 231, 235, 0.2) !important;
    border-radius: 3px !important; // 固定小圆角
  }

  // ------------ 下划线策略：固定样式，无变量 ------------
  &[data-underline="always"] {
    text-decoration: underline !important;
    text-underline-offset: 2px;
  }
  &[data-underline="hover"]:not([data-disabled="true"]):hover {
    text-decoration: underline !important;
    text-underline-offset: 2px;
  }
  &[data-underline="none"] {
    text-decoration: none !important;
  }

  // 聚焦样式：固定阴影色，无变量
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px #f3f4f6, 0 0 0 4px rgba(37, 99, 235, 0.3) !important;
    border-radius: 3px !important;
  }

  // 图标样式：固定尺寸，继承颜色
  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: inherit !important; // 强制继承链接颜色
  }
  &__icon--left {
    margin-right: 4px !important; // 固定间距
  }
  &__icon--right {
    margin-left: 4px !important; // 固定间距
  }

  &__text {
    display: inline-flex;
    align-items: center;
  }
}

// 响应式适配：固定断点 575px，无变量
@media (max-width: 575px) {
  .y-link {
    font-size: 12px !important; // 小屏字体缩小
    &__icon {
      width: 14px;
      height: 14px;
    }
  }
}
</style>