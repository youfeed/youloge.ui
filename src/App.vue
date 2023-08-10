
<template>
<div>
  <y-header aria="网盘"></y-header>

  <div>-----------rgba-----------</div>
  <div><y-rgba value="12.85"></y-rgba></div>
  <div>-----------tag-----------</div>
  <div>
    <y-tag type="success" size="small" label="新闻（New）"></y-tag>
  </div>
  <div>-----------label-----------</div>
  <y-label :data="label_data" @onChange="label_change">v</y-label>
  <div>-----------disscus-----------</div>
  <y-discuss uuid="uuid"></y-discuss>
  <div>-----------rich-----------</div>
  <y-rich :data="rich_data"></y-rich>
  <div>-----------tag-----------</div>
  <r-view>886</r-view>
  <XView>2333</XView>
  <div class="test">
    <div><button v-login="onLogin">触发登录</button></div>
    <div><button @click="load">加载load</button></div>
    <div><button v-copy="copy">复制内容</button></div>
    <div><button @click="onPayment">发起付款</button></div>

    <div>
      <button @click="onFetch('api')">网络请求 - api</button>
      <button @click="onFetch('vip')">网络请求 - vip</button>
    </div>
    <div><button @click="onMessage">useMessage 弹窗</button></div>
    <div><button @click="onPlus">usePlus sso 弹窗</button></div>
    <div><button @click="onLabel">换一组label的data</button></div>
  </div>

</div>
</template>
<script setup>
import { inject, reactive, ref, toRefs } from 'vue'

const usePayment = inject('usePayment')
const useDialog = inject('useDialog')
const useFetch = inject('useFetch')
const useMessage = inject('useMessage')
const usePlus = inject('usePlus')
// ----------
const state = reactive({
  label_data:['潇洒','a安抚','个','是德国','啊是服务'],
  rich_data:[{"type":"paragraph","children":[{"text":""}]},{"type":"list-item","children":[{"text":"saf"}],"ordered":true},{"type":"list-item","ordered":true,"children":[{"text":"sag"}]},{"type":"list-item","ordered":true,"children":[{"text":"sg "}]},{"type":"list-item","ordered":true,"children":[{"text":"sag"}]}]
})
const label_change = (e)=>{
  console.log('label_change',e)
}
const onLabel = ()=>{
  state.label_data = Array.from({length:6},v=>Math.random().toString(32));
}
// ----------
const {label_data,rich_data} = toRefs(state)
const onPlus = ()=>{
  console.log(0,usePlus())
  let sso = usePlus().sso({
    close:true
  }).listener(data=>{
    console.log(3,data)
  }).then(res=>{
    console.log(1,res)
  }).catch(err=>{
    console.log(2,err)
  })
  console.log(sso)
}
const onMessage = ()=>{
  console.log(666,useMessage())
  useMessage().success(6545646)
  useMessage().warning('warning')
  
}
const onLogin = ()=>{
  useMessage().success('登录成功')
}

const onFetch = (type)=>{
  switch (type) {
    case 'api':
      useFetch({mask:true}).api().then(res=>{
        console.log('api res',res)
      }).catch(err=>{
        console.log('api err',err)
      })
      break;
    case 'vip':
      useFetch({mask:true}).vip().then(res=>{
        console.log('vip res',res)
      }).catch(err=>{
        console.log('vip err',err)
      })
      break;
    default:
      break;
  }
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
.test{
  display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
}
</style>
 