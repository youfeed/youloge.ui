<template>
  <div class="container">描述：这是一个嵌套的Vue实例/组件。其中包含了一个嵌</div>
  <KeepAlive>
    <component :is="Component"><slot/></component>
  </KeepAlive>
</template>

<script>
export default { name:'rView'}
</script>
<script setup>
import { computed, provide, shallowRef } from 'vue'
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