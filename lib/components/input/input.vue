<template>
    <fieldset>
        <legend class="text-sm">{{props.label}}</legend>
        <div class="text-md m-1px">
            <input type="text" :name="uuid" class="w-full h-full px-1 py-1 text-md border-none outline-none" placeholder=""/>
        </div>
    </fieldset>
</template>

<script setup>
import { onUnmounted, reactive, toRefs, watch,inject } from 'vue'
const { setRules,deleteRules } = inject('formContext');
const symbol = Symbol('uuid');
const props = defineProps({
    type: {
        type: String,
        default: 'text',
    },
    label:{
        type:String,
        default:'输入框',
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
    uuid: `input.${Math.random().toString(36)}.${Math.random().toString(36)}`.split('.').join(''),
    options:props.options.map(({value,label,checked=false,disabled=false}) => {
        return {value,label,checked}
    })
}),{uuid,options} = toRefs(state);
// 验证函数
const onValidator = (value) => {
    console.log('onValidator.model.input',model.value)
    return {err:400,'msg':'验证失败'}
}
// 监听value变化
const onChange = (item)=>{
    // state.options.forEach((it) => {
    //     it.checked = false;
    // });
    // item.checked = true;
    // model.value = item.value;
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

<style lang="scss">
    
</style>