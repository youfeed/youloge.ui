<template>
  <div class="inline-block p-1">
    <div class="border rounded relative">
        <div class="">
            <template v-for="(item,index) in options" :key="index">
                <span class="border rounded text-sm cursor-pointer" @click="onCancel(item)">{{ item.value }} x</span>
            </template>
            <input type="text" class="w-fit-content" @change="onCreate"/>
        </div>
        <label class="cursor-pointer">{{ props.title }}</label>
    </div>
    <div class="display-none">
        <select v-model="value" multiple>
            <option v-for="(item, index) in options" :key="index" :value="item.value" selected/>
        </select>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs, inject } from 'vue'
const props = defineProps({
    form: {
        type: String,
        default: '23',
    },
    title: {
        type: String,
        default: 'saf',
        required: true, 
    },
    name: {
        type: String,
        default: '',
        required: true,
    },
    multiple:{
        type: Boolean,
        default: false,
    },
    options: {
        type: Array,
        required: true,
        default: [],
    }
}), emits = defineEmits(['change']);
const state = reactive({
    value: true,
    uuid: 'switch' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    options: props.options.map(({ value, label, checked = false, disabled = false }) => {
        return { label, value,  checked, disabled }
    })
}), { uuid, value, options } = toRefs(state);
const onChange = (item) => {
    console.log('onChange',item)
}
// 增加内容
const onCreate = (e) => {
    state.options.push({
        value:e.target.value
    })
    console.log('onCreate',e.target.value) 
}
// 取消内容
const onCancel = (item) => {
    console.log('onCancel',item)
}
</script>

<style>

</style>