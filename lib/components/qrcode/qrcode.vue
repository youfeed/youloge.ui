<template>
  <div v-dom="canvas" ref="canvas"></div>
</template>

<script setup>
import { nextTick, ref, watch, useTemplateRef } from 'vue';
import useQrcode from '@lib/composables/qrcode'

const canvas = ref(null);
const canvasRef = useTemplateRef('canvas');
const props = defineProps({
    text:'',
    level:{
        type:String,
        default:'M',
        validator: val => ['L', 'M', 'Q', 'H'].includes(val)
    },
    status:{
        type:String,
        default:'',
        validator: val => ['expired', 'loading', 'scanned'].includes(val)
    },
    borderless: Boolean,
});
//
watch(()=>props,()=>{
    console.log(props)
    nextTick(()=>{
        useQrcode(props.text).then(res=>{
            canvasRef.value.innerHTML = '';
            canvasRef.value.appendChild(res)
        });
    })
},{immediate:true});
</script>

<style>

</style>