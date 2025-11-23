<template>
    <div ref="list" class="y-list" :class="listClass" :style="listStyle">
        <div class="y-list__header" v-if="slots.header">
            <slot name="header" :loading="loading"></slot>
        </div>
        <div ref="container" class="y-list__container">
            <div class="y-list__container__item" v-for="(item, index) in model" :key="index">
                <slot name="default" :item="item" :index="index"></slot>
            </div>
            <!-- 哨兵元素 -->
            <div v-if="loadTrigger === 'infinite'" ref="sentinel" class="y-list__sentinel"></div>
            <!-- 加载按钮 -->
            <div class="flex justify-center w-full" v-if="state.hasMore">
                <y-button class=""  @click="loadMore">加载更多</y-button>
            </div>
        </div>
        <div class="y-list__footer" v-if="slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, useSlots, useTemplateRef, onMounted,onUnmounted,computed, watch,reactive, nextTick } from 'vue'
defineOptions({ name: 'y-link' });
defineExpose(['refresh']);
var io = null;
const slots = useSlots();
const listRef = useTemplateRef('list');
const sentinelRef = useTemplateRef('sentinel');
const containerRef = useTemplateRef('container');
const model = defineModel({
    type:Array,
    default: () => []
});
const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'primary', 'secondary', 'danger', 'success', 'info'].includes(value)
    },
    size: {
        type: String,
        default: '',
        validator: (value) => ['small'].includes(value)
    },
    split:{type:Boolean,default:false},
    stripe:{type:Boolean,default:false},
    // 加载函数: Promise
    loadPromise: {
        type: Function,
        default: null
    },
    // 加载触发方式
    loadTrigger: {
        type: String,
        default: 'infinite', // 'infinite' | 'click' | 'none'
        validator: val => ['infinite', 'click', 'none'].includes(val)
    },
});
const state = reactive({
    hasMore:true,
    io: null,
    list:[],
});

// 刷新数据
const refresh = () => {

}
// 处理项点击
const itemClick = (item, index, event) => {
    if (props.clickable) {
        emit('item-click', { item, index, event })
    }
}
// 异步加载
const loadMore = ()=>{
    props.loadPromise().then(data=>{
        Array.isArray(data) && (model.value = [...model.value,...data]);
        props.loadTrigger == 'infinite' && nextTick(()=>{
            console.log(999,io,listRef.value,sentinelRef.value,containerRef.value)
            addObserver()
        });
    }).catch(err=>{
        state.hasMore = false;
    });
}
// 添加监听
const addObserver = ()=>{
    io.observe(sentinelRef.value);
}
// 监听加载
const onObserver = () => {
    nextTick(()=>{
        const option = {
            delay:100,
            trackVisibility:true,
            root: listRef.value,
            rootMargin: '10px',
            threshold: 0.1
        }
        io = new IntersectionObserver(([entrie]) => {
            entrie.isIntersecting && props.loadPromise && loadMore()
        }, option);
        addObserver()
    });
}
// 动态样式
const listStyle = computed(()=>[''])
const listClass = computed(() => [
    'y-list', 
    `y-list--${props.type}`, 
    `y-list--${props.size}`,
    {
        'y-list--split': props.split,
        'y-list--stripe': props.stripe,
        'y-list--loading': state.loading,
    }
]);
// 初始化加载
onMounted(() => {
    // onObserver();
});
watch(sentinelRef, (newVal) => {
    if (newVal) {
        onObserver()
    }
})
onUnmounted(() => {
    io?.disconnect()
});
</script>

<style>
.y-list{
    color: var(--black);
    background: var(--white);
    padding: 10px;
}
.y-list__sentinel {
    height: 1px;
    width: 100%;
    pointer-events: none;
}
.y-list--loading{
    opacity: .8;
}
/* 分割线 */
.y-list--split .y-list__container__item{
    border-bottom-color: var(--neutral-100);
    border-bottom-width: 1px;
    border-bottom-style: solid;
}
/* 斑马纹 */
.y-list--stripe .y-list__container__item:nth-child(2n){
    background-color: var(--neutral-200);
}
</style>