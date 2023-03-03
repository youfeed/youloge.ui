<template>
  <TransitionGroup :duration="300" tag="div">
    <div v-for="(item,index) in list" :key="index" class="y-message">
      <div :class="[`y-message-${item.type}`]">
        {{ item.content }}
      </div>
    </div>
  </TransitionGroup>
</template>
<script>
export default { name:'yMessage'}
</script>
<script setup>
import { reactive, toRefs } from 'vue'
const props = defineProps({
  type:{type:String,default:'success'},
  duration:{type:Number,default:3000},
})
const state = reactive({
  list:[]
})
console.log(props)
const onPush = (config)=>{
  let uuid = Math.random().toString(32);config.uuid = uuid;
  state.list.unshift(config)
  console.log(1,config)
  setTimeout(()=>{
    let index = state.list.findIndex(item=>item.uuid==uuid)
    state.list.splice(index,1)
  },config.duration) 
}
const {list} = toRefs(state)
defineExpose({onPush})
</script>
<style lang="scss">
.y-message-container{
  position: sticky;
  top: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
  max-width: 360px;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>