<template>
  <div class="y-currency"  :title="title"  @click="onClick">
    <div style="font-size: 1.8em;" class="y-default">
      <span style="font-size: .5em;">{{ rgb.char }}</span>
      <span style="font-size: 1.4em;margin-right: 5px;">{{ rgb.cash }}</span>
      <span style="font-size: .8em;">{{ rgb.key }}</span>
    </div>
    <Transition class="y-convert" mode="out-in">
      <div :key="txt.key">
        <span style="font-size: .5em;">≈ {{ txt.char }}</span>
        <span style="font-size: 1.4em;margin-right: 5px;">{{ txt.cash }}</span>
        <span style="font-size: .8em;">{{ txt.key }}</span>
      </div>
    </Transition>
  </div>
</template>
<script>
export default { name:'yRgba' }
</script>
<script setup>
import { computed, nextTick, onMounted, reactive, toRefs } from 'vue'
const state = reactive({
  init:0,
  timer:null,
  rgba:['RGB','#',1.00],
  rate:[
    ['CNY','￥',1.00],
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
  let cash = (props.value / 100 * dec).toFixed(4);
  onClear();state.timer = setTimeout(()=>{
    state.init = (state.init+1) % state.rate.length;
  },5000);
  return {key:key,char:char,cash:cash}
})
const rgb = computed(()=>{
  let [key,char,dec] = state.rgba;
  let cash = (props.value / 100 * dec).toFixed(2);
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
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .y-convert{
    margin-top: -10px;
  }
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease-in-out;
}

.v-enter-from {
  opacity: 0;
  transform: translateY(0px);
}

.v-leave-to {
  opacity: 1;
  transform: translateY(-10px);
}
</style>