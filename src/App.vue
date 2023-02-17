
<template>
  <y-col span="24">
    <y-form :model="draft">
      <y-input>email</y-input>
      biaodan
    </y-form>
  </y-col>
  <y-col sm="12" md="3" offset="2">
    <y-button type="primary" size="medium">
      button
    </y-button>
    <y-link href="https://vuejs.org/" target="_blank" type="primary">
      <img src="./assets/vue.svg" class="logo vue ad ads" alt="Vue logo" />
    </y-link>
  </y-col>

  <HelloWorld msg="Vite + Vue" />
</template>
<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
const draft = ref({x:123})
</script>

<style scoped>
</style>
 