<template>
  <transition>
    <div class="y-login" v-show="data.show">
        <div class="y-login-flex">
          <div class="y-login-head" >
            <div>登录·注册</div>
            <div @click="onClose" class="y-login-close">x</div>
          </div>
          <div class="y-login-boby">
            <div class="y-login-pass">
              <input type="email" :class="passClass" placeholder="安全邮箱" v-model="pass"/>
            </div>
            <div class="y-login-word">
              <input type="text" :class="wordClass" placeholder="验证码" v-model="word"/>
              <button @click="onCode" :class="codeClass">{{data.msg}}</button>
            </div>
          </div>
          
          <div class="y-login-foot">
          <button @click="onSubmit" :class="submClass">确认</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, inject, onMounted, reactive, toRefs } from 'vue'
export default { name:'yLogin' }
</script>
<script setup>
const data = reactive({
  step:null,
  show:false,
  pass:'',
  word:'',
  sign:'',
  msg:'获取验证码'
})
onMounted(()=>{
  data.show = true
})
const onFetch = (method,params)=>{
  return fetch('//api.youloge.com',{method:'post',body:JSON.stringify({method:method,params:params})}).then(r=>r.json()).then(res=>{
    return res
  }) 
}
const props = defineProps({
  onClose:Function,
  onSuccess:Function
})
const passClass = computed(()=>{
  return [
    {
      'y-stop': data.sign !== ''
    }
  ]
})
const wordClass = computed(()=>{
  return [
    {
      'y-stop': data.sign == ''
    }
  ]
})
const codeClass = computed(()=>{
  return [
    {
      'y-stop':!((/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).exec(data.pass) && data.sign == '')
    }
  ]
})
const submClass = computed(()=>{
  return [
    {
      'y-stop':!(data.word.length == 6 && data.sign !== '')
    }
  ]
})
const onClose = ()=>{
  props.onClose()
}
const onCode = ()=>{
  data.sign = true
  onFetch('register',{mail:data.pass}).then(res=>{
    let {random,signer} = res.data,second = 120
    let timer = setInterval(()=>{
      data.sign = signer
      data.msg = `${random}(${--second}s)`
      if(second < 0){
        data.sign = ''
        data.msg = '重新获取'
        clearTimeout(timer)
      }
    },1000)
    console.log('onCode',res)

  })
}
const onSubmit = ()=>{
  onFetch('login',{pass:data.sign,word:data.word}).then(res=>{
    let {access,expire} = res.data
    localStorage.setItem('token',access)
    localStorage.setItem('expire',expire)
    props.onClose()
    props.onSuccess()
  })
}

const {pass,word,sign,msg} = toRefs(data)
</script>
<style lang="scss">
.y-login{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0c0c0c6e;
  .y-login-flex{
    margin-top: -20%;
    min-width: 280px;
    background: #fff;
    padding: 10px;
    box-shadow: 1px 2px 5px 1px #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
  }
  .y-login-head{
    font-size: 18px;
    border-bottom: 1px solid #999;
    height: 34px;
    width: 100%;
    text-align: center;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .y-login-close{
      font-size: 17px;
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }
  .y-login-boby{
    width: 100%;
    .y-login-pass,.y-login-word{
      position: relative;
      margin: 20px 0;
      width: 100%;
      border: 1px solid #eee;
      input{
        width: 100%;
        padding: 10px;
        outline: 0;
        border: 0;
      }
      button{
        position: absolute;
        right: 0;
        height: 100%;
        border: 0;
        background: transparent;
        padding: 0 10px;
        color: #2196f3;
        cursor: pointer;
      }
    }
  }
  .y-login-foot{
    margin-top: 20px;
    width: 100%;
    button{
      width: 100%;
      padding: 10px;
      background: #007fff;
      color: #fff;
      border: 0;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
</style>