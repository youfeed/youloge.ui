<template>
    <div class="inline-block">
        <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" class="hidden peer" :name="props.name" v-model="value" @change="onChange()" checked>
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 relative">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-300">ssss</span>
            </div>
        </label>
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
    // emits('change', e.target.value);
}
</script>

<style></style>