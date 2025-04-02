
<template>
  <y-header aria="网盘" logo="Youloge" @search="onSearch"></y-header>
<div>
  <hash-view></hash-view>
  <main max-w-200 mx-a>
    <y-link type="primary" href="https://www.baidu.com">2333</y-link>
    <div class="line">
      <yButton>default</yButton>
      <yButton type="primary">primary</yButton>
      <yButton type="secondary">secondary</yButton>
      <yButton type="accent">accent</yButton>
      <yButton type="success">success</yButton>
      <yButton type="info">info</yButton>
      <yButton type="warning">warning</yButton>
      <yButton type="error">error</yButton>
      <yButton type="outline">outline</yButton>
    </div>
    <div class="line">
      <yTable :columns="table_columns"  :data="table_data">
        <yTableColumn label="姓名" prop="name"></yTableColumn>
        <yTableColumn label="年龄" prop="age"></yTableColumn>
        <yTableColumn label="性别" prop="sex"></yTableColumn>
        <yTableColumn label="操作">
          <template #default="{ row }">
            <yButton type="primary" @click="onEdit(row)">编辑</yButton>
            <yButton type="error" @click="onDelete(row)">删除</yButton>
          </template>
        </yTableColumn>
      </yTable>
    </div>

    <div>-----------<a @click="onGoods">点击加载 useGoods</a>-----------</div>
    <div>-----------<a href="#hello">点击加载 HashView#hello</a>-----------</div>



  </main>
</div>
</template>
<script setup>
import { inject, reactive, ref, toRefs } from 'vue'

const table_columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '性别', key: 'sex' }
];
const table_data = [
  { name: '张三', age: 20,sex:'男' },
  { name: '李四', age: 21,sex:'女' },
  { name: '王五', age: 22,sex:'男' },
  { name: '赵六', age: 23,sex:'女' },
];

const useStorage = inject('useStorage')
const useFetch = inject('useFetch')
console.log('useStorage', useStorage('_grecaptcha'))
const useMessage = inject('useMessage')
const onSearch = (data)=>{
  console.log('onSearch', data)
}
const onNavigate = (data)=>{
  let {uuid} = data
  window.open(`https://youloge.com/profile?u=${uuid}`,'profile')  
  console.log('onNavigate', data)
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
 