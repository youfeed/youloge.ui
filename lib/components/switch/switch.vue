<template>
    <fieldset>
        <legend>{{ props.label }}</legend>
        <div class="text-md m-1px">
            <input type="checkbox" class="hidden peer" :name="props.name" v-model="value" @change="onChange()" checked>
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 relative">
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
        default: '切换开关',
    },
    rules: {
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
        return { value, label, checked, disabled }
    })
}), { uuid, value, options } = toRefs(state);
// 验证函数
const onValidator = (value) => {
    console.log('onValidator.switch.input',model.value)
    return {err:400,'msg':'验证失败'}
}
const onChange = (item) => {
    console.log('onChange',item)
    // emits('change', e.target.value);
}
// 监听value变化
watch(props, (newValue, oldValue) => {
    // 注册验证函数
    newValue.rules && setRules && setRules(symbol,onValidator)
    console.log('switch.watch', newValue, oldValue);
},{deep:true,immediate:true});
// 销毁验证函数
onUnmounted(() => {
    deleteRules && deleteRules(symbol);
})
</script>

<style></style>