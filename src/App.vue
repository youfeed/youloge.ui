
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
<!-- 
  <br>
  <br>
  <br>
  <br> -->
  <!-- <y-row gutter="20" justify="end">
    <y-col span="12">
      <y-form size="large">
        <y-form-item label="邮箱">
          <y-input placeholder="请输入邮箱">email</y-input>
        </y-form-item>
        <y-form-item label="密码">
          <y-input type="password"></y-input>
        </y-form-item>
        <y-button aria-type="submit" >登陆·注册</y-button>
      </y-form>
    </y-col>
    <y-col span="12" >
      1222
      <y-icon class="y-icon y-icon-redo" type="plus" color="red" size="16"></y-icon>
      <y-icon class="y-icon y-icon-redo" type="search" color="blue" size="32"></y-icon>
      <y-icon class="y-icon y-icon-redo" type="redo" color="red" size="16"></y-icon>
    </y-col>
  </y-row>

  <y-row>
    <y-col sm="12" md="3" offset="2">
      <y-button type="primary" size="medium" @click="load">
        button
      </y-button>
      <y-link href="https://vuejs.org/" target="_blank" type="primary">
        <img src="./assets/vue.svg" class="logo vue like likes ads" alt="Vue logo" />
      </y-link>
    </y-col>
  </y-row> -->
</div>
</template>
<script setup>
import { inject, ref, toRefs } from 'vue'


const useLoading = inject('useLoading')
const useMessage = inject('useMessage')
const useDialog = inject('useDialog')
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
 