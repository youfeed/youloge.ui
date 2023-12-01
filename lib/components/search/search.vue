<template>
  <div class="y-search">
    <div class="dialog" @click="onClose">
      <div class="box" ref="ref">
        <div class="input">
          <input type="search" name="q" @input="onSearch" placeholder="搜索" v-model="query"/>
        </div>
        <div class="navbar">
          <div class="menus" style=" display: flex; gap: 10px;">
            <template v-for="item in navbar" :key="item.method">
              <div :class="{active:item.method == method}" @click="onMethod(item.method)">{{item.name}}</div>
            </template>
          </div>
          <div class="status"> {{ count }} 条记录</div>
        </div>
        <ul class="list">
          <li v-for="(item,index) in list" :key="index" @click="props?.onCall(item)">
            <div class="thum">
              <img :src="`https://img.youloge.com/${item.poster}!80`">
            </div>
            <div class="content">
              <div class="title">{{ item.title }}</div>
              <div class="intro">{{ item.intro }}</div>
              <div class="label"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, toRefs } from "vue";import {apiFetch} from '@lib/utils'
defineOptions({ name: 'y-search',inheritAttrs:false });const props = defineProps(['onCall','onClose']);
const state = reactive({
  ref:null,
  query:'',
  count:0,
  method:'welcome',
  navbar:[
    {name:'全部',method:'welcome'},
    {name:'视频',method:'video'},
    {name:'文章',method:'article'},
    {name:'购物',method:'goods'},
    {name:'文件',method:'drive'},
  ],
  list:[],
  show:false,
  timer:null
})
onMounted(()=>{
  callSearch()
})
// 更换栏目
const onMethod = (value)=>{
  state.method = value;callSearch();
}
const onSearch = (e)=>{
  clearTimeout(state.timer);state.timer = setTimeout(()=>{
    callSearch()
  },300)
}
// 发起查询
const callSearch = ()=>{
  let {query,method} = state
  apiFetch('search',method,{q:query}).then(res=>{
    if(res.err == 200){
      state.count = res.data.count
      state.list = res.data.list
    }
    console.log(res)
  }).catch(err=>{

  })
}
const onClose = (e)=>{
  let {ref} = state;
  ref?.contains(e.target) || props?.onClose();
}
const {ref,show,method,navbar,query,count,list} = toRefs(state)
</script>

<style lang="scss">
  .y-search{
    .placeholder{
      display: inline-block;
      border: 1px solid #333;
      border-radius: 5px;
      width: auto;
      padding: 5px 20px;
    }
    .dialog{
      height: 100%;
      position: fixed;
      width: 100%;
      background: #656565ab;
      top: 0;
      left: 0;
      z-index: 999999999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 20px;
      .box{
        background: #fff;
        height: auto;
        border-radius: 10px;
        padding: 20px;
        width: min(100%,600px);
        margin: 10px;
        input{
          height: 100%;
          width: 100%;
          padding: 5px;
          border: 1px solid #eee;
          border-radius: 10px;
        }
        .navbar{
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          margin-bottom: 10px;
          border-bottom: 1px solid #e3e3e3;
          .menus{
            display: flex; 
            gap: 10px;
            cursor: pointer;
            .active{
              color: #2196F3;
              font-weight: bold;
              border-bottom: 1px solid #2196F3;
            }
          }
        }
        .status{
          text-align: right;
          color: #888;
          font-size: 12px;
          margin: 10px 0;
        }
        ul li{
          border: 1px solid #999;
          padding: 5px;
          border-radius: 5px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          cursor: pointer;
          .title{
            font-size: 16px;
            font-weight: 600;
          }
          .intro{
            color: #666;
            font-size: 14px;
            line-height: 14px;
          }
        }
        // min-width: 400px;
      }
    }

  }
</style>