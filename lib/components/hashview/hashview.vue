<template>
  <Teleport to="body" v-if="opener">
    <div class="y-hash-view">
      <div class="y-hash-capsule">
        <div @click="refresh">刷新</div>
        <div @click="onClose">关闭</div>
      </div>
      <transition name="fade" mode="out-in" appear>
        <div class="y-hash-container">
          <component :is="reload" :key="compkey"></component>
        </div>
      </transition>
    </div>
  </Teleport>
</template>
<script setup>
import {useAuth} from '@lib/utils';
import useLogin from '@lib/functions/login/login';
import {onMounted, computed, reactive,defineAsyncComponent, onBeforeMount, toRefs, onUnmounted, inject } from 'vue'
const routes = inject('useRoutes') || [];
const state = reactive({
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
onUnmounted(()=>window.removeEventListener("hashchange", onChange,false))
// 前置任务(此时无法)
onMounted(()=>onChange())
const onOpen = (cursor) =>{
  document.body.style.overflow = 'hidden';
  state.opener = true;
  state.cursor = cursor;
}
// Todo: v-login 
const onChange = () =>{
  let value = location.hash.slice(1);
  value.at(0) == '/' || (value = `/${value}`);
  value.at(-1) == '/' && (value = `${value}index`);
  let cursor = state.routes.findIndex(item=>item.path === value);
  cursor > -1 && (useAuth() ? onOpen(cursor) : useLogin().then(res=>{
    console.log(res);onOpen(cursor)
  }));
}
const onClose = () =>{
  document.body.style.overflow = 'auto';
  location.hash = '';
  state.opener = false;
}
const refresh = () =>{
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
  z-index: 2147483640;
  background: #f2f2f2f2;
  .y-hash-capsule{
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    background: #ddddddb5;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    z-index: 2147483641;
    color: #222;
    font-weight: bold;
    box-shadow: 1px 1px 3px #333;
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