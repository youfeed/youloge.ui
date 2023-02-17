<template>
  <button :class="cls">
    <span></span>
    <slot></slot>
    <span>I</span>
  </button>
</template>
<script>export default{name: "yButton"}</script>
<script setup>
  import {computed} from 'vue' 
  // type、plain、round 和 circle
  const props = defineProps({
    type:String,
    size:String,
    icon:String,
    text:Boolean,
    link:Boolean,
    plain:Boolean,
    round:Boolean,
    circle:Boolean,
    disabled:Boolean,
    loading:Boolean
  })
  const cls = computed(()=>{
    let kind = ['y-button'];
    ['type','size','plain','round','circle','disabled','loading'].forEach(is=>{
      props[is] && kind.push(`y-button-${props[is]}`)
    })
    return kind
  })
</script>
<style lang="scss">

</style>