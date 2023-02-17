<template>
  <div :class="cls">
    <label for="">{{ props.label }}</label>
    <input id="" type="text" placeholder=""/>
  </div>
</template>

<script>
export default { name:'yInput'}
</script>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  label:String
})
const cls = computed(()=>{
  let kind = ['y-input'];
  return kind
})
</script>
<style lang="scss">
.y-input{
  position: relative;
}
.y-input label{
  position: absolute;
  left: 0;
  padding: 15px;
  pointer-events: none;
  transform: .3s;
}
.y-input input{
  padding: 10px;
}
.y-input input:valid,.y-input input:focus{
  border: 1px solid #f00;
}
</style>