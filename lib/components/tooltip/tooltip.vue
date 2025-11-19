<template>
  <div class="relative">
    <slot></slot>
    <span class="absolute ">{{ props.text }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
    text:{
        type:String,
        require:true
    }
})

</script>

<style>

</style>