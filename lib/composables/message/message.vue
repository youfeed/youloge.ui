<template>
    <div class="y-message-container" v-if="messaged.length > 0">
        <TransitionGroup tag="div" mode="out-in">
            <div v-for="item in messaged" :key="item.uuid" :class="['y-message', `y-message-${item.type}`]"
                @click="onClose(item)">
                <div v-html="item.content || 'unknown'"></div>
            </div>
        </TransitionGroup>
    </div>
</template>
<script setup>
import { computed, reactive } from 'vue'
defineOptions({ name: 'y-message' });
const state = reactive({
    message: []
});
// 动态计算条数
const messaged = computed(() => state.message.filter(Boolean));
// 主动点击销毁
const onClose = ({ timer, uuid }) => (clearTimeout(timer), close(uuid));

// 创建消息{uuid,type,content,duration } = option
const create = (option) => {
    let uuid = crypto.randomUUID();
    let timer = setTimeout(() => close(uuid), option.duration || 8000)
    // 添加到表
    option.uuid = uuid;
    option.timer = timer;
    state.message.push(option);
    return uuid;
}
// 移除单条
const close = (uuid) => {
    let findIndex = state.message.findIndex(is => is.uuid == uuid);
    findIndex == -1 || state.message.splice(findIndex, 1);
}
// 销毁全部
const destroy = () => {
    state.message = [];
}
defineExpose({ create, close, destroy });
</script>
<style lang="less">
.y-message-container {
    user-select: none;
    position: fixed;
    top: 50px;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 99999;

    .y-message {
        width: fit-content;
        transform: translate(-50%);
        cursor: pointer;
        min-width: 80px;
        background: var(--white);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 5px;
        padding: 10px;
        box-shadow: 0 0 2px 1px #e1e1e1;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 4px;
            bottom: 4px;
            width: 4px;
            border-radius: 2px; // 竖线圆角，更美观
        }
    }
}

.y-message-success {
    background-color: var(--success);
    color: var(--success);

    &::before {
        background-color: var(--success);
    }
}

.y-message-warning {
    background-color: var(--warning);
    color: var(--warning);

    &::before {
        background-color: var(--warning);
    }
}

.y-message-error {
    background-color: var(--error);
    color: var(--error);

    &::before {
        background-color: var(--error);
    }
}

.y-message-info {
    background-color: var(--info);
    color: var(--info);

    &::before {
        background-color: var(--info);
    }
}

.v-enter-active,
.v-leave-active {
    transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateY(60px);
}
</style>