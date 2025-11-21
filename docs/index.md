# Youloge UI

GitHub 风格的 Vue3 组件库，基于 Unocss 构建，轻量、易用、响应式。

## 特性

- 🎨 **GitHub 风格**：视觉统一，贴合 GitHub 简洁克制的设计语言
- 🚀 **Vue3 原生**：基于 Composition API，支持 Vue3 所有特性
- ⚡ **Unocss 驱动**：原子化 CSS，体积小、灵活性高
- 🔧 **自动导入**：支持 unplugin-auto-import，无需手动导入组件
- 🌙 **暗黑模式**：原生支持暗黑模式，自动适配系统主题
- 📱 **响应式**：组件自动适配桌面/移动端，字体、布局自适应

## 快速开始

```bash
# 安装
npm install youloge-ui unocss -S
```

### composables 组合函数

> 组合函数在 模板中 可直接使用 如果想在 setup中使用则在自己项目写一个辅助函数即可

```js
// composables/useYouloge.js
import { getCurrentInstance, unref } from 'vue';
/**
 * 从 globalProperties 中提取全局属性/方法（兼容 setup 环境）
 * @returns {Object} 包含 CONFIG 和所有 $xxx 方法的对象
 */
export default function useYouloge() {
  const instance = getCurrentInstance();
  // 确保在组件内使用（避免非组件环境调用报错）
  if (!instance) {
    throw new Error('useYouloge 只能在 Vue 组件的 <script setup> 中使用');
  }
  // 获取 globalProperties（兼容开发环境和生产环境）
  const globalProps = unref(instance.appContext.config.globalProperties);
  // 提取所有全局属性（CONFIG + 所有 $xxx 方法）
  return {
    ...globalProps
  };
}

// 在setup中使用
import  useYouloge  from './composables/useYouloge'
const { useBytes,useLoading,useTheme } = useYouloge(); 

let load = useLoading();
seTimeout(()=>{
    load.close();
},5000)
```