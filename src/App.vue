<template>
    <y-layout direction="vertical">
        <!-- 头部导航 -->
        <y-header>
            <y-menu mode="horizontal" :options="menuOptions" v-model:active-key="activeKey"
                    v-model:open-keys="openKeys" width="240px" theme="dark" @select="handleSelect" position="end" />
        </y-header>
        <y-header padding="0 24px" justify="space-between" bgColor="#ffffff">
            <div class="flex items-center justify-between w-full">
                <y-link type="primary" class="text-lg font-bold" @click="toggleAside">
                    <y-icon name="mdi-light:menu" :size="40" />
                    GitHub Style
                </y-link>
            </div>
            <div class="flex gap-4">
                <y-link @click="onMessage">首页 </y-link>
                <y-link @click="onMaterial">文档</y-link>
                <y-link>关于</y-link>
            </div>
        </y-header>
        <!--  -->
        <y-layout direction="horizontal">
            <y-aside bgColor="white" :width="240" :collapsed="asideCollapsed" style="height:100vh;">
                <!-- 侧边栏菜单 -->
                <y-menu mode="vertical" :options="menuOptions"  v-model:active-key="activeKey" style="height:100vh;"
                    v-model:open-keys="openKeys" width="240px" theme="dark" @select="handleSelect" />
            </y-aside>
            <!-- 主体内容 -->
            <y-content :asideWidth="240" :asideCollapsed="asideCollapsed">
                <h1 class="text-2xl font-bold mb-6">基础布局示例</h1>
                <p class="text-gray-700 dark:text-gray-300 mb-4">这是页面主体内容区域，默认居中显示，最大宽度 1200px。</p>
                <!-- 嵌套栅格组件 -->
                <y-row gap="8px" class="mt-8">
                    <y-col span="24" style="height: 100px; overflow-y: scroll;">
                        <div>list 加载</div>
                        <y-list v-model="listModel" stripe class="bg-transparent" :loadPromise="listLoad"
                            v-slot="{ item, index }">
                            <div :data-index="index">{{ item }}</div>
                        </y-list>
                    </y-col>
                    <y-col span="24">
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
                    <y-col span="12">
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
                    <y-col span="12">
                        <y-form v-model="formModel" :rules="formRules" labelPosition="left" itemGap="20px">
                            <y-form-item label="技术栈标签" prop="tags" required>
                                <y-input-tag v-model="formModel.tags" :max-tags="6" :error-message="formErrors.tags" />
                            </y-form-item>
                            <y-form-item label="用户名s" prop="username" padding="4">
                                <y-input status="success" wordCount maxlength="64" size="large" prefix="用户名" type="text"
                                    v-model="formModel.username" placeholder="请输入用户名" />
                            </y-form-item>
                            <y-form-item label="邮箱" prop="email" padding="4">
                                <y-input size="small" type="email" v-model="formModel.email" placeholder="请输入邮箱" />
                            </y-form-item>
                            <y-form-item label="邮箱" prop="email" padding="4">
                                <y-input type="email" suffix="@qq.com" clearable v-model="formModel.email"
                                    placeholder="请输入邮箱" />
                            </y-form-item>
                            <!-- 单选选择器（基础用法） -->
                            <y-form-item label="所在城市" prop="city" required>
                                <y-select label="城市" multiple filterable allowCreate v-model="formModel.city"
                                    :options="cityOptions" placeholder="请选择城市" />
                            </y-form-item>
                            <y-form-item>
                                <div>
                                    <y-radio v-model="formModel.selected" value="option1" label="选项一" />
                                    <y-radio v-model="formModel.selected" value="option2" label="选项二" disabled />
                                    <y-radio v-model="formModel.selected" value="option3" label="选项三" />
                                </div>
                            </y-form-item>
                            <y-form-item>
                                <!-- 默认样式 -->
                                <y-radio-group v-model="formModel.selectedOption">
                                    <y-radio value="a" label="选项A" />
                                    <y-radio value="b" label="选项B" />
                                </y-radio-group>
                            </y-form-item>
                            <y-form-item>
                                <!-- 边框样式 -->
                                <y-radio-group v-model="formModel.selectedOption" variant="border">
                                    <y-radio value="c" label="选项C" />
                                    <y-radio value="d" label="选项D" />
                                </y-radio-group>
                            </y-form-item>
                            <y-form-item>
                                <!-- 按钮样式 -->
                                <y-radio-group v-model="formModel.selectedOption" variant="button">
                                    <y-radio value="e" label="选项E" />
                                    <y-radio value="f" label="选项F" />
                                </y-radio-group>
                            </y-form-item>
                            <y-form-item>
                                <!-- 胶囊样式 -->
                                <y-radio-group v-model="formModel.selectedOption" variant="capsule">
                                    <y-radio value="g" label="选项G" />
                                    <y-radio value="h" label="选项H" />
                                </y-radio-group>
                            </y-form-item>
                            <y-form-item>
                                <!-- 垂直布局 -->
                                <y-radio-group v-model="formModel.selectedOption" variant="button" vertical>
                                    <y-radio value="i" label="选项I" />
                                    <y-radio value="j" label="选项J" />
                                </y-radio-group>
                            </y-form-item>
                            <y-form-item>
                                <y-radio-group variant="border" vertical v-model="formModel.selectedOption"
                                    size="small">
                                    <y-radio value="apple" label="苹果" />
                                    <y-radio value="banana" label="香蕉" border />
                                    <y-radio value="orange" label="橙子" border disabled />
                                </y-radio-group>
                            </y-form-item>
                            <y-space class="mt-4">
                                <y-button type="primary" @click="handleSubmit">提交</y-button>
                                <y-button type="secondary" @click="handleReset">重置</y-button>
                            </y-space>
                        </y-form>
                    </y-col>
                    <y-col span="20">
                        <y-table :data="tableData" :columns="columns" stripe>
                            <template #status="{ row }">
                                <span :class="`status-${row.status}`">
                                    <!-- {{ row }} -->
                                    {{ row.status === 1 ? '正常' : '禁用2' }}
                                </span>
                            </template>
                        </y-table>
                        <!-- 复杂多级表头 -->
                        <y-table :data="complexData" :columns="complexColumns" :selected-rows="selectedRows"
                            enable-active :max-active-count="2" height="500px">
                            <template #profitRate="{ row }">
                                <span class="profit-rate">
                                    利润率: {{ ((row.profit / row.price) * 100).toFixed(1) }}%
                                </span>
                            </template>
                            <template #profit-Rate="{ row }">
                                <span class="profit-rate">
                                    利润率: {{ ((row.profit / row.price) * 100).toFixed(1) }}%
                                </span>
                            </template>
                        </y-table>
                    </y-col>
                </y-row>
            </y-content>

        </y-layout>

        <!-- 底部版权 -->
        <y-footer>
            © 2025 GitHub Style Component Library. All riyts reserved.
        </y-footer>
    </y-layout>
</template>
<script setup>
import { exported } from '../lib/index.js'
import { inject, reactive, ref, toRefs } from 'vue'
import useYouloge from './composables/useYouloge'
const { useBytes, useLoading, useMessage, useMaterial, useTheme } = useYouloge();


const collapsed = ref(false)

const activeNavKey = ref('home')

const activeKey = ref('1')
const openKeys = ref(['2'])

const menuOptions = ref([
    {
        key: '1',
        label: '首页',
        icon: 'mdi:home',
        badge: 'New'
    },
    {
        key: '2',
        label: '产品管理',
        icon: 'mdi:package',
        children: [
            {
                key: '2-1',
                label: '产品列表',
                icon: 'mdi:format-list-bulleted'
            },
            {
                key: '2-2',
                label: '产品分类',
                icon: 'mdi:tag',
                children: [
                    {
                        key: '2-2-1',
                        label: '电子产品',
                        icon: 'mdi:laptop'
                    },
                    {
                        key: '2-2-2',
                        label: '家居用品',
                        icon: 'mdi:sofa'
                    }
                ]
            },
            {
                key: '2-3',
                label: '产品分析',
                icon: 'mdi:chart-bar'
            }
        ]
    },
    {
        key: '3',
        label: '用户管理',
        icon: 'mdi:account-group',
        children: [
            {
                key: '3-1',
                label: '用户列表',
                icon: 'mdi:account-box'
            },
            {
                key: '3-2',
                label: '角色管理',
                icon: 'mdi:shield-account'
            }
        ]
    },
    {
        key: '4',
        label: '系统设置',
        icon: 'mdi:cog',
        disabled: true
    },
    {
        key: '5',
        label: '帮助中心',
        icon: 'mdi:help-circle'
    }
])

const handleMenuClick = (item) => {
    console.log('菜单点击:', item)
}

const handleLogout = () => {
    console.log('退出登录')
}
const listModel = ref([888, 8, 88, 77]);
// 列表加载
const listLoad = () => {
    const { promise, resolve, reject } = Promise.withResolvers()
    resolve([1, 2, 3, 4, 5, crypto.randomUUID()]);
    // reject({code:200,message:'加载完成'})
    console.log('listLoad')
    return promise;
}

const complexData = ref([
    { id: 1, product: '商品A', price: 100, cost: 60, profit: 40, stock: 50, sales: 100, category: '电子产品' },
    { id: 2, product: '商品B', price: 200, cost: 120, profit: 80, stock: 30, sales: 80, category: '家居用品' },
    { id: 3, product: '商品B', price: 200, cost: 120, profit: 80, stock: 30, sales: 80, category: '家居用品' },
    { id: 4, product: '商品B', price: 200, cost: 120, profit: 80, stock: 30, sales: 80, category: '家居用品' },
    { id: 5, product: '商品B', price: 200, cost: 120, profit: 80, stock: 30, sales: 80, category: '家居用品' },
    { id: 6, product: '商品B', price: 200, cost: 120, profit: 80, stock: 30, sales: 80, category: '家居用品' },
    { id: 7, product: '商品B', price: 200, cost: 120, profit: 80, stock: 30, sales: 80, category: '家居用品' },
    { id: 8, product: '商品B', price: 200, cost: 120, profit: 80, stock: 30, sales: 80, category: '家居用品' },
])

// 多级表头配置
const multiLevelColumns = ref([

    {
        label: '基本信息',
        children: [
            { label: '姓名', prop: 'name', width: '120px', sortable: true },
            { label: '年龄', prop: 'age', width: '80px', align: 'center', sortable: true },
            { label: '状态', prop: 'status', width: '80px', align: 'center', slot: 'status' }
        ]
    },
    {
        label: '联系信息',
        children: [
            { label: '手机号', prop: 'phone', width: '120px' },
            { label: '邮箱', prop: 'email', width: '150px' }
        ]
    },
    {
        label: '工作信息',
        children: [
            { label: '部门', prop: 'department', width: '100px' },
            { label: '职位', prop: 'position', width: '120px' }
        ]
    }
])
// 复杂多级表头配置
const complexColumns = ref([
    { type: 'checkbox', width: '50px' },
    { type: 'numbers', width: '60px' },
    { type: 'radio', width: '60px' },
    {
        label: '商品信息',
        children: [
            { label: '商品名称', prop: 'product', width: '150px' },
            { label: '分类', prop: 'category', width: '100px' }
        ]
    },
    {
        label: '价格信息',
        children: [
            {
                label: '成本相关',
                children: [
                    { label: '售价', prop: 'price', width: '100px', sortable: true, align: 'right' },
                    { label: '成本', prop: 'cost', width: '100px', align: 'right' }
                ]
            },
            {
                label: '利润相关',
                children: [
                    { label: '利润', prop: 'profit', width: '100px', align: 'right' },
                    { label: '利润率', prop: 'profitRate', width: '100px', align: 'right' }
                ]
            }
        ]
    },
    {
        label: '库存销售',
        children: [
            { label: '库存', prop: 'stock', width: '80px', align: 'center' },
            { label: '销量', prop: 'sales', width: '80px', align: 'center' }
        ]
    }
])
const tableData = ref([
    { id: 1, name: '张三', age: 25, status: 1 },
    { id: 2, name: '李四', age: 30, status: 2 },
    { id: 2, name: '李四', age: 30, status: 6 }
])

const columns = ref([
    { label: '姓名', prop: 'name', width: '120px' },
    { label: '年龄', prop: 'age', width: '80px', align: 'center' },
    { label: '状态', prop: 'status', width: '80px', align: 'center', slot: 'status' }
])


console.log(useBytes(555), useTheme())
const useStorage = inject('useStorage')
// console.log('useMessage.exported', exported,)
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
// 开关侧边栏
const asideCollapsed = ref(false)
const toggleAside = () => {
    asideCollapsed.value = !asideCollapsed.value
}



const onMessage = () => {
    useMessage().success(999);
    useMessage().warning('warning');
    useMessage().error('error');
    useMessage().info(999);
    console.log('onMessage', useMessage('success', 5266))
}
// 素材选则
const onMaterial = () => {
    useMaterial({
        type: 'image'
    }).then(res => {

    })
}

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
    selected: '22',
    selectedOption: 'apple',
    city: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    tags: [],
})
// 选项数据
const cityOptions = ref([
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
    { label: '杭州', value: 'hangzhou' },
    { label: '成都', value: 'chengdu' },
    { label: '武汉', value: 'wuhan' }
])
// 表单验证规则
const formRules = ref({
    city: [{ required: true, message: '请选择所在城市' }],
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