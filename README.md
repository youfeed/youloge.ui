# Youloge.com 配套定制`Vue3组件库` - beta版本

### 这个库干啥的

这是个`vue3`的组件库，进行高度定制化的自用组件库，很多组件都是配合`youloge.com`一起使用的，如果你仅仅是需要一个UI库开发自己的项目，这个并不适合。
如果你有自己的网站，那么可以接入`youloge.console`开放平台，我会将某些组件抽离成`js umd`脚本服务,可以单独引入到你自己的网站使用。

在使用该库的时候,你需要申请一对`apikey/secret`密钥对使用，再调用开放接口时候需要`组织凭证apikey`你可以理解为其他开放平台的`APPID`。

平台不区分`官方`和`非官方`，平台用户可以等同于你自己网站用户，比如`云盘服务`,`视频服务`也都是基于`apikey/secret`进行的分发。

### 组件库特点
- 图标动态引入：不用再担心图标文件体积过大，只需引入图标名称即可
- 配套简单路由：组件库自带路由，无需再引入路由文件
- 极简的全局函数方法：可以再样式组件中直接调用全局函数方法
- 极度精简 体积小 代码简单


### [💡 ⚡️ 🛠️ 📦 🔩 🔑](https://docs.youloge.com/ui/) - 开放文档

- 直接引入CDN 即可使用 `52.35 kB │ gzip: 15.11 kB`
- `https://unpkg.com/youloge`或者`https://cdn.jsdelivr.net/npm/youloge`

### NPM 安装
``` js
npm install youloge

import { createApp } from 'vue'
```

### 快速开始

``` js
createApp(App).use(youloge,{
  APIKEY:'', // *必须填写 接口平台组织调用凭证 可以理解为其他开发平台的`APPID`
  APIURL:'https://api.youloge.com', // inject('apiFetch')的请求地址
  VIPURL:'https://www.youloge.com', // inject('vipFetch')的请求地址
  // 可选：载入哈希路由可以实现更丰富得页面功能
  ROUTES:[
    {
      name:'', // 路由名称 
      path:'', // 当URL Hash值为`#{path}`时，默认跳转的页面
      component:'', // 推荐使用 `defineAsyncComponent` 可以实现动态懒加载
      icon:'...' // tdesign:activity 图标集:图标名称
    }
  ]
}).mount('#app')
```

### 更新日志

- 2.1.1 提炼出全局属性和方法，更好的服务于业务开发
- 2.1.0 组件库进行重构：重新拆分`样式组件`,`函数组件`,`指令函数`更好得服务于业务开发
- 1.9.4 新增`y-discuss` 评论组件 跳转个人主页由开发者控制`@navigate 事件`
- 1.8.9 新增`useShopcart`套餐下单组件，作为商品购物的前置条件(配合`usePayment`食用)
- 1.8.4 新增`v-search`搜索指令，可以在div上绑定弹窗搜索页面
- 1.8.0 优化`useLoading useFetch` 互相嵌套逻辑`useFetch 默认mask:true`
- 1.7.3 新增`useStorage`函数组件 仅支持对象读(对象)写(对象覆盖),均返回最新对象
- 1.7.1 优化项目结构：组件支持尽量多方式调用
- 1.6.5 更换导出方式，支持按需导入使用: 组件模式正式确认：可以规范化书写新增`组件`,`指令`,`函数`
- 1.5.0 去除样式组件，全部采用关键组件集，不倾入代码，组件库定位为`定制小组件`
- 1.4.9 引入`unocss`来作为基础样式
- 1.4.8 新增`hashview`组件用于承接`hash文件路由功能`同于动态懒加载组件
- 1.4.3 优化`useMessage`的调用方式，简化代码
- 1.4.2 新增`v-ripple`水波纹组件，重构`useDialog`交互组件支持`password`验证码输入
- 1.3.9 新增`y-rgba`组件，用于展示Youloge虚拟货币与实际货币的预计换算结果
- 1.3.5 优化`v-login`指令，共享`usePlus`组件
- 1.3.2 新增`y-discuss`组件，展示评论
- 1.3.2 新增`y-label`组件，展示标签
- 1.2.6 更改`useFetch`增加`path`属性
- 1.2.5 去除`usePayment useSso`等方法改为`usePlus`*
- 1.2.2 修复关于`open.youloge.com`的小bug
- 1.2.1 更新`v-login`,`usePayment` 减少与独立库`js umd`差异
- 1.2.0 优化`useFetch` 增加`api,vip,json,text,blob,buffer`并纳入鉴权与`apikey`配置项
- 1.1.7 增加`useFetch`返回值为`err == -1`登录过期处理
- 1.1.4 优化`postmessage` 通信的通过性
- 1.0.7 优化`useMessage` 和对应style
- 1.0.4 优化`localStorage`与`sessionStorage`的作用名
- 1.0.0 增加`usePayment`组件，用于支付请求
- 0.2.9 增加`v-cloak` 匹配vue渲染
- 0.2.8 更新配置参数`apikey`,使其与`youloge.sso`,`youloge.payment`等组件联动
- 0.2.7 新增`v-copy`指令,支持`函数`,`字符串`,`HTML` 暂不支持图片
- 0.2.6 新增`useDialog`组件 支持`alert`,`confirm`,`prompt` 三种模式
- 0.2.5 优化provide 重新封装`fetch`等函数式组件




### 项目结构


``` TREE
project
│
└───lib 开发目录(其他组件库一般叫packages)
│   │   
│   │   index.js UI组件库的入口
│   │
│   └───components 页面组件
│       │   button
│       │   input
│       │   table/index.js 导出文件
│       │   ...
│       │   
│   └───composables 函数组件
│       │   alert
│       │   fetch
│       │   message
│       │   storage/index.js 导出文件 
│   └───directives 指令组件
│       │   copy
│       │   ripple/index.js 导出文件 
│   └───style
│       │   index.scss 导出文件
│   └───utils 辅助方法
│       │   index.js 导出文件
│   index.js   导出安装方法
|
└───src 测试目录
│   │   assets 静态资源
│   │   route 路由
│   │   components 组件
│   │   views 视图文件
│   │   ...
│   vite.config.js 项目默认的配置
│   libs.config.js 打包组件库配置
│   package.json   项目依赖和脚本
└───
 
```

#### 但行好事 莫问前程

