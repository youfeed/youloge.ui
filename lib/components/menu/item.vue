<template>
  <ul>
    <li v-for="(item, index) in items" :key="index" class="relative">
      <a :href="item.link" class="block p-4">
        {{ item.label }}
        <span v-if="item.children" class="ml-2">›</span>
      </a>
      <MenuList v-if="item.children" :items="item.children" />
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<style>

</style>