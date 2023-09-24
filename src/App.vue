
<template>
<div>
  <hash-view></hash-view>
  
  <main w-200 mx-a>
    <div>-----------ylogin-----------</div>
    <y-login @success="login_success" @error="login_success" @progress="login_success"></y-login>
    <div class="bg-red">-----------rgba-----------</div>
    <div><y-rgba value="1285"></y-rgba></div>
    <div>-----------ads-----------</div>
    <y-ad style="width: 300px;margin: 0 auto;background: #666;"></y-ad>
    <yAd style="width: 300px;margin: 0 auto;background: #666;"></yAd>
    <div>-----------discuss-----------</div>
    <y-discuss uuid="Muuid"></y-discuss>
    <div>-----------video-----------</div>
    <y-video uuid="video"></y-video>
    <div>-----------header-----------</div>
    <y-header aria="网盘" v-ripple></y-header>
    <div>-----------label-----------</div>
    <div>-----------disscus-----------</div>
    <y-discuss uuid="uuid"></y-discuss>
    <div>-----------rich-----------</div>
    <y-rich @onEscape="onEscape"></y-rich>
    <div>-----------tag-----------</div>
    <div>-----------dialog-----------</div>
    <div>
      <button @click="onDialog('alert')">dialog.alert</button>
      <button @click="onDialog('confirm')">dialog.confirm</button>
      <button @click="onDialog('prompt')">dialog.prompt</button>
      <button @click="onDialog('password')">dialog.password</button>
    </div>
    <div class="test" v-ripple>
      <div >
        <div style="width: 300px; height: 150px; display: flex; align-items: center; justify-content: center; background: #333; color: #fff;"> useRipple 水波纹按下效果 </div>
      </div>
      <div><button v-login="onLogin">触发登录</button></div>
      <div><button @click="load">加载load</button></div>
      <div><button v-copy="copy">复制内容</button></div>
      <div><button @click="onPayment">发起付款</button></div>
      <div>
        <button @click="onFetch('api')">网络请求 - api</button>
        <button @click="onFetch('vip')">网络请求 - vip</button>
      </div>
      <div>
        <button @click="onMessage">useMessage 弹窗</button>
        <button @click="onPlus">usePlus sso 弹窗</button>
        <button @click="onLabel">换一组label的data</button>
        <button v-login="onligon">登录指令</button>
      </div>
      <div></div>
      <div></div>
    </div>
  </main>
</div>
</template>
<script setup>
import { inject, reactive, ref, toRefs } from 'vue'

const useFetch = inject('useFetch')
console.log('useFetch', useFetch)
// const usePayment = inject('usePayment')
// const useDialog = inject('useDialog')
// const useLogin = inject('useLogin')
// const useMessage = inject('useMessage')
// const usePlus = inject('usePlus')
// ----------
// useLogin().then(res=>{
//   console.log('useLogin.then',res)
// }).catch(err=>{
//   console.log('useLogin.err',err)
// })

const onligon = (res)=>{
  console.log('onligon',res)
}
const login_success = (res)=>{
  console.log('login_success',res)
}
const onEscape = (e)=>{
  console.log('onEscape',e)
}
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
//
const onDialog = (type)=>{
  // console.log(useDialog().alert())
  const action = {
    'alert':()=>{
      useDialog('alert',{
        title:'标题',
        content:'内容'
      })
    },
    'password':()=>{
      useDialog('password',{
        title:'请输入支付码',
        // content:'请查看邮件(<small>支付码本次有效</small>)',
        // 特殊  pattern type size
        random:'ccc',
        // 特殊
        submit:'确认支付',
        cancel:'取消',
        // confirm:'s66'
      },false).then(res=>{
        console.log(res)
      }).catch(e=>{
        console.log(e)
      })
    }
  }
  action[type] ? action[type]() : console.log(`${type} error`);
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
  let msg = Math.random().toString(32);

  useMessage('success',`购物成功-${msg}=`)
  // useMessage('info',{})
  // useMessage('error',{})
  // useMessage('warning',{})
  // useMessage('warning',{})
  // useMessage('notice',{})

}
const onLogin = ()=>{
  useMessage('success',{text:'登录成功'})
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
 