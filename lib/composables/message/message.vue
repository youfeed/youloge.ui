<template>
    <div v-if="messages.length > 0"
        class="y-message-container fixed top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center z-50 select-none pointer-events-none">
        <TransitionGroup tag="div" name="message" mode="out-in">
            <div v-for="item in messages" :key="item.uuid" :class="messageClass(item)"
                class="pointer-events-auto cursor-pointer relative mb-1.5 transform -translate-x-1/2"
                @click="onClose(item)">
                <!-- 左侧颜色条 -->
                <div class="y-message__indicator"></div>

                <!-- 消息内容 -->
                <div class="y-message__content" v-html="item.content || 'unknown'"></div>

                <!-- 关闭按钮 -->
                <button v-if="item.closable !== false" class="y-message__close" @click.stop="onClose(item)">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'

defineOptions({ name: 'y-message' })

const state = reactive({
    messages: []
})

// 动态计算消息条数
const messages = computed(() => state.messages.filter(Boolean))

// 获取消息样式类
const messageClass = (item) => [
    `y-message-${item.type || 'info'}`,
    'y-message-md',
    {
        'y-message__close-visible': item.closable !== false
    }
]

// 主动点击销毁
const onClose = ({ timer, uuid }) => {
    clearTimeout(timer)
    close(uuid)
}

// 创建消息 {uuid, type, content, duration, closable } = option
const create = (option) => {
    
    const uuid = crypto.randomUUID()
    const duration = option.duration !== undefined ? option.duration : 3000

    const timer = setTimeout(() => close(uuid), duration)

    // 添加到列表
    const messageItem = {
        uuid,
        type: option.type || 'info',
        content: option.content || '',
        duration,
        closable: option.closable !== false,
        timer,
        timestamp: Date.now()
    }
    state.messages.push(messageItem)

    // 限制最大消息数量
    if (state.messages.length > 10) {
        state.messages.shift()
    }

    return uuid
}

// 移除单条消息
const close = (uuid) => {
    const findIndex = state.messages.findIndex(msg => msg.uuid === uuid)
    if (findIndex !== -1) {
        state.messages.splice(findIndex, 1)
    }
}

// 销毁全部消息
const destroy = () => {
    state.messages = []
}

// 根据类型创建便捷方法
const success = (content, duration) => create({ type: 'success', content, duration })
const warning = (content, duration) => create({ type: 'warning', content, duration })
const error = (content, duration) => create({ type: 'error', content, duration })
const info = (content, duration) => create({ type: 'info', content, duration })

defineExpose({
    create,
    close,
    destroy,
    success,
    warning,
    error,
    info
})
</script>

<style scoped>
/* 布局样式 - 不与 UnoCSS 冲突 */
.y-message {
    display: flex;
    align-items: center;
}

.y-message:hover .y-message__indicator {
    transform: scaleY(1.2);
}

.y-message__close:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

/* 动画效果 */
.message-enter-active,
.message-leave-active {
    transition: all 0.3s ease;
}

.message-move {
    transition: transform 0.3s ease;
}

.message-enter-from {
    opacity: 0;
    transform: translateY(-60px) translateX(-50%);
}

.message-leave-to {
    opacity: 0;
    transform: translateY(60px) translateX(-50%);
}



/* 响应式覆盖 */
@media (max-width: 768px) {
    .y-message {
        max-width: calc(100vw - 32px);
    }
}

/* 打印样式 */
@media print {
    .y-message-container {
        display: none;
    }
}
</style>