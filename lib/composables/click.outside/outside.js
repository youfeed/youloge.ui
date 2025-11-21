/**
 * 自定义 useClickOutside 工具函数
 * 监听点击元素外部的事件，触发回调（用于关闭下拉菜单、弹窗等）
 * @param {Ref<HTMLElement | null>} targetRef - 目标元素的 ref（点击该元素内部不触发）
 * @param {Function} callback - 点击外部时触发的回调函数
 * @param {Object} options - 可选配置
 * @param {Ref<HTMLElement | null>[]} options.ignoreRefs - 忽略的元素 ref 数组（点击这些元素也不触发）
 * @param {String} options.eventType - 监听的事件类型（默认 click）
 */
export default function(targetRef, callback, options = {}) {
  const { ignoreRefs = [], eventType = 'click' } = options

  // 事件处理函数
  const handleEvent = (e) => {
    // 1. 目标元素未挂载，直接返回
    if (!targetRef.value) return

    // 2. 点击目标元素内部，不触发回调
    if (targetRef.value.contains(e.target)) return

    // 3. 点击忽略元素内部，不触发回调
    const isClickIgnoreElement = ignoreRefs.some(
      (ref) => ref.value && ref.value.contains(e.target)
    )
    if (isClickIgnoreElement) return

    // 4. 点击外部，触发回调
    callback(e)
  }
  
  // 挂载时添加事件监听
  const mount = () => {
    document.addEventListener(eventType, handleEvent, { passive: true })
  }

  // 卸载时移除事件监听（避免内存泄漏）
  const unmount = () => {
    document.removeEventListener(eventType, handleEvent)
  }

  // 返回挂载/卸载方法，供组件控制
  return { mount, unmount }
}
