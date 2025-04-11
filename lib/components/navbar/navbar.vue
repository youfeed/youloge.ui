<template>
  <div class="relative flex nowrap gap-1">
    <template v-for="(item, index) in items" :key="index">
      <div class="inline-flex items-center justify-center cursor-pointer border-b-2 border-transparent hover:border-b-blue-400" :class="{
        'border-b-blue-300  text-blue-700':item.active,
        'cursor-not-allowed':item.disabled,
        
        }" @click="onClick(item)">
        <div class="text-sm py-3"><yIcon :name="item.icon" v-if="item.icon"></yIcon> {{ item.value }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs } from 'vue'
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    align: {
        type: String,
        default: 'left',
        validator:(value)=>['left','center','right'].includes(value)
    }
}),emits = defineEmits(['change']);
// 点击选中
const onClick = (item)=>{
    console.log(state.items)
    state.items.forEach((it) => {
        it.active = false;
    });
    item.active = true;
    emits('change',item);
}
const state = reactive({
    items:props.items.map(({label,value,icon=false,size='sm',active=false,disabled=false}) => {
        console.log('label',label,value,active)
        return {label,value,icon,size,active,disabled}
    }).filter(item=>item.label && item.value)
}),{ active,items } = toRefs(state);

console.log('items',props.items,state.items)

</script>

<style>

</style>