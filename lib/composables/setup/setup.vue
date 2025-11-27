<template>
    <dialog class="m-0 p-0" ref="dialog">
        <div class="fixed right-2.5 top-2.5 z-50 flex gap-1 p-2.5 bg-gray-100 rounded-full">
            <div @click="reFresh" class="cursor-pointer select-none px-1 hover:text-blue-600 transition-colors">刷新</div>
            <div>|</div>
            <div @click="onClose" class="cursor-pointer select-none px-1 hover:text-blue-600 transition-colors">关闭</div>
        </div>
        <div :class="containerClass">
            <transition name="fade" mode="out-in" appear>
                <div class="component-wrapper">
                    <component :is="asyncComponent" :key="keyComponent"></component>
                </div>
            </transition>
        </div>
    </dialog>
</template>

<script setup>
import { onMounted, useTemplateRef, inject, defineAsyncComponent, computed, ref, nextTick } from 'vue'

const getRoutes = inject('getRoutes') || []
const dialogRef = useTemplateRef('dialog')
const keyComponent = ref(0)

const props = defineProps({
    name: String,
    routes: Array,
    ready: Function,
    error: Function,
    destroy: Function,
})

const reFresh = () => {
    keyComponent.value += 1
    console.log('reFresh')
}

const onClose = () => {
    console.log('close')
    props.destroy()
}

const asyncComponent = computed(() => {
    const [component] = props.routes
    return defineAsyncComponent({
        loader: component.component
    })
})

// 容器样式类
const containerClass = computed(() => {
    return [
        'min-w-[500px]',
        'min-h-[600px]',
        'max-w-[680px]',
        'max-h-[700px]',
        'overflow-y-auto',
        'bg-gray-100',
        'rounded-lg',
        'p-2',
        'fixed',
        'top-1/2',
        'left-1/2',
        '-translate-x-1/2',
        '-translate-y-1/2',
        'lg:max-w-[680px]',
        'sm:min-w-full',
        'sm:min-h-full',
        'sm:max-w-none',
        'sm:max-h-none',
        'sm:rounded-none',
        'sm:p-0',
        'sm:top-0',
        'sm:left-0',
        'sm:transform-none'
    ].join(' ')
})

onMounted(() => {
    dialogRef.value.showModal()
    props.ready({
        name: 9999
    })
    nextTick(() => {
        console.log('getRoutes', props.routes)
    })
})
</script>

<style scoped>
/* dialog 背景模糊效果 */
dialog::backdrop {
    backdrop-filter: blur(10px);
}

/* 组件包装器样式 */
.component-wrapper {
    width: 100%;
    height: 100%;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>