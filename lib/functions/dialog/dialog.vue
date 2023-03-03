<template>
  <transition>
    <div class="y-mask" v-show="show">
      <div class="y-dialog">
        <div class="y-dialog-head" v-show="props.title">
          <div class="y-dialog-title">{{props.title}}</div>
        </div>
        <div class="y-dialog-body">
          <div class="y-dialog-content">{{props.content}}</div>
          <div class="y-dialog-input" v-show="['prompt'].includes(props.method)">
            <input :type="props.type" :placeholder="props.placeholder" v-model="value">
          </div>
        </div>
        <div class="y-dialog-foot">
          <button class="y-dialog-cancel" @click="onCancel" v-show="['confirm','prompt'].includes(props.method)">取消</button>
          <button class="y-dialog-confirm" @click="onConfirm" v-show="['alert','confirm'].includes(props.method)">确认</button>
          <button class="y-dialog-submit" @click="onSubmit" v-show="['prompt'].includes(props.method)">提交</button>
        </div>
        <div class="y-dialog-close" @click="onClose">&#8709;</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  components: { input }, name:'yDialog'}
</script>
<script setup>
import { onMounted, reactive, toRefs } from 'vue';
import input from '../../components/input/input.vue';
const props = defineProps({
  method:String,
  type:String,
  title:String,
  content:String,
  placeholder:String,
  onCallback:Function
})
onMounted(()=>{
  state.show = true;
})
const state = reactive({
  show:false,
  value:''
})
// 
const onShow = (type,config)=>{

}
const onSubmit = ()=>{
  props.onCallback({emit:'submit',data:state.value})
}
const onConfirm = ()=>{
  props.onCallback({emit:'confirm',data:'点击确认按钮'})
}
const onCancel = ()=>{
  props.onCallback({emit:'cancel',data:'点击取消按钮'})
}
const onClose = ()=>{
  props.onCallback({emit:'close',data:'关闭弹窗'})
}
const {show,value} = toRefs(state);
defineExpose({onShow});
</script>
<style lang="scss">
.y-dialog{
  position: relative;
  margin-top: -40vh;
  background: #fff;
  border-radius: 5px;
  padding: 10px;
  min-width: 240px;
  .y-dialog-head{
    height: 30px;
    .y-dialog-title{
      font-size: 18px;
      color: #333;
    }
  }
  .y-dialog-body{
    margin-bottom: 10px;
    max-width: 360px;
    .y-dialog-input{
      padding: 5px 0; width: 100%;
      input{
        border: 0;
        outline: 0;
        border-bottom: 1px solid #333;
        width: 100%;
        transform: .3s all;
        &:focus{
          padding: 5px;
          border:1px solid #4caf50;
          border-radius: 5px;
        }
      }
    }
  }
  .y-dialog-foot{
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    button{
      outline: 0;
      padding: 4px 12px;
      border: 0;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      &:hover{
        opacity: .6;
      }
    }
    .y-dialog-cancel{
      color: #666;
    } 
    .y-dialog-confirm{
      background: #03a9f4;
      color: #fff;
    } 
    .y-dialog-submit{
      background: #4caf50;
      color: #fff;
    }
  }

  .y-dialog-close{
    cursor: pointer;
    position: absolute;
    width: 30px;
    height: 30px;
    top: 0;
    right: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover{
      background-color: #f1f1f1;
    }
  }
}

</style>