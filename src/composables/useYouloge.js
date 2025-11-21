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