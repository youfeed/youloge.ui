<template>
    <fieldset>
        <legend class="text-sm">{{props.label}}</legend>
        <div class="y-radio relative text-md py-1">
          <div class="flex gap-5">
              <template v-for="(item,index) in options" :key="index">
                  <label class="vertical-middle cursor-pointer " :class="{
                      ' text-blue-500':item.checked,
                  }">
                      <input type="checkbox" class="display-none" :name="name" :checked="props.checked" @change="onChange(item)"/>
                      <div class="flex items-center justify-center gap-1">
                              <div class="w-1.5em h-1.5em">
                                <svg class="w-1.5em h-1.5em absolute" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>
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
import { onUnmounted, reactive, toRefs, watch,inject } from 'vue'
const { setRules,deleteRules } = inject('formContext');
let symbol = Symbol('uuid');
const props = defineProps({
    label: {
        type: String,
        default: '多选',
    },
    name: {
        type: String,
        default: '',
        required: true,
    },
    options: {
        type: Array,
        required: true,
        default: [],
    }
}),model = defineModel({required: true}), emits = defineEmits(['change']);
const state = reactive({
    name: 'true',
    uuid: 'switch' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    options: props.options.map(({ value, label, checked = false, disabled = false }) => {
        return { value, label, checked, disabled }
    })
}), { uuid,name,options } = toRefs(state);
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