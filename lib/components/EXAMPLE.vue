<template>
  <!-- 示例组件：使用 Tailwind CSS 4 风格的类名 -->
  <div class="relative w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    <!-- 头部 -->
    <header v-if="title || $slots.header" class="border-b border-slate-100 bg-slate-50 p-4">
      <h3 v-if="title" class="m-0 text-lg font-medium text-slate-900">{{ title }}</h3>
      <slot name="header" v-else></slot>
    </header>
    
    <!-- 主体内容 -->
    <main class="p-4">
      <slot>
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 overflow-hidden rounded-full bg-blue-100">
              <img v-if="avatar" :src="avatar" :alt="name" class="h-full w-full object-cover" />
              <div v-else class="flex h-full w-full items-center justify-center text-blue-600">
                {{ name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="flex-1">
              <h4 class="text-base font-medium text-slate-900">{{ name }}</h4>
              <p class="text-sm text-slate-500">{{ role }}</p>
            </div>
          </div>
          
          <p class="text-sm text-slate-600">{{ description }}</p>
        </div>
      </slot>
    </main>
    
    <!-- 底部操作区 -->
    <footer v-if="showActions" class="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4">
      <div class="flex space-x-2">
        <button 
          class="inline-flex items-center justify-center rounded-md border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
          @click="$emit('accept')"
        >
          接受
        </button>
        <button 
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
          @click="$emit('reject')"
        >
          拒绝
        </button>
      </div>
      
      <!-- 状态指示器 -->
      <div class="flex items-center">
        <div 
          :class="[
            'h-2 w-2 rounded-full',
            status === 'online' ? 'bg-green-500' : 'bg-gray-300'
          ]"
        ></div>
        <span class="ml-2 text-xs text-slate-500">{{ status === 'online' ? '在线' : '离线' }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
/**
 * 示例组件展示如何使用 Tailwind CSS 风格类名
 * 避免使用自定义规则，直接在组件中使用 Tailwind 类
 */
defineProps({
  title: String,
  name: { type: String, default: '用户' },
  role: { type: String, default: '成员' },
  avatar: String,
  description: { type: String, default: '这是一个示例组件，展示如何使用 Tailwind CSS 类名实现样式。' },
  status: { type: String, default: 'online' }, // online | offline
  showActions: { type: Boolean, default: true }
})

defineEmits(['accept', 'reject'])
</script>