<template>
  <div class="y-header">
    <header>
      <div class="y-logo cursor-pointer" @click="logoClick">
        <p>&#8801;  {{props.logo}}<sup font-size-2 c-dark-3>{{aria}}</sup></p>
      </div>
      <slot name="mobile" :profile="profile"></slot>
      <slot name="mobiles" :profile="profile"></slot>
      <div class="placeholder" v-search="onSearch">
        <yIcon name="tdesign:search" size="24"></yIcon>
      </div>
      <slot name="right"></slot>
    </header>
    <aside>
      <dialog ref="dialog" class="border-none outline-none max-h-unset " @click="dialogClick">
        <div class="y-logo cursor-pointer">
            <p>&#8801;  {{props.logo}}<sup font-size-2 c-dark-3>{{aria}}</sup></p>
        </div>
        <slot name="aside"></slot>
      </dialog>
    </aside>
  </div>
</template>

<script setup>
defineOptions({ name: 'y-header',inheritAttrs:false });
import { onMounted, ref,toRefs, reactive, computed, inject } from 'vue'
const emit = defineEmits('search');
import {useAuth,useConfig,useStorage,apiFetch} from '@lib/utils'
const dialog = ref(null)
const props = defineProps({
  aria:{
    type:String,
    default:'.com'
  },
  logo:String
})
const state = reactive({
  timer:null,
  ref:null,
  dropdown:false,
  aria:props.aria,
  aside:null,
  profile:{
    uuid:'',
    nick:'Micateam',
    name:'You_游客',
    avatar:'FjjHFE7RwJqfjiwM9aqL4G53kPv3'
  },
}),{aria,aside,profile} = toRefs(state);
onMounted(()=>{
  state.profile = useStorage('youloge')
  // console.log('onMounted',state.profile)
  useAuth() && onProfile();
}) 
// 菜单点击
const logoClick = ()=>{
    // PC端 
    if(window.innerWidth > 768){
        dialog.value.style = `inset: 0px auto 0 0px;width: 180px;height: 100vh;`;
    }
    console.log('logoClick',dialog.value)
    dialog.value.showModal()
}
// 搜索点击
const onSearch = (data)=>emit('search',data)
// 退出登录
const onExit = ()=>{
  localStorage.removeItem('youloge')
}
// 登录状态才触发
const onProfile = (el)=>{
  state.dropdown = true
  setTimeout(()=>{
    document.addEventListener('click',(e)=>{
      state.dropdown = false
    },{once:true})
  },200)
}
// 点击dialog
const dialogClick = (e)=>{
  e.stopPropagation()
  console.log('dialogClick',e.target,e.currentTarget)
  if(e.target === e.currentTarget){
    dialog.value.close()
  }
}
</script>
<style lang="scss">
.y-header{
  position: sticky;
  top: 0;
  z-index: 99;
  backdrop-filter: saturate(50%) blur(4px);
  background-image: radial-gradient(transparent 1px,#fff 1px);
  background-size: 4px 4px;
  border-bottom: 1px solid #eee;
  user-select: none;
  header{
    height: 60px;
    padding: 0 10px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 50px;
    transition: all 0.3s;
    &:focus-within{
      padding-top: 20px;
      .y-logo{
        visibility: hidden;
        display: none;
      }
    }
    .y-logo{
        align-items: center;
    }
  }
  .y-logo{
      font-size: 24px;
    //   
      display: flex;
      height: 100%;
      cursor: pointer;
      sup{
        top:-1.5em
      }
    }
}

</style>