<template>
  <div class="details">
    <menuItem :items="props.items"></menuItem>
    <!-- <template v-for="item in props.items" :key="item.id">
        <div class="detail">
            <span>{{ item.title }}</span>
        </div>
        <template v-if="item.children" >
            <template v-for="child in item.children" :key="child.id">
                <div class="details"></div>
            </template>
        </template>
    </template> -->
  </div>
</template>
<!-- 
**
 * @title 菜单组件
 * @icon 菜单组件
 * @spread 菜单组件
 * @children 菜单组件
 * @icon 菜单组件
 * @icon 菜单组件
**
 -->
<script setup>
import menuItem  from './item.vue';
import { defineComponent,defineProps, defineEmits } from "vue";
const Menu = defineComponent({
    name:'Menu',
    props:{
        items:{
            type:Array,
            default:[]
        }
    },
    emits:[],
    setup(props,emits){
    }
});
const props = defineProps({
    items:{
        type:Array,
        default:[]
    }
}),emits = defineEmits([]);
// 处理数据
const toData = ({title,icon,spread,children})=>{
    return {
        uuid:Math.random().toString(36).substring(2, 9),
        title,
        icon,
        spread,
        children:children?.map(item => toData(item))
    }
}
// const data = props.item.map(item => toData(item))
// console.log(data)
// head



</script>

<style>

</style>