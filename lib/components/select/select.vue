<template>
    <fieldset>
        <legend class="text-sm">{{props.label}}</legend>
        <div class="text-md m-1px relative cursor-pointer" @click="openDialog">
            <input type="text" class="w-full h-full px-1 py-1 text-md cursor-pointer border-none outline-none" :value="sValue" readonly />
            <span class="float-right absolute top-0 right-1 pointer-events-none">
                <svg class="w-1.5em h-1.5em" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></path></svg>
            </span>
            <dialog ref="dialogRef" :open="open" class="absolute w-full p-0 z-1000 bg-white top-8" @click="dialogClick">
                <ul class="list-none">
                    <li v-for="(item, index) in options" :key="index" class=" p-2 hover:bg-gray-100" :class="{
                        'bg-blue-100 text-blue-400': item.checked
                    }" @click="chooseItem($event,item)">{{item.value}}</li>
                </ul>
            </dialog>
        </div>
    </fieldset>
</template>

<script setup>
import { onUnmounted, ref, reactive, toRefs, watch,inject, computed } from 'vue'
const { setRules,deleteRules } = inject('formContext');
const symbol = Symbol('uuid');
const dialogRef = ref(null);
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
    }),
    open:false
}), { uuid, value,open, options } = toRefs(state);
// 验证函数
const onValidator = (value) => {
    console.log('onValidator.model.input',model.value)
    return {err:400,'msg':'验证失败'}
}
const sValue = computed(()=>{
    return options.value.filter((item) => item.checked).map(item=>item.value).join(',')
});
const onChange = (item) => {
    console.log('onChange',item)
}
const openDialog = (e) => {
    let {top,height,width,left,right,bottom} = e.target.getBoundingClientRect();
    // PC端 
    if(window.innerWidth > 768){
        dialogRef.value.style = `inset: ${bottom + 2}px auto auto ${left}px;width: ${width}px;max-height: 300px;`;
    }
    dialogRef.value.showModal();
}
const dialogClick = (e) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
        dialogRef.value.close()
    }
}
const chooseItem = (e,item) => {
    item.checked = !item.checked;
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