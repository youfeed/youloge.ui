<template>
  <div class="inline-block">
    <template v-for="(item, index) in options" :key="index">
      <label class="cursor-pointer">
        <input type="checkbox" class="display-none" :id="`${uuid}-${index}`" :name="props.name" :checked="props.checked" :value="props.value" v-model="value" @change="onChange(item)" />
        <span class="checkbox-custom" :id="`${uuid}-${index}`"></span>
        <span class="ml-2">{{ item.label }}</span>
      </label>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs, inject } from 'vue'
const props = defineProps({
    form: {
        type: String,
        default: '23',
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
}), emits = defineEmits(['change']);
const state = reactive({
    value: true,
    uuid: 'switch' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    options: props.options.map(({ value, label, checked = false, disabled = false }) => {
        return { value, label, checked, disabled }
    })
}), { uuid, value, options } = toRefs(state);
const onChange = (item) => {
    console.log('onChange',item)
}
</script>

<style>

</style>