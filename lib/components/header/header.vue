<template>
  <header class="y-header">
    <div class="y-logo">
      <p>&#8801;  Youloge<sup>{{aria}}</sup></p>
    </div>
    <div class="y-search">
      <form action="/search">
        <input type="search" name="q"/>
        <button type="submit">搜索</button>
      </form>
    </div>
    <div class="y-profile">
      <slot></slot>
      <div class="userinfo" v-login="onProfile">
        <img :src="'//img.youloge.com/'+profile.avatar+'!0'" class="y-profile-avatar"/>
      </div>
      <div :class="dropdown">
        <a class="y-profile-li" href="//www.youloge.com/#/profile/">
          <img :src="'//img.youloge.com/'+profile.avatar+'!0'" class="y-profile-avatar"/>
          <div class="y-profile-li-r">
            <p>{{profile.name}}</p>
            <small>@{{profile.nick}}</small>
          </div>
        </a>
        <a class="y-profile-li" href="//www.youloge.com/#/wallet/">
          <span>·</span>
          <div class="y-profile-li-r">我的钱包</div>
        </a>
        <a class="y-profile-li" href="//www.youloge.com/#/wallet/">
          <span>·</span>
          <div class="y-profile-li-r">开放平台</div>
        </a>
        <a class="y-profile-li" @click="onExit">
          <span>·</span>
          <div class="y-profile-li-r">退出登录</div>
        </a>
      </div>
    </div>
  </header>
</template>

<script>
export default { name:'yHeader' }
</script>
<script setup>
import { onMounted, toRefs, reactive, computed } from 'vue'
const props = defineProps({
  aria:{
    type:String,
    default:'.com'
  }
})
const state = reactive({
  ref:null,
  dropdown:false,
  aria:props.aria,
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
  state.profile = Object.assign(state.profile,JSON.parse(localStorage.getItem('youloge') || '{}')) 
})
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
const {aria,profile} = toRefs(state)
</script>
<style lang="scss">
.y-header{
  height: 60px;
  box-shadow: 2px 0px 1px #999;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 9999;
  backdrop-filter: saturate(50%) blur(4px);
  background-image: radial-gradient(transparent 1px,#fff 1px);
  background-size: 4px 4px;
  .y-logo{
    display: flex;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    height: 100%;
    line-height: 50px;
    cursor: pointer;
    sup{
      font-size: 10px;
      color: #999;
    }
  }
  .y-search{
    border: 1px solid #999;
    padding: 4px;
    border-radius: 2px;
    margin: 0 10px;
    color: #222;
    &:focus-within{
      border: 1px solid #6a8fe0;
      border-radius: 4px;
      button{
        color: #6a8fe0;
      }
    }
    input{
      border: 0;
      outline: 0;
      width: calc(100% - 26px);
      background: transparent;
    }

    button{
      outline: 0;
      background: transparent;
      border: 0;
      color: #233;
    }
  }
  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none !important;
  }
  .y-profile-avatar{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #999;
  }
  .y-profile{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .y-dropdown{
      position: absolute;
      display: none;
      top: 60px;
      right: 10px;
      min-width: 180px;
      box-shadow: 1px 2px 3px 1px #d1d1d1;
      border-radius: 5px;
      .y-profile-li{
        color: #222;
        text-decoration: none;
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        background: #fff;
        &:hover{
          opacity: .7;
          background: #eee;
        }
      }
      .y-profile-li-r{
        margin-left: 10px;
      }
    }
    .show{
      display: block;
    }

  }
}
</style>