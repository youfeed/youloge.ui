
<template>
<div>
  <y-header aria="网盘"></y-header>
  <div @click="load">
    加载load
    <!-- <y-video uuid="m2333"></y-video> -->
  </div>

  <div v-copy="copy">
    <p>复制内容</p>
  </div>

  <div @click="onPayment">
    <p>发起付款</p>
  </div>

  <div @click="onFetch">
    <p>api请求 带mask</p>
  </div>
  <div @click="onMessage">
    <p>useMessage 弹窗</p>
  </div>
  
</div>
</template>
<script setup>
import { inject, ref, toRefs } from 'vue'

const usePayment = inject('usePayment')
const useDialog = inject('useDialog')
const useFetch = inject('useFetch')
const useMessage = inject('useMessage')

const onMessage = ()=>{
  console.log(666,useMessage())
  useMessage().success(6545646)
  useMessage().warning('warning')
  
}
const onFetch = ()=>{
  useFetch({mask:true}).api()
}
const onPayment = ()=>{
  usePayment({
    ukey:'TKoLtLJatVyqbbNWQFb_yMdoFzoWx40b9I7JzUYwRORqiHB7MxNdfqpN8hnSsx3hdbThUbauq0M60DNkZQZDrQ==',
    local:'888974',
    money:0.01
  }).pay().then(res=>{
    console.log(0,res)
  }).catch(e=>{
    console.log(1,e)
  })
  console.log('usePayment',usePayment())
}
const copy = ()=>{
  let x = document.createElement('div')
  return x
}
const load = ()=>{
  let log = useDialog({content:'提示内容拉'})
  
  log.prompt({type:'password'}).then(res=>{
    console.log(1,res)
  }).catch(e=>{
    console.log(2,e)
  })
  // console.log('useMessage',useMessage().success('999'))
}
const props = defineProps({
  draft:{
    x:123
  }
})
const {draft} = toRefs(props)
</script>

<style lang="scss">
</style>
 