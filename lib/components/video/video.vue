<template>
  <div class="player">
    <div class="played">
      <div class="video" @click="play">
        <video ref="vRef" src="https://media.w3.org/2010/05/sintel/trailer.mp4"></video>
      </div>
      <div class="panel">
        <div class="progress">
          <div class="buffer"></div>
          <div class="isplay"></div>
          <div class="swatch"></div>
        </div>
        <div class="controls">
          <div class="left">
            <div class="play" @click="play">&#x25BA;</div>
            <div class="time">12:00/60:30</div>
            <div class="time">&#x266A;</div>
          </div>
          <div class="right">
            <div class="setting">&#x2742;</div>
            <div class="fullscreen">&#x26F6;</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default { name:'yVideo'}
</script>
<script setup>
import { onMounted, ref } from "vue";
const props = defineProps({
  uuid:String
})
const vRef = ref(null)
const play = ()=>{
  vRef.value.paused ? vRef.value.play() : vRef.value.pause()
  console.log(vRef)
}
console.log(props)

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