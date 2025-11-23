<template>
  <div class="y-card" :class="cardClass" :style="cardStyle">
    <div v-if="slots.header || title" class="y-card__header">
      <slot name="header">
        <h3 class="y-card__title">{{ title }}</h3>
      </slot>
    </div>
    <div class="y-card__body">
      <slot name="default"></slot>
    </div>
    <div v-if="slots.footer" class="y-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed,defineProps,useSlots } from 'vue';
const slots = useSlots();
const props = defineProps({
    title: String,
    subtitle:String,
    description:String,
    loading:{
        type:Boolean,
        default:false
    },
    border:{
        type:Boolean,
        default:true
    }
}),emits = defineEmits(['']);

// 
const cardClass = computed(()=>{


    return {
        'block p-1':true,
        'border': props.border
    }
});
const cardStyle = computed(()=>{

});
</script>

<style>

</style>