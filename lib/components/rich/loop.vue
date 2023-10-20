<template>
  <template v-for="({type,text,children,...the},index) in props.list" :key="index">
    <template v-if="!type">
      <template v-if="the.bold"><component :is="`strong`">{{ text }}</component></template>
      <template v-else-if="the.through"><component :is="`s`">{{ text }}</component></template>
      <template v-else-if="the.italic"><component :is="`em`" :style="[the.bgColor&&`background-color:${the.bgColor};`,the.color && `color:${the.color}`] ">{{ text }}</component></template>
      <template v-else>{{ text }}</template>
    </template>
    <template v-else>
      <template v-if="type == 'video'"><div v-html="the.src" style="aspect-ratio: 16/9; width: 100%; border-radius: 10px;"></div></template>
      <template v-else>
        <component :is="tags(type)" :src="the.url || the.src" :href="the.url" :alt="the.alt" :tag="type" :class="the.language && `language-${the.language}`" :target="type=='link' && '_blank'">
          <rich-loop :list="children" v-if="children"></rich-loop>
          {{ text }}
        </component>
      </template>
    </template>
  </template>
</template>

<script setup>
defineOptions({ name: 'rich-loop',inheritAttrs:false });
import { toRefs,reactive } from "vue";
const props = defineProps(['list']);
const tags = (tag)=>{
  // console.log(tag);
  let tagName = {
    'paragraph':'p',
    'blockquote':'blockquote',
    'video':'iframe',
    // 'todo':'input',
    'header2':'h2',
    'pre':'pre',
    'code':'code',
    'link':'a',
    'image':'img',
  };
  return tagName[tag] || 'span'
}
const state = reactive({
  tags:{

  },
})
// const {tags} = toRefs(state)
</script>

<style>

</style>