<template>
  <div class="y-header">
    <header>
      <div class="y-logo" @click="onLogo">
        <p>&#8801;  {{props.logo}}<sup font-size-2 c-dark-3>{{aria}}</sup></p>
      </div>
      <div class="placeholder" v-search="onSearch" >
        <div>🔍 搜索一下</div>
      </div>

      <slot name="right"></slot>
    </header>
    <aside class="y-aside" v-show="aside">
      <div class="y-routes">
        <li></li>
      </div>
      <div class="y-profile">
        <div class="avatar">
          <img :src="'//img.youloge.com/'+profile.avatar+'!0'" class="y-profile-avatar"/>
        </div>
        <div class="y-profile-info">
          <div></div>
          <div></div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineOptions({ name: 'y-payment',inheritAttrs:false });
import { onMounted, toRefs, reactive, computed, inject } from 'vue'
import useStorage from "../../functions/storage";
import {useConfig} from '../../utils'
const useFetch = inject('useFetch')
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
})

const dropdown = computed(()=>[
  'y-dropdown',{'show':state.dropdown}
])

onMounted(()=>{
  state.profile = useStorage('youloge')
  // console.log('onMounted',useConfig(),useFetch)
})
// 菜单点击
const onLogo = ()=>{
  state.aside = !state.aside
}
// 搜索点击
const onSearch = (item)=>{
  console.log('onSearch',item)
}
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
const {aria,profile,aside} = toRefs(state)
</script>
<style lang="scss">
.y-header{
  position: sticky;
  top: 0;
  z-index: 999999;
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
      font-size: 24px;
      align-items: center;
      display: flex;
      height: 100%;
      cursor: pointer;
    }

  }
  aside{
    position: absolute;
    width: 100%;
    border-right: 1px solid #eee;
    background: transparent;
    height: calc(100vh - 60px);
    // top: 60px;
    display: flex;
    flex-direction: column;
    .y-routes,.y-profile{
      width: 240px;
      background: #fff;
    }
    .y-routes{
      height: 100%;
      overflow-y: scroll;
    }
    ::-webkit-scrollbar{
      width: 5px;
    }
    ::-webkit-scrollbar-thumb{
      background: #bfbfbf;
      border-radius:10px;
    }
    ::-webkit-scrollbar-track{
      background: rgb(239, 239, 239);
      border-radius:2px;
    }
    ::-webkit-scrollbar-corner{
      background: #179a16;
    }
    ::-webkit-scrollbar-thumb:hover{
      background: #333;
    }
    .y-profile{
      height: 60px;
      display: flex;
      padding: 5px;
      border: 1px solid #eee;
      img{
        width: 40px;
        height: 40px;
      }
    }
  }
}

</style>