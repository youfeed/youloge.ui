<template>
    <div>
        <y-layout>
            <!-- 头部导航 -->
            <y-header>
                <div class="flex items-center justify-between w-full">
                    <y-link type="primary" class="text-lg font-bold">GitHub Style</y-link>
                    <div class="flex gap-4">
                        <y-link>首页</y-link>
                        <y-link>文档</y-link>
                        <y-link>关于</y-link>
                    </div>
                </div>
            </y-header>

            <!-- 主体内容 -->
            <y-content padding="24px">
                <h1 class="text-2xl font-bold mb-6">基础布局示例</h1>
                <p class="text-gray-700 dark:text-gray-300 mb-4">这是页面主体内容区域，默认居中显示，最大宽度 1200px。</p>
                <!-- 嵌套栅格组件 -->
                <y-row gap="8px" class="mt-8">
                    <y-col span="6">
                        <div class="bg-gray-50 p-4 rounded-md">
                            <y-tabs @tab-change="handleTabChange">
                                <!-- 标签区 -->
                                <template #tab>
                                    <y-tab name="repo">仓库</y-tab>
                                    <y-tab name="issues">Issues</y-tab>
                                    <y-tab name="pulls">Pull requests</y-tab>
                                    <y-tab name="actions" disabled>Actions（禁用）</y-tab>
                                </template>

                                <!-- 内容区 -->
                                <y-tab-pane name="repo" padding="8px">
                                    <p>仓库内容：代码、分支、发布版本等</p>
                                </y-tab-pane>
                                <y-tab-pane name="issues" padding="8px">
                                    <p>Issues 内容：bug 反馈、功能请求等</p>
                                </y-tab-pane>
                                <y-tab-pane name="pulls" padding="8px">
                                    <p>Pull requests 内容：代码合并请求</p>
                                </y-tab-pane>
                                <y-tab-pane name="actions" padding="8px">
                                    <p>Actions 内容：自动化工作流（禁用状态不显示）</p>
                                </y-tab-pane>
                            </y-tabs>
                        </div>
                    </y-col>
                    <y-col span="6">
                        <div class="bg-gray-50 p-4 rounded-md">
                            <div class="p-8">
                                <!-- 基础用法：按钮触发下拉菜单 -->
                                <y-dropdown>
                                    <template #trigger>
                                        <y-button type="secondary">基础下拉菜单</y-button>
                                    </template>
                                    
                                        <y-dropdown-item @click="handleItemClick('新建文件')">新建文件</y-dropdown-item>
                                        <y-dropdown-item @click="handleItemClick('新建仓库')">新建仓库</y-dropdown-item>
                                        <y-dropdown-divider />
                                        <y-dropdown-item @click="handleItemClick('设置')">设置</y-dropdown-item>
                                        <y-dropdown-item disabled>帮助与支持（禁用）</y-dropdown-item>
                                    
                                </y-dropdown>

                                <!-- 自定义触发元素（链接）+ 右对齐 -->
                                <y-dropdown placement="bottom-end" class="ml-4">
                                    <template #trigger>
                                        <y-link type="primary">更多操作 ↓</y-link>
                                    </template>
                                    <y-dropdown-menu width="180px">
                                        <y-dropdown-item @click="handleItemClick('导出')">导出数据</y-dropdown-item>
                                        <y-dropdown-item @click="handleItemClick('分享')">分享链接</y-dropdown-item>
                                        <y-dropdown-divider />
                                        <y-dropdown-item @click="handleItemClick('删除')"
                                            textColor="text-red-600 dark:text-red-400">
                                            删除（危险操作）
                                        </y-dropdown-item>
                                    </y-dropdown-menu>
                                </y-dropdown>

                                <!-- Hover 触发 + 上对齐 -->
                                <y-dropdown trigger="hover" placement="top-start" class="ml-4">
                                    <template #trigger>
                                        <span class="text-gray-700 dark:text-gray-300 cursor-pointer">Hover 触发</span>
                                    </template>
                                    <y-dropdown-menu>
                                        <y-dropdown-item @click="handleItemClick('选项1')">选项1</y-dropdown-item>
                                        <y-dropdown-item @click="handleItemClick('选项2')">选项2</y-dropdown-item>
                                    </y-dropdown-menu>
                                </y-dropdown>
                            </div>
                        </div>
                    </y-col>
                    <y-col span="8">
                        <y-form v-model="formModel" :rules="formRules" labelPosition="top" itemGap="20px">
                            <y-form-item label="技术栈标签" prop="tags" required>
                                <y-input-tag v-model="formModel.tags" :max-tags="6" :error-message="formErrors.tags" />
                            </y-form-item>
                            <y-form-item label="用户名" prop="username" padding="4">
                                <input type="text" v-model="formModel.username"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    placeholder="请输入用户名">
                            </y-form-item>

                            <y-form-item label="邮箱" prop="email" padding="4">
                                <input type="email" v-model="formModel.email"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    placeholder="请输入邮箱">
                            </y-form-item>

                            <y-space class="mt-4">
                                <y-button type="primary" @click="handleSubmit">提交</y-button>
                                <y-button type="secondary" @click="handleReset">重置</y-button>
                            </y-space>
                        </y-form>
                    </y-col>
                </y-row>
            </y-content>

            <!-- 底部版权 -->
            <y-footer>
                © 2025 GitHub Style Component Library. All riyts reserved.
            </y-footer>
        </y-layout>
        <!-- 嵌套子组件 -->
        <!-- <hash-view></hash-view> -->
        <main max-w-200 mx-a>
            <yDivider position="left">Form -- </yDivider>

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
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atProfile('mail', '80') }}</yButton>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atImage('222', 80) }}</yButton>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atBytes(256415) }}</yButton>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atTimeago('2025-04-07 20:00:00') }}
                </yButton>
                <yButton type="primary" @click="onMessage">Dropdown {{ $utils.atTimeago('1744036093', 1) }}</yButton>
            </ySpace>
        </main>
        <!-- 基础 12 列栅格：一行 3 列，间距 8px -->
        <y-row gap="8px" justify="between">
            <y-col span="4">列1（占 4/12）</y-col>
            <y-col span="4">列2（占 4/12）</y-col>
            <y-col span="4">列3（占 4/12）</y-col>
        </y-row>

        <!-- 响应式栅格：移动端 1 列，平板 2 列，桌面 3 列 -->
        <y-row gap="6px" class="mt-6">
            <y-col span="12" spanMd="6" spanLg="4">响应式列1</y-col>
            <y-col span="12" spanMd="6" spanLg="4">响应式列2</y-col>
            <y-col span="12" spanMd="12" spanLg="4">响应式列3</y-col>
        </y-row>

        <!-- 带偏移的栅格 -->
        <y-row gap="6px" class="mt-6">
            <y-col span="8" offset="2">偏移 2 列，占 8/12（居中）</y-col>
        </y-row>

        <!-- 手动扩展 Unocss 类（灵活度不打折） -->
        <y-row gap="6px" class="mt-6 bg-gray-50 p-4">
            <y-col span="6" class="bg-white p-3 rounded-md shadow-sm">
                自定义样式列（添加背景、内边距、阴影）
            </y-col>
        </y-row>
    </div>
</template>
<script setup>
import { exported } from '../lib/index.js'
import { inject, reactive, ref, toRefs } from 'vue'
const useStorage = inject('useStorage'), useMessage = inject('useMessage');
console.log('useMessage.exported', exported,)
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
    console.log('timerFinish.old', state.deadline)
    setTimeout(() => {
        state.deadline = Date.now() + 30 * 1000;
        console.log('timerFinish.new', state.deadline)
    }, 1000)
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
const handleTabChange = (data) => {
    console.log('handleTabChange', data)
}
const handleSubmit = (data) => {
    console.log('handleSubmit', data)
}
const handleReset = (data) => {
    console.log('handleReset', data)
}




const onMessage = () => {
    console.log('onMessage', useMessage('success', 5266))
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
            { values: 'Home', label: '首页', active: true },
            { value: 'Profile', label: '个人中心', active: true },
            { value: 'Settings', label: '设置', icon: 'tdesign:architecture-hui-style-filled' },
        ],
    },
    form: {
        input: {
            title: '文章标题',
            name: 'radio',
            value: '',
            placeholder: '请选择标签',
            options: [
                { value: '1', label: '选项1' },
                { value: '2', label: '选项2' }
            ]
        },
        radio: {
            title: '文章标签',
            name: 'radio',
            value: '',
            placeholder: '请选择标签',
            options: [
                { value: '1', label: '选项1' },
                { value: '2', label: '选项2' }
            ]
        },
        switch: {
            title: '文章标签',
            name: 'switch',
            value: '',
            placeholder: '请选择标签',
            options: [
                { value: '1', label: '选项1' },
                { value: '2', label: '选项2' }
            ]
        },
        checkbox: {
            title: '文章标签',
            name: 'checkbox',
            value: '',
            placeholder: '请选择标签',
            options: [
                { value: '1', label: '选项1' },
                { value: '2', label: '选项2' }
            ]
        },
        select: {
            title: '文章标签',
            name: 'select',
            value: '',
            placeholder: '请选择标签',
            rule: 'required|int',
            options: [
                { value: '1', label: '选项1' },
                { value: '2', label: '选项2' }
            ]
        }
    },
    label_data: ['潇洒', 'a安抚', '个', '是德国', '啊是服务'],
    rich_data: [{ "type": "paragraph", "children": [{ "text": "" }] }, { "type": "list-item", "children": [{ "text": "saf" }], "ordered": true }, { "type": "list-item", "ordered": true, "children": [{ "text": "sag" }] }, { "type": "list-item", "ordered": true, "children": [{ "text": "sg " }] }, { "type": "list-item", "ordered": true, "children": [{ "text": "sag" }] }]
})
const formErrors = ref({ tags: '' });
// 表单数据模型
const formModel = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    tags:[]
})

// 表单验证规则
const formRules = ref({
    tags: [{ required: true, message: '至少添加1个技术栈标签' }],
    username: [
        { required: true, message: '用户名不能为空' },
        { pattern: /^.{3,10}$/, message: '用户名长度为3-10位' }
    ],
    email: [
        { required: true, message: '邮箱不能为空' },
        { pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, message: '邮箱格式不正确' }
    ],
    password: [
        { required: true, message: '密码不能为空' },
        { pattern: /^.{6,}$/, message: '密码长度至少6位' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码' },
        {
            validator: (val, model) => val === model.password,
            message: '两次密码输入不一致'
        }
    ]
})

// ----------
const { label_data, rich_data, gallery_list, navbar, form } = toRefs(state)

</script>

<style lang="scss"></style>