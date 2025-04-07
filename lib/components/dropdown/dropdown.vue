<template>
    <div ref="dropdown" class="relative inline-block">
        <div class="flex items-center rounded  border-1 border-solid border-transparent hover:border-gray-200 p-1 hover:bg-gray-100">
            <slot></slot>
            <div @click="onToggle" ref="trigger" class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#dedede" d="m12 16.5l7-7H5z"/></svg>
            </div>
        </div>
        <dialog ref="dialog" :open="visible" :style="positionStyle"
            class="absolute z-50 min-w-32 bg-white shadow-lg rounded border p-0 m-0 outline-none">
            <div class="" >
                <slot name="content"></slot>
            </div>
        </dialog>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch,nextTick } from 'vue'
const props = defineProps({
    border: Boolean
}),emits = defineEmits([]);
const dropdown = ref(null)
const trigger = ref(null)
const visible = ref(false)
const dialog = ref(null);
// 采用Ref：dropdown 相对位置
const positionStyle = computed(() => {
    const dropdownRect = dropdown.value?.getBoundingClientRect();
    if (!dropdownRect) {return {};}
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const leftWidth = dropdownRect.left + dropdownRect.width / 2;
    const topHeight = dropdownRect.top + dropdownRect.height / 2;
    var positions = {};
    if(leftWidth < windowWidth / 2){
        positions.left = '0px'
    }else{
        positions.right = '0px'
    }
    if(topHeight < windowHeight / 2){
        positions.top = '0px'
    }else{
        positions.bottom = 5 + dropdownRect.height + 'px'
    }
    console.log(dropdownRect,positions)
    return {
        ...positions,
        position: 'absolute',
        width: 'w-fit',
        height: 'auto'
    }
})
// 打开对话框
const openDialog = () => {
  if (!dialog.value) return
//   dialog.value.showModal()
  visible.value = true
  // 阻止对话框默认的点击关闭行为
  dialog.value.addEventListener('click', preventDefault)
  // 添加点击外部关闭
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 0)
}
// 关闭对话框
const closeDialog = () => {
  if (!dialog.value) return
//   dialog.value.close()
  visible.value = false
  dialog.value.removeEventListener('click', preventDefault)
  document.removeEventListener('click', handleClickOutside)
}
// 阻止默认事件
const preventDefault = (e) => {
  e.preventDefault()
}
// 点击外部关闭
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    closeDialog()
  }
}
// 添加和移除事件监听
onMounted(() => {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
  
  // 确保对话框已关闭
  if (dialog.value && visible.value) {
    dialog.value.close()
  }
})
// 更新位置
const updatePosition = () => {
  if (visible.value) {
    // 重新定位
    applyPosition()
  }
}
// 应用位置
const applyPosition = () => {
  if (!dialog.value || !visible.value) return
  const style = positionStyle.value
  Object.keys(style).forEach(key => {
    dialog.value.style[key] = style[key]
  })
}
// 监听位置或可见性变化
watch([() => props.placement, visible], () => {
  if (visible.value) {
    nextTick(() => applyPosition())
  }
})
const onToggle = (e) => {
    console.log(e)
    visible.value ? closeDialog() : openDialog();
}


</script>

<style>

</style>