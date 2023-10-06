<template>
  <div class="y-currency" :title="title"  @click="onClick">
    <Transition class="y-currencys" mode="out-in" >
      <div :key="rgb.key">
        <span style="font-size: .5em;">≈ {{ rgb.char }}</span>
        <span style="font-size: 1.4em;margin-right: 5px;">{{ rgb.cash }}</span>
        <span style="font-size: .8em;">{{ rgb.key }}</span>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { computed, nextTick, onMounted, reactive, toRefs } from 'vue'
defineOptions({ name: 'y-rgb',inheritAttrs:false });const props = defineProps(['value']);
const state = reactive({
  init:0,
  timer:null,
  updated:'2023-08-08 10:12:31',
  rates:[
    {'abbr':'CNY','symbol':'¥','rate':'0.9999'}
  ],
  rate:[
    ['CNY','¥',0.9999],
    ['HKD','$',1.0832],
    ['USD','$',0.1387],
    ['JPY','¥',19.8759],
    ['EUR','€',0.1263],
    ['GBP','£',0.1087],
  ],
  title:`汇率换算为预估值：\n实际结算以RGB为准\n2023-08-08 10:12:31`
})
onMounted(()=>onTimer())
const rgb = computed(()=>{
  let {init,rate} = state;
  let [key,char,dec] = rate[init];
  let cash = (props.value / 100 * dec).toFixed(4);
  return {key:key,char:char,cash:cash}
})
const onTimer = ()=>{
  state.timer = setInterval(()=>{
    state.init = (state.init+1) % state.rate.length;
  },5000);
}
const onClick = ()=>{
  state.timer && clearInterval(state.timer);
  state.init = (state.init+1) % state.rate.length;
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
  transition: all 0.5s;
}

.v-enter-from {
  opacity: 0;
  transform: translateZ(0px);
}

.v-leave-to {
  opacity: 1;
  transform: translateZ(-10px);
}
</style>