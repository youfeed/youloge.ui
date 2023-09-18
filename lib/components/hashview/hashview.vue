<template>
  <Teleport to="body" v-if="opener">
    <div class="y-hash-view">
      <div class="y-hash-capsule">
        <div @click="Refresh">刷新</div>
        <div @click="onClose">关闭</div>
      </div>
      <div class="y-hash-container">
        <transition>
          <component :is="reload" :key="compkey"></component>
        </transition>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {name:'HashView'}
</script>
<script setup>
import {onMounted,inject, computed, reactive,defineAsyncComponent, onBeforeMount, toRefs, onUnmounted } from 'vue'
const {layout,routes}  = inject('useHash');
// console.log('layout',layout)
const state = reactive({
  layout:layout,
  routes:routes,
  cursor:0,

  opener:false,
  compkey:0
})
const reload = computed(()=>{
  let {routes,cursor} = state;
  let active = routes[cursor];
  return defineAsyncComponent({loader:active.component})
}) 
onBeforeMount(()=>window.addEventListener("hashchange", onChange,false))
onMounted(()=>{
  onChange();
})
onUnmounted(()=>{
  window.removeEventListener("hashchange", onChange,false)
})
const onChange = () =>{
  let value = location.hash.slice(1);
  value.at(0) == '/' || (value = `/${value}`);
  value.at(-1) == '/' && (value = `${value}index`);
  let cursor = state.routes.findIndex(item=>item.path === value);
  if(cursor != -1){
    document.body.style.overflow = 'hidden';
    state.opener = true;
    state.cursor = cursor;
  }
}
const onClose = () =>{
  document.body.style.overflow = 'auto';
  location.hash = '';
  state.opener = false;
}
const Refresh = () =>{
  state.compkey += 1
}
const {compkey,opener} = toRefs(state)
</script>
<style lang="scss">
.y-hash-view{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.9);
  .y-hash-capsule{
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    background: #ddd;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    div{
      padding: 10px;
      border: 0;
      outline: 0;
      user-select: none;
      &:hover{
        background: #ccc;
      }
    }
  }
}
</style>