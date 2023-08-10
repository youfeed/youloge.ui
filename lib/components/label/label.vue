<template>
  <div class="y-label">
    <template v-for="(item,index) in data" :key="index">
      <span @click="onClick(item)" :class="[`y-label-${props.theme}`,{'y-label-chicked':item.checked}]">
        {{item.name}}
      </span>
    </template>
  </div>
</template>

<script>
export default {name:'yLabel'}
</script>
<script setup>
import { reactive, toRefs, watch } from 'vue'
const props = defineProps({
  color:{ type:String,default:'' },
  data: { type: Array,default: [] },
  theme:{ type:String,values:['success','info','warning','danger','default'],default:'default' },
  type:{ type:String,values:['radio','checkbox',''],default:'' },
})
const state = reactive({
  data:props.data.map(item=>({name:item,checked:false}))
})
const emit = defineEmits('onChange')
const onClick = (e) => {
  e.checked = !e.checked;
  state.data.sort((a, b) => b.checked - a.checked)
  emit('onChange',state.data.filter(item => item.checked).map(i=>i.name))
}
watch(
  ()=>props.data,
  (ref,ee)=>{
    state.data = ref.map(item=>({name:item,checked:false}))
  }
)
const {data} = toRefs(state)
</script>
<style lang="scss">
.y-label{
  display: flex;
  flex-wrap: wrap;
  grid-gap: 0.25rem;
  gap: 0.25rem;
  span{
    border-radius: 4px;
    padding: 1px 6px;
    cursor: pointer;
  }
  .y-label-default{
    color: #0f0f0f;
    background: #f1f1f1;
  }
  .y-label-chicked{
    color: #fff;
    background: #0f0f0f;
  }
}
</style>