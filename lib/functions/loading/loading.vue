<template>
  <transition name="fade-pupop">
    <div class="y-loading" v-if="obj.show" :style="{'position':obj.position,'background-color':obj.bgColor}">
      <div :style="{color:obj.textColor}" class="y-loading-center">
        <i :class="['loading-icon',obj.icon]" v-if="obj.showIcon&&obj.img==''"></i>
        <img :src="obj.img" alt="" v-if="obj.img!=''" class="loading-img">
        <span v-if="obj.text!=''">{{obj.text}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default { name:'yLoading' }
</script>
<script setup>
import { toRefs } from 'vue'
const props = defineProps({
  show:Boolean,
  text:String,
  obj:Object
})
const {show} = props
const toggle = ()=>{
  console.log('toggle')
  show = !show
}
console.log(5,props)
defineExpose({toggle})
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