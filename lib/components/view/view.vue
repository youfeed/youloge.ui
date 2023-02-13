<template>
  <component :is="Component"><slot/></component>
</template>

<script>
import { computed, provide, shallowRef } from 'vue'
import { render } from 'vue';
export default { name:'rView'}
</script>
<script setup>
const props = defineProps({
  name:{
    type:String,
    default:'defult'
  },
  route:Object
})
const currentName = props.name
const matchedRoute = props.route
let Component = matchedRoute && matchedRoute.components[currentName]

const shallow = shallowRef({
  name:'',
  path:''
})

provide('route',props)
</script>
<style>

</style>