<template>
  <div class="y-video">
    <iframe ref="ref" :src="src" allowfullscreen></iframe>
  </div>
</template>

<script>
export default { name:'yVideo'}
</script>
<script setup>
import { onMounted, reactive, toRefs } from "vue";
const emit = defineEmits(['play']);
const props = defineProps({ uuid:String });
const state = reactive({ref:null,src:null});
onMounted(()=>{
  state.src = `https://open.youloge.com/video#hash`;
})
const play = ()=>{
  
}
const {ref,src} = toRefs(state)
</script>
<style lang="scss">
.player{
  height: 0;
  width: 100%; 
  position: relative;
  padding-top: 56.2%;
}
.played{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .video{
    position: relative;
    z-index: 1;
    video{
      width: 100%;
      height: 100%;
    }
  }
  .panel{
    bottom: 0;
    position: absolute;
    color: #fff;
    width: 100%;
    height: 60px;
    padding: 0 5px;
    background: #ffffff29;
    z-index: 2;
    .progress{
      position: relative;
      background: #686868;
      height: 5px;
      border-radius: 5px;
      .isplay{
        position: absolute;
        width: 50%;
        height: 5px;
        background: #f00;
        border-radius: 5px;
      }
      .buffer{
        position: absolute;
      width: 60%;
      height: 5px;
      background: #ff0;
      border-radius: 5px;
      }
      .swatch{

      }
    }
  }
  .controls{
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: start;
      .play{
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
        cursor: pointer;
      }
    }
    .right{
      display: flex;
      align-items: center;
      .setting,.fullscreen{
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
        cursor: pointer;
      }
    }
  }
}

</style>