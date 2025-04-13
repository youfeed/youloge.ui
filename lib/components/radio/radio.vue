<template>
    <fieldset>
        <legend class="text-sm">{{props.label}}</legend>
        <div class="y-radio relative text-md py-1">
          <div class="flex gap-5">
              <template v-for="(item,index) in options" :key="index">
                  <label class="vertical-middle cursor-pointer " :class="{
                      ' text-blue-500':item.checked,
                  }">
                      <input type="radio" class="display-none" :name="name" :checked="props.checked" @change="onChange(item)"/>
                      <div class="flex items-center justify-center gap-1">
                              <div class="w-1.5em h-1.5em">
                                  <svg class="w-1.5em h-1.5em absolute" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
                                  <svg class="w-1.5em h-1.5em absolute" v-show="item.checked" fill="currentColor" viewBox="0 0 24 24"><path d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z"></path></svg>
                              </div>
                          <div class="">{{item.value}}button</div>
                      </div>
                  </label>
              </template>
          </div>
        </div>
    </fieldset>
</template>

<script setup>
import { computed, reactive, toRefs,inject, watch,onUnmounted } from 'vue'
const { setRules,deleteRules } = inject('formContext');
let symbol = Symbol('uuid');
const props = defineProps({
    label:{
        type:String,
        default:'单选',
    },
    rules:{  
        type:[String,Array,Function],
        default:'',
    },
    options:{
        type:Array,
        required:true,
        default:[],
    }
}),model = defineModel({required: false}),emits = defineEmits(['change']);
const state = reactive({
    uuid:'radio'+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    name:'name',
    options:props.options.map(({value,label,checked=false,disabled=false}) => {
        return {value,label,checked}
    })
}),{uuid,name,options} = toRefs(state);
// 验证函数
const onValidator = (value) => {
    console.log('onValidator.model.10000000',model.value)
    return {err:400,'msg':'验证失败'}
}
// 监听value变化
const onChange = (item)=>{
    state.options.forEach((it) => {
        it.checked = false;
    });
    item.checked = true;
    model.value = item.value;
    console.log('onClick',item) 
}
// 监听value变化
watch(props, (newValue, oldValue) => {
    // 注册验证函数
    newValue.rules && setRules(symbol,onValidator)
    console.log('watch', newValue, oldValue);
},{deep:true,immediate:true});
// 销毁验证函数
onUnmounted(() => {
    deleteRules(symbol);
})
</script>

<style lang="scss">

</style>