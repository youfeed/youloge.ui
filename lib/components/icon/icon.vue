<template>
  <i :class="cls" :style="sty" >
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="symbel"></svg>
  </i>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import icon from './icon.json'
export default { name:'yIcon'}
</script>
<script setup>
const data = reactive({ symbel:'' })
const props = defineProps({
  type:String,
  size:String,
  color:String
})
const {type,size,color} = props
const cls = computed(()=>['y-icon',`y-icon-${type}`])
const sty = computed(()=>[ color && `color:${color};`,size && `font-size:${size}px;` ])
icon[type] && (data.symbel = icon[type].map(d=>`<path fill="currentColor" d="${d}"></path>`));
const {symbel} = toRefs(data)
</script>
<style>

</style>