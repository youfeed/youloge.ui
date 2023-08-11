<template>
  <transition>
    <div class="y-mask-flex" v-show="show" @click="onClose">
      <div class="y-dialog" ref="ref">
        <form @submit.prevent="onSubmit">
          <div class="y-dialog-head" v-if="props.params.title">
            <div class="y-dialog-title" v-html="props.params.title"></div>
          </div>
          <div class="y-dialog-body">
            <div class="y-dialog-prompt" v-if="props.method=='prompt'">
              <div class="y-dialog-input">
                <div class="form-item">
                  <input id="input" :type="props.params?.type" :placeholder="props.params?.placeholder" :pattern="props.params?.pattern" v-model="value">
                  <label for="input" :title="props.params?.label" data-title="✔"></label>
                </div>
              </div>
            </div>
            <div class="y-dialog-password" v-if="props.method=='password'">
              <div class="form-item">
                <input id="code" type="text" v-model="value" required pattern="[abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}" minlength="5" maxlength="5" autocomplete="off" style="text-transform: uppercase; letter-spacing: 1.8em;">
                <label for="code" :title="`支付码-${props.params?.random}`" data-title="✔" style="text-transform: uppercase;"></label>
              </div>
            </div>
            <div class="y-dialog-content" v-if="props.params.content" v-html="props.params.content"></div>
          </div>
          <div class="y-dialog-foot">
            <input class="y-dialog-cancel" type="button" @click.stop="onCancel" :value="props.params.cancel" v-if="props.params.cancel">
            <input class="y-dialog-confirm" type="button" @click.stop="onConfirm" :value="props.params.confirm" v-if="props.params.confirm">
            <input class="y-dialog-submit" type="submit" :value="props.params.submit" v-if="props.params.submit">
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
export default { name:'yDialog'}
</script>
<script setup>
import { onMounted, reactive, toRefs } from 'vue';
// confirm prompt alert password  login
const props = defineProps({
  method:String,
  params:Object,
  shadeClose:Boolean,
  onCallback:Function
})
console.log(props)
onMounted(()=>{
  state.show = true;
})
const state = reactive({
  ref:null,
  show:false,
  value:''
})
const onSubmit = ()=>{
  props.onCallback({emit:'success',data:{type:'submit',value:state.value}})
}
const onConfirm = ()=>{
  props.onCallback({emit:'success',data:{type:'confirm'}})
}
const onCancel = ()=>{
  props.onCallback({emit:'cancel',data:{type:'cancel'}})
}
const onClose = (e)=>{
  console.log(e)
  props.shadeClose && (state.ref?.contains(e.target) || props.onCallback({emit:'close',data:{type:'shadeClose'}}))
}
const {show,value,ref} = toRefs(state);
// defineExpose({onShow});
</script>
<style lang="scss">
.y-mask-flex{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(32,33,36,.6);
  z-index: 999999;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.y-dialog{
  margin-top: -20%;
  background: #fff;
  border-radius: 8px;
  max-width: 520px;
  min-width:360px;
  .y-dialog-head{
    padding: 10px;
    .y-dialog-title{
      font-size: 22px;
      color: #3c4043;
      font-weight: 400;
    }
  }
  .y-dialog-body{
    padding: 10px;
    .y-dialog-content{
      font-size: 18px;
      color: #80868b;
    }
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
    .y-dialog-password{
      .form-item{
        position: relative;
        margin-bottom: 10px;
        input:valid + label::before,
        input:focus + label::before {
          line-height: 20px;
          font-size: 14px;
          top: -10px;
          background: #fff;
          padding: 0 6px;
          left: 9px;
        }
        input {
          text-align: center;
          width: 100%;
          line-height: 43px;
          padding: 0 15px;
          box-sizing: border-box;
          font-size: 14px;
          color: #222;
          border: 1px solid #ccc;
          border-radius: 3px;
        }
        input:focus {
          outline: 0;
          border-color: blue;
        }
        input:valid + label::before {
          content: attr(data-title);
        }
        input:focus + label::before {
          color: blue;
        }
        label::before {
          content: attr(title);
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 15px;
          line-height: 43px;
          font-size: 14px;
          color: #777;
          transition: 300ms all;
        }
      }
    }
  }
  .y-dialog-foot{
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 10px;
    input{
      background: transparent;
      outline: 0;
      border: 0;
      width: 100%;
      height: 45px;
      font-size: 16px;
      letter-spacing: .2em;
      cursor: pointer;
      &:hover{
        opacity: .6;
      }
    }
    .y-dialog-cancel{
      color: #1a73e8;
    } 
    .y-dialog-confirm{
      color: #1a73e8;
    } 
    .y-dialog-submit{
      color: #1a73e8;
    }
  }
}
</style>