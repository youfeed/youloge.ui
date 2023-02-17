<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <y-col span="24">
    <y-form>
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

<style scoped>
</style>
 