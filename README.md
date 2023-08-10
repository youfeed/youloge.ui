# 这是一个Youloge.com 自用项目 欢迎PR [主仓库]

### [💡 ⚡️ 🛠️ 📦 🔩 🔑](https://youfeed.github.io/sso) - 开放文档

> 建议直接引入CDN 即可使用 `32.96 kB │ gzip: 11.52 kB`

> `https://unpkg.com/youloge`或者`https://cdn.jsdelivr.net/npm/youloge`

``` js
createApp(App).use(youloge,{
  ukey:'', // 建议填写 可以让`v-login` `usePayment` 权限指令自动注入免初始化
  APIURL:'',
  VIPURL:'',
  fontsize:'12px'
}).mount('#app')
```

### 更新日志

- 1.3.9 新增`y-rgba`组件，用于展示Youloge虚拟货币与实际货币的预计换算结果
- 1.3.5 优化`v-login`指令，共享`usePlus`组件
- 1.3.2 新增`y-discuss`组件，展示评论
- 1.3.2 新增`y-label`组件，展示标签
- 1.2.6 更改`useFetch`增加`path`属性
- 1.2.5 去除`usePayment useSso`等方法改为`usePlus`*
- 1.2.2 修复关于`open.youloge.com`的小bug
- 1.2.1 更新`v-login`,`usePayment` 减少与独立库`js umd`差异
- 1.2.0 优化`useFetch` 增加`api,vip,json,text,blob,buffer`并纳入鉴权与`ukey`配置项
- 1.1.7 增加`useFetch`返回值为`err == -1`登录过期处理
- 1.1.4 优化`postmessage` 通信的通过性
- 1.0.7 优化`useMessage` 和对应style
- 1.0.4 优化`localStorage`与`sessionStorage`的作用名
- 1.0.0 增加`usePayment`组件，用于支付请求
- 0.2.9 增加`v-cloak` 匹配vue渲染
- 0.2.8 更新配置参数`ukey`,使其与`youloge.sso`,`youloge.payment`等组件联动
- 0.2.7 新增`v-copy`指令,支持`函数`,`字符串`,`HTML` 暂不支持图片
- 0.2.6 新增`useDialog`组件 支持`alert`,`confirm`,`prompt` 三种模式
- 0.2.5 优化provide 重新封装`fetch`等函数式组件

### 这个库干啥的？

这是个`vue3`的组件库，进行高度定制化的自用组件库，很多组件都是配合`youloge.com`一起使用的，如果你仅仅是需要一个UI库开发自己的项目，这个并不适合。
如果你有自己的网站，那么可以接入`youloge.console`开放平台，我会将某些组件抽离成`js umd`脚本服务，例如`登录注册`,`支付`,`充值`,`视频播放器`,`音乐播放器`,`团购商城`，可以单独引入到你自己的网站使用。

在使用该库的时候,你需要申请一对`ukey/secret`密钥对使用，在引入使用产生的-收入/广告费/佣金 会结算到你的账户中。平台不怎么区分官方禾非官方，比如`云盘服务`,`视频服务`也都是基于`ukey/secret`进行的分发。


### 项目结构


``` TREE
project
│
└───lib 不用npm install
│   │   
│   │   index.js UI组件库的入口
│   │
│   └───components
│       │   button
│       │   input
│       │   components.js 统一导出组件
│       │   ...
│       │   
│   └───function
│       │   alert
│       │   ...
│       │   function.js 统一导出函数组件
│   └───...
│   
└───src
    │   assets 静态资源
    │   route 路由
    │   components 组件
    │   views 视图文件
    │   ...
│   vite.config.js 项目默认的配置
│   libs.config.js 打包组件库配置
│   package.json   项目依赖和脚本
 
```

> `git pull` 项目之后 `npm i`

1. 先到 `package.json` 运行 `npm run build` 打包出`dist目录`，项目需要依赖这个UI库。

2. 再次运行  `npm run dev` ...

3. 然后爬组件 写项目吧


#### 我边学边写，前端真好玩，哈哈哈～～ 欢迎加微信 交流 11247005，如果你提交代码，我认真学习谢谢

> 参考链接 也是我后面更新学习来源

- [前端小野森森-1](https://space.bilibili.com/378372969)
- [MZL 轻量级Vue3组件库](https://mzlui.codeym.com/#/)
- [ArcoDesign 今日头条](https://arco.design/)
- [Vant 有赞UI库*](https://youzan.github.io/vant-weapp/#/home)

在找vue admin 时候看到 [ArcoDesign 今日头条](https://arco.design/) 觉得很不错，所以将之前用`vue-cli` 搭建学习的ui组件库，转移到`vite`来，折腾了一整天，刚开始我在哪里狂整`rollup.config.js` 各种缺失报错，其实 `vite build lib`直接可以用的，`scss` 以及 `css 变量`。
