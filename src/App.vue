
<template>
  <y-header aria="网盘" logo="Youloge" @search="onSearch"></y-header>
  
<div>
  <hash-view></hash-view>
  <main max-w-200 mx-a>

    <div>-----------<a @click="onGoods">点击加载 useGoods</a>-----------</div>
    <div>-----------video-----------</div>
    
    <y-discuss uuid="123456"></y-discuss>
    
    <!-- <y-video 
    uuid="8ZhtcE2n7wkp4Ho12RorUeYWytAtY" 
    mp4s="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4" 
    poster="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg"
    m3u8s="//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8"
    dash="//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/dash/xgplayer-demo-dash.mpd"
    ></y-video> -->
    <!-- <div>-----------rich-----------</div>
    <y-rich uuid="YjT7vRkQsCD8Po6gRg8p5C3z1m5Dj"></y-rich>


    <div>-----------yPayment- <button bg-blend-color-dodge bg-blue @click="onPayment">usePayment</button> ----------</div>
    <div id="payment"></div>
    <div><y-payment data="{}" @success="onSuccess" ></y-payment></div>
    <div>-----------ylogin-<button bg-blend-color-dodge bg-blue @click="onuseLogin">useLogin</button>----------</div>
    <button v-login="onLogin" class="bg-blend-color-dodge bg-blue" >v-login</button>
    <div id="login"></div>
    <y-login @success="login_success" @error="login_success" @progress="login_success"></y-login>
    <div class="bg-red">-----------rgb-----------</div>
    <div><y-rgb value="100">x</y-rgb></div>
    <div>-----------ads-----------</div>
    <y-ad style="width: 300px;margin: 0 auto;background: #888;"></y-ad>
    <div>-----------discuss-----------</div>
    <y-discuss uuid="Muuid"></y-discuss>

    <div>-----------header-----------</div>
    
    <div>-----------label-----------</div>
    <div>-----------disscus-----------</div>
    <y-discuss uuid="uuid"></y-discuss>
    
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
        <br/>
        <button v-login="onLogin">登录指令</button>
      </div>
      <div></div>
      <div></div>
    </div> -->
  </main>
</div>
</template>
<script setup>
import { inject, reactive, ref, toRefs } from 'vue'

const useStorage = inject('useStorage')
const useFetch = inject('useFetch')
console.log('useStorage', useStorage('_grecaptcha'))
// const usePayment = inject('usePayment')
// const useDialog = inject('useDialog')
// const useLogin = inject('useLogin')
const useMessage = inject('useMessage')
const onSearch = (data)=>{
  console.log('onSearch', data)
}
let useShopcart = inject('useShopcart')
const onGoods = ()=>{
  useShopcart({
    uuid:'YREqVnGW8euuNvVxrH2kVyFMS3LLP',
    mail:'11247005@qq.com', 
    selector:'#goods',
    notify:'https://www.youloge.com/notify'
  }).then(res=>{
    if(res.local){
      usePayment({
        local:res.local,
        money:3520
      })
    }
    console.log('useGoods.then',res)
  }).catch(err=>{
    console.log('useGoods.err',err)
  })
}
let usePayment = inject('usePayment');
const onPayment = ()=>{
  usePayment({
    selector:'#paymentc',
    mail:'11247005@qq.com', 
    local:'YREqVnGW8euuNvVxrH2kVyFMS3LLP', // drive YREqVnGW8euuNvVxrH2kVyFMS3LLP
    notify:'https://www.youloge.com/notify',
    money:1
  }).then(res=>{
    console.log('usePayment then',res)
  }).catch(err=>{
    console.log('usePayment catch',err)
  })
}
let useLogin = inject('useLogin');
const onuseLogin = ()=>{
  console.log('onuseLogin')
  useLogin({
    selector:'#logins',
    close:false
  }).then(res=>{
    console.log('useLogin then',res)
  }).catch(err=>{
    console.log('useLogin catch',err)
  })
}

const login_success = (res)=>{
  console.log('login_success',res)
}
const onEscape = (e)=>{
  console.log('onEscape',e)
}
const state = reactive({
  gallery_list:[
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
  ],
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
const {label_data,rich_data,gallery_list} = toRefs(state)
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
  useMessage('success','登录成功')
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
 