<template>
    <fieldset>
        <legend class="text-sm">{{props.label}}</legend>
        <div class="text-md m-1px relative">
            <template v-for="(item,index) in options" :key="index">
                <span class="border rounded text-sm cursor-pointer" @click="onCancel(item)">{{ item.value }} x</span>
            </template>
            <span class="float-right">
                <svg class="w-1.5em h-1.5em" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></path></svg>
            </span>
            <div class="absolute w-full p-2 z-1000">
                <ul class="list-none">
                    <li v-for="(item, index) in options" :key="index">{{item.value}}</li>
                </ul>
            </div>
        </div>
    </fieldset>
</template>

<script setup>
import { onUnmounted, reactive, toRefs, watch,inject } from 'vue'
const { setRules,deleteRules } = inject('formContext');
const symbol = Symbol('uuid');
const props = defineProps({
    label: {
        type: String,
        default: '下拉选择',
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    rules:{
        type:[String,Array,Function],
        default: '',
    },
    options: {
        type: Array,
        required: true,
        default: [],
    }
}),model = defineModel({required: false}), emits = defineEmits(['change']);
const state = reactive({
    value: true,
    uuid: 'switch' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    options: props.options.map(({ value, label, checked = false, disabled = false }) => {
        return { label, value,  checked, disabled }
    })
}), { uuid, value, options } = toRefs(state);
// 验证函数
const onValidator = (value) => {
    console.log('onValidator.model.input',model.value)
    return {err:400,'msg':'验证失败'}
}
const onChange = (item) => {
    console.log('onChange',item)
}
// 监听value变化
watch(props, (newValue, oldValue) => {
    // 注册验证函数
    newValue.rules && setRules && setRules(symbol,onValidator)
    console.log('input.watch', newValue, oldValue);
},{deep:true,immediate:true});
// 销毁验证函数
onUnmounted(() => {
    deleteRules && deleteRules(symbol);
})
</script>

<style>

</style>