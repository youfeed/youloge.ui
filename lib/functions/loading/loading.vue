<template>
  <transition name="fade-pupop">
    <div class="y-loading" v-show="show" style="">
      2333
      <!-- <div :style="{color:props.textColor}" class="y-loading-center">
        <i :class="['loading-icon',props.icon]" v-if="props.showIcon&&props.img==''"></i>
        <img :src="props.img" alt="" v-if="props.img!=''" class="loading-img">
        <span v-if="props.text!=''">{{props.text}}</span>
      </div> -->
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
console.log('props',props)

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
  .y-loading-center {
    color: #fff;
    padding: 6px 15px;
    text-align: center;
    .loading-icon{
      display: block;
      font-size:19px;
      animation: icon-loading 1.5s linear infinite;
    }
    .loading-img{
      width: 25px;
      height: 25px;
      display: block;
      font-size:19px;
      margin:0 auto;
      object-fit: contain;
      animation: icon-loading 1.5s linear infinite;
    }
    span{
      display: inline-block;
      margin-top: 8px;
      font-size:14px;
    }
  }
}
</style>