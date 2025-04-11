<template>
  <div class="border-light-300 rounded flex gap-2">
    <template v-for="(item,index) in options" :key="index">
        <label class="" :for="`${uuid}-${index}`">
            <input type="radio" class="display-none" :id="`${uuid}-${index}`" :name="props.name" :checked="props.checked" :value="props.value" v-model="value" @click="onClick(item)"/>
            <span class="h-3 px-2 py-1 cursor-pointer" :class="{
                'bg-blue-100 text-blue-700 rounded':item.checked,
            }">{{item.value}}</span>
        </label>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs,inject } from 'vue'
// const formId = inject('formId')
// console.log('formId',formId)
const props = defineProps({
    form:{
        type:String,
        default:'23',
    },
    name:{
        type:String,
        default:'',
        required:true,
    },
    options:{
        type:Array,
        required:true,
        default:[],
    }
}),emits = defineEmits(['change']);
const state = reactive({
    value:'',
    uuid:'radio'+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    options:props.options.map(({value,label,checked=false,disabled=false}) => {
        return {value,label,checked}
    })
}),{uuid,value,options} = toRefs(state);

const onClick = (item)=>{
    state.options.forEach((it) => {
        it.checked = false;
    });
    item.checked = true;
    console.log('onClick',item) 
    // emits('change',e.target.value); 
}
</script>

<style>

</style>