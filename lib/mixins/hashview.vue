<template>
  <div name="hash-view" v-if="opener">
    <div class="y-hash-view">
      <div class="y-hash-capsule">
        <div @click="refresh">刷新</div>
        <div @click="onClose">关闭</div>
      </div>
      <div class="y-hash-container">
        <transition>
          <component :is="reload" :key="compkey"></component>
        </transition>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, computed, reactive,defineAsyncComponent, onBeforeMount, toRefs, onUnmounted } from 'vue'
import {useAuth} from '@lib/utils';
import useLogin from '@lib/functions/login/login';
// defineOptions({name:'HashView'})

const state = reactive({
  routes:[],
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
onMounted(()=>{

})
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
// 对外暴漏 并执行一次变化
const onRoute = (ROUTES)=>{
  state.routes = ROUTES;onChange()
  console.log('ROUTES',ROUTES)
}
defineExpose({onRoute})
const {compkey,opener} = toRefs(state)
</script>
<style lang="scss">
.y-hash-view{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2147483647;
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
    z-index: 2147483647;
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