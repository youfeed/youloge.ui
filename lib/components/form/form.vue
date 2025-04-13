<template>
  <form @submit.prevent="onSubmit" class="w-full">

    <slot></slot>
  </form>
</template>

<script setup>
import { useValidate } from '@lib/utils'
import { computed, reactive, toRefs, provide,inject } from 'vue'
// 所有子组件的验证函数
const validators = new Map();
const props = defineProps({
    form: {
        type: String,
        default: '23',
    },
}),model = defineModel({required: false}), emits = defineEmits(['change']);
// 提供注册验证函数的方法
const setRules = (name, rules) => {
    validators.set(name, rules);
    console.log('setRules',name,rules)
};
const deleteRules = (name) => {
    validators.delete(name);
    console.log('delete',name)
};
const pushValidator = (name, validator) => {
    console.log('pushValidator',name,validator)
    validators.set(name, validator);
};
//  
const onSubmit = (e) => {
    e.preventDefault()
    console.log('validators',validators.size)
    validators.forEach((validator) => {
        console.log('validator',validator(useValidate))
    });
    console.log('model',model)
    console.log('onSubmit',e)
}
// 抛出上下文
provide('formContext', {
    pushValidator,deleteRules,setRules
});

</script>

<style>

</style>