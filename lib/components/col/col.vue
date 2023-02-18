<template>
  <div :class="cls" :style="sty"><slot></slot></div>
</template>
<script>
import { computed, inject, ref } from 'vue'
export default { name:'yCol'}
</script>
<script setup>
// 'xs', 'sm', 'md', 'lg', 'xl' 'span', 'offset', 'pull', 'push'
const props = defineProps({
  span:{type:String,default:'24'},
  justify:String,
  offset:String, 
  pull:String,
  push:String,
  xs:String,
  sm:String,
  md:String,
  lg:String,
  xl:String,
})
const gutter = inject('useGutter') >> 0;
const cls = computed(()=>{
  let kind = ['y-col',`y-col-${props['span']}`];
  !gutter || kind.push(`y-col-gutter`);
  ['xs','sm','md','lg','xl'].forEach(size=>{
    props[size] && kind.push(`y-col-${size}-${props[size]}`)
  });
  ['offset','pull','push'].forEach(is=>{
    props[is] && kind.push(`y-col-${props[is]}`)
  })
  // console.log(1,kind)
  return kind
})
const sty = computed(()=>{
  return [
    {
      'padding-left':!gutter || `${gutter / 2}px`,
      'padding-right':!gutter || `${gutter / 2}px`,
    }
  ]
})
console.log('gutteer',gutter);
// const width = ref(props.span<=24?props.span%1==0?(100/24)*props.span+'%':'':'')
// const offset = ref(props.offset<=24?props.offset%1==0?(100/24)*props.offset+'%':'':'')
</script>
<style lang="scss">

</style>