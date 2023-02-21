<template>
  <Teleport>
    <div>
      消息提醒
    </div>
  </Teleport>  
</template>

<script>
export default { name:'yMessage'}
</script>

<script setup>
const props = defineProps({
  text:String,
  type:{type:String,default:'success'},
  duration:{type:Number,default:3000},
})
</script>
<style>

</style>