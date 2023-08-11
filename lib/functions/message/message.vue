<template>
  <TransitionGroup tag="div" mode="out-in">
    <div v-for="(item,index) in list" :key="index" :class="['y-message',`y-message-${item.type}`]" @click="onClose(item)">
      <div>
        {{ item.text }}
      </div>
    </div>
  </TransitionGroup>
</template>
<script>
export default { name:'yMessage'}
</script>
<script setup>
import { reactive, toRefs } from 'vue'
const state = reactive({
  list:[]
})
const onClose = (item)=>{
  let {timer,uuid} = item;clearTimeout(timer);
  let index = state.list.findIndex(item=>item.uuid==uuid)
  state.list.splice(index,1)
}
const onPush = (config)=>{
  config.uuid = Math.random().toString(32);
  config.timer = setTimeout(()=>{
    let index = state.list.findIndex(item=>item.uuid==config.uuid)
    state.list.splice(index,1)
  },config.duration)
  state.list.unshift(config)
}
const {list} = toRefs(state);
defineExpose({onPush});
</script>
<style lang="scss">
.y-message-container{
  user-select: none;
  position: fixed;
  top: 65px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .y-message{
    transform: translate(-50%);
    cursor: pointer;
    width: 100%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    padding: 10px;
    // border-radius: 5px;
    box-shadow: 0 0 2px 1px #e1e1e1;
  }
}


.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0.1;
  transform: translateX(30px);
}
</style>