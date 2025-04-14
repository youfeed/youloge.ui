<template>
    <div>
        <y-header aria="UI" logo="Youloge" @search="onSearch">

        </y-header>
        <!-- <hash-view></hash-view> -->
        <main max-w-200 mx-a>
            <yDivider position="left">Form -- </yDivider>
            <ySpace >
                <yForm v-model="form" >
                    <yInput v-model="form.input.value" rules="required" :options="form.input.options" @change="inputChange"></yInput>
                    <yRadio v-model="form.radio.value" rules="required" :options="form.radio.options" @change="radioChange"></yRadio>
                    <ySwitch v-model="form.switch.value" rules="required" :options="form.switch.options" @change="switchChange"></ySwitch>
                    <yCheckbox v-model="form.checkbox.value" rules="required" :options="form.checkbox.options" @change="checkboxChange"></yCheckbox>
                    <ySelect v-model="form.select.value" rules="required" :options="form.select.options" @change="selectChange" multiple></ySelect>

                    <button type="submit">提交</button>
                </yForm>
            </ySpace>
            <yDivider position="left">Timeing -- 计时器</yDivider>
            <div>
                <yTimer :deadline="state.deadline" @finish="timerFinish" v-slot="$slot" @click="timerFinish">
                    {{ $slot.total }}#
                    {{ $slot.days }}-{{ $slot.hours }}-{{ $slot.minutes }}
                    {{ $slot.seconds }}:{{ $slot.milliseconds }}
                </yTimer>
            </div>
            <yDivider position="left">Navbar -- </yDivider>
            <ySpace>
                <yNavbar :items="navbar.items" :size="navbar.size" @change="navbarChange"></yNavbar>
            </ySpace>
            <yDivider position="left">Icon -- </yDivider>
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
                <yButton rounded="none">
                    <yIcon name="weui:location-filled" size="12" />icon default
                </yButton>
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
                <yTable :columns="table_columns" :data="table_data"></yTable>
            </div>
            <yDivider position="left">Dropdown</yDivider>
            <ySpace title="Dropdown" size="md" wrap>
                <yDropdown>
                    <yButton type="primary">Dropdown</yButton>
                    <template #content>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </template>
                </yDropdown>
            </ySpace>
            <yDivider position="left">Card</yDivider>
            <ySpace title="Card" size="md" wrap>
                <yCard title="Card">

                </yCard>
            </ySpace>
            <yDivider position="left">useMessage {{ $utils.atLogged() }}</yDivider>
            <ySpace title="useMessage" size="md" wrap>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atProfile('mail','80') }}</yButton>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atImage('222',80) }}</yButton>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atBytes(256415) }}</yButton>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atTimeago('2025-04-07 20:00:00') }}</yButton>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atTimeago('1744036093',1) }}</yButton>
            </ySpace>
        </main>
    </div>
</template>
<script setup>
import  {exported} from '../lib/index.js'
import { inject, reactive, ref, toRefs } from 'vue'
const useStorage = inject('useStorage'),useMessage = inject('useMessage');
console.log('useMessage.exported',exported,)
const table_columns = [
    { title: '姓名', key: 'name' },
    { title: '年龄', key: 'age' },
    { title: '性别', key: 'sex' }
];
const table_data = [
    { name: '张三', age: 20, sex: '男' },
    { name: '李四', age: 21, sex: '女' },
    { name: '王五', age: 22, sex: '男' },
    { name: '赵六', age: 23, sex: '女' },
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
const timerFinish = () => {
    console.log('timerFinish.old',state.deadline) 
    setTimeout(()=>{
        state.deadline = Date.now() + 30 * 1000;
        console.log('timerFinish.new',state.deadline) 
    },1000)
}
const inputChange = (data) => {
    console.log('inputChange', data)
}
const navbarChange = (data) => {
    console.log('navbarChange', data)
}
const radioChange = (data) => {
    console.log('radioChange', data)
}
const switchChange = (data) => {
    console.log('switchChange', data)
}
const checkboxChange = (data) => {
    console.log('checkboxChange', data)
}
const selectChange = (data) => {
    console.log('selectChange', data)
}



const onMessage = () => {
    console.log('onMessage', useMessage('success',5266))
}
console.log('useStorage.then', useStorage('_grecaptcha'))


const onSearch = (data) => {
    console.log('onSearch', data)
}
const onNavigate = (data) => {
    let { uuid } = data
    window.open(`https://youloge.com/profile?u=${uuid}`, 'profile')
    console.log('onNavigate', data)
}

const state = reactive({
    deadline: 0,
    gallery_list: [
        'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
        'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
        'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
        'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
        'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
        'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
        'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
    ],
    navbar: {
        size: 'md',
        items: [
            { values: 'Home', label: '首页',active:true },
            { value: 'Profile', label: '个人中心',active:true },
            { value: 'Settings', label: '设置',icon:'tdesign:architecture-hui-style-filled' },
        ], 
    },
    form:{
        input:{
            title:'文章标题',
            name:'radio',
            value:'',
            placeholder:'请选择标签',
            options:[
                {value:'1',label:'选项1'},
                {value:'2',label:'选项2'}
            ]
        },
        radio:{
            title:'文章标签',
            name:'radio',
            value:'',
            placeholder:'请选择标签',
            options:[
                {value:'1',label:'选项1'},
                {value:'2',label:'选项2'}
            ]
        },
        switch:{
            title:'文章标签',
            name:'switch',
            value:'',
            placeholder:'请选择标签',
            options:[
                {value:'1',label:'选项1'},
                {value:'2',label:'选项2'}
            ]
        },
        checkbox:{
            title:'文章标签',
            name:'checkbox',
            value:'',
            placeholder:'请选择标签',
            options:[
                {value:'1',label:'选项1'},
                {value:'2',label:'选项2'}
            ] 
        },
        select:{
            title:'文章标签',
            name:'select',
            value:'',
            placeholder:'请选择标签',
            rule:'required|int',
            options:[
                {value:'1',label:'选项1'},
                {value:'2',label:'选项2'}
            ]
        }
    },
    label_data: ['潇洒', 'a安抚', '个', '是德国', '啊是服务'],
    rich_data: [{ "type": "paragraph", "children": [{ "text": "" }] }, { "type": "list-item", "children": [{ "text": "saf" }], "ordered": true }, { "type": "list-item", "ordered": true, "children": [{ "text": "sag" }] }, { "type": "list-item", "ordered": true, "children": [{ "text": "sg " }] }, { "type": "list-item", "ordered": true, "children": [{ "text": "sag" }] }]
})

// ----------
const { label_data, rich_data, gallery_list,navbar,form } = toRefs(state)

</script>

<style lang="scss"></style>