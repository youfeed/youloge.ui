<template>
  <Transition class="y-currency" mode="out-in"  :title="title">
    <div :key="txt.key" @click="onClick">
      <span style="font-size: .5em;">{{ txt.char }}</span>
      <span style="font-size: 1.4em;margin-right: 5px;">{{ txt.cash }}</span>
      <span style="font-size: .8em;">{{ txt.key }}</span>
    </div>
  </Transition>
</template>
<script>
export default { name:'yRgba' }
</script>
<script setup>
import { computed, nextTick, onMounted, reactive, toRefs } from 'vue'
const state = reactive({
  init:0,
  timer:null,
  rate:[
    ['RGB','&',1.0000],
    ['CNY','￥',1.0000],
    ['HKD','$',1.0832],
    ['USD','$',0.1387],
    ['JPY','¥',19.8759],
    ['EUR','€',0.1263],
    ['GBP','￡',0.1087],
  ],
  title:`汇率换算为预估值：\n实际结算以RGB为准\n2023-08-08 10:12:31`
})
const props = defineProps({ value:String });
const txt = computed(()=>{
  let [key,char,dec] = state.rate[state.init];
  let cash = (props.value * dec).toFixed(4);
  onClear();state.timer = setTimeout(()=>{
    state.init = (state.init+1) % state.rate.length;
  },3000);
  return {key:key,char:char,cash:cash}
})
const onClick = ()=>{
  state.init = (state.init+1) % state.rate.length;
  nextTick(()=>{onClear()});
}
const onClear = ()=>{
  state.timer && clearTimeout(state.timer);
}
const {title} = toRefs(state);
</script>
<style  lang="scss"> 
.y-currency{
  display: inline;
  cursor: pointer;
  // height: 100%;
  // overflow: hidden;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease-in-out;
}

.v-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.v-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>