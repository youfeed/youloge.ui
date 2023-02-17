<template>
  <div :class="cls" ><slot></slot></div>
</template>
<script>
import { computed, inject, ref } from 'vue'
export default { name:'yCol'}
</script>
<script setup>
// 'xs', 'sm', 'md', 'lg', 'xl' 'span', 'offset', 'pull', 'push'
const props = defineProps({
  span:String,
  offset:String, 
  pull:String,
  push:String,
  xs:String,
  sm:String,
  md:String,
  lg:String,
  xl:String,
})
const cls = computed(()=>{
  let kind = ['y-col'];
  ['xs','sm','md','lg','xl'].forEach(size=>{
    props[size] && kind.push(`y-col-${size}-${props[size]}`)
  })
  // ['offset','pull','push'].forEach(is=>{
  //   props[is] && kind.push(`y-col-${is}`)
  // })
  // console.log(1,kind)
  return kind
})

const gutteer = inject('useGutter')
console.log('gutteer',gutteer);
// const width = ref(props.span<=24?props.span%1==0?(100/24)*props.span+'%':'':'')
// const offset = ref(props.offset<=24?props.offset%1==0?(100/24)*props.offset+'%':'':'')
</script>
<style lang="scss">
.y-col{
  display: flex;
  float: left;
}
</style>