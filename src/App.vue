
<template>
  <div>
    <y-header aria="网盘" logo="Youloge" @search="onSearch"></y-header>
    <!-- <hash-view></hash-view> -->
    <main max-w-200 mx-a>
        <yDivider position="left">Icon</yDivider>
        <ySpace>
            <yIcon name="tabler:badge-8k" size="20" color="blue" />
            <yIcon name="weui:previous2-outlined" size="64" />
            <yIcon name="weui:email-outlined" size="20" />
            <yIcon name="weui:me-filled" size="32" color="blue" />
        </ySpace>
        <yDivider position="left">Link</yDivider>
        <y-space title="Link" size="sm">
            <y-link type="primary" href="https://www.baidu.com">2333</y-link>
            <y-link type="primary" href="https://www.baidu.com">2333</y-link>
        </y-space>
        <yDivider position="left">Button</yDivider>
        <ySpace title="Button" size="md" wrap>
            <yButton rounded="none"><yIcon name="weui:location-filled" size="12" />icon default</yButton>
            <yButton type="primary" @click="onButtonClick">primaryonClick</yButton>
            <yButton type="secondary" class="i-">secondary</yButton>
            <yButton type="accent" rounded="full">rounded accent</yButton>
            <yButton type="success">success</yButton>
            <yButton type="info">info</yButton>
            <yButton type="warning">warning</yButton>
            <yButton type="error">error</yButton>
            <yButton type="outline">outline</yButton>
            <yButton type="outline" disabled>disabled</yButton>
        </ySpace>
        <yDivider position="left">Table</yDivider>
        <div class="line">
            <yTable :columns="table_columns"  :data="table_data"></yTable>
        </div>
  </main>
</div>
</template>
<script setup>
import { inject, reactive, ref, toRefs } from 'vue'

const table_columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '性别', key: 'sex' }
];
const table_data = [
  { name: '张三', age: 20,sex:'男' },
  { name: '李四', age: 21,sex:'女' },
  { name: '王五', age: 22,sex:'男' },
  { name: '赵六', age: 23,sex:'女' },
];
const yMenu_items = [
  { title: '首页', path: '/' },
  { title: '商品', path: '/goods' },
  { title: '订单', path: '/order' },
  { title: '个人中心', path: '/user' },
];
const onButtonClick = (data) => {
  console.log(data)
}
const useStorage = inject('useStorage')

console.log('useStorage.then', useStorage('_grecaptcha'))

const useMessage = inject('useMessage')
const onSearch = (data)=>{
  console.log('onSearch', data)
}
const onNavigate = (data)=>{
  let {uuid} = data
  window.open(`https://youloge.com/profile?u=${uuid}`,'profile')  
  console.log('onNavigate', data)
}


const state = reactive({
  gallery_list:[
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
  ],
  label_data:['潇洒','a安抚','个','是德国','啊是服务'],
  rich_data:[{"type":"paragraph","children":[{"text":""}]},{"type":"list-item","children":[{"text":"saf"}],"ordered":true},{"type":"list-item","ordered":true,"children":[{"text":"sag"}]},{"type":"list-item","ordered":true,"children":[{"text":"sg "}]},{"type":"list-item","ordered":true,"children":[{"text":"sag"}]}]
})

// ----------
const {label_data,rich_data,gallery_list} = toRefs(state)

</script>

<style lang="scss">

</style>
 