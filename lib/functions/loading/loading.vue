<template>
  <transition name="fade-pupop">
    <div class="y-loading" v-show="show">
      <i class="loading"></i>
      <p>{{props.text}}</p>
    </div>
  </transition>
</template>

<script>
export default { name:'yLoading' }
</script>
<script setup>
import { reactive, toRefs } from 'vue'
const props = defineProps({
  text:String,
  duration:Number
})
const state = reactive({
  show:false,
})
const toggle = ()=>{
  console.log('toggle')
  state.show = !state.show
}
defineExpose({toggle})
const {show} = toRefs(state)
</script>
<style lang="scss">
.y-loading {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  flex-direction: column;
  background: #ededed30;
}
.loading {
  width: 30px;
  height: 30px;
  border: 2px solid #000;
  border-top-color: transparent;
  border-radius: 100%;
  animation: circle infinite 0.75s linear;
}
@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>