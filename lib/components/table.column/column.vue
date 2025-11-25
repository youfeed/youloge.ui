<template>

</template>

<script setup>
import { onMounted } from 'vue'

defineOptions({ name: 'y-table-column' })

const props = defineProps({
    // 列属性名
    prop: {
        type: String,
        required: true
    },
    // 列标题
    label: {
        type: String,
        default: ''
    },
    // 列宽度
    width: [String, Number],
    // 对齐方式
    align: {
        type: String,
        default: 'left',
        validator: val => ['left', 'center', 'right'].includes(val)
    },
    // 是否可排序
    sortable: Boolean,
    // 自定义格式化函数
    formatter: Function,
    // 是否固定列
    fixed: [Boolean, String],
    // 是否可筛选
    filterable: Boolean,
    // 自定义类名
    className: String
})

// 向父组件注册列配置
const emit = defineEmits(['register'])

// 组件挂载时向父组件注册
onMounted(() => {
    console.log(6666666666666)
    emit('register', {
        prop: props.prop,
        label: props.label,
        width: props.width,
        align: props.align,
        sortable: props.sortable,
        formatter: props.formatter,
        fixed: props.fixed,
        filterable: props.filterable,
        className: props.className
    })
})
</script>