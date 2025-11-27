import yMessage from './message.vue'
import { createApp } from 'vue'

const singleton = {
  app: null,
  vm: null,
  el: null,
}

const initInstance = () => {
  if (singleton.el && singleton.vm) return

  const el = document.createElement('div')
  el.className = 'y-message-instance'
  document.body.appendChild(el)

  const app = createApp(yMessage)
  const vm = app.mount(el)
  
  singleton.app = app
  singleton.vm = vm
  singleton.el = el
}

const createMessage = (type, options) => {
  // 参数标准化处理
  const config = typeof options === 'string' 
    ? { content: options } 
    : { ...options }
  
  config.type = type
  
  // 确保有内容，将其他类型转换为字符串
  if (!config.content) {
    console.warn(`[yMessage] ${type} 消息内容为空`)
    config.content = ''
  } else if (typeof config.content !== 'string') {
    // 将数字、对象等转换为字符串
    config.content = String(config.content)
  }

  const uuid = singleton.vm.create(config)
  
  return {
    uuid,
    close: () => singleton.vm.close(uuid),
    destroy: () => singleton.vm.destroy()
  }
}

export default function useMessage() {
  initInstance()

  return {
    success: (options) => createMessage('success', options),
    warning: (options) => createMessage('warning', options),
    error: (options) => createMessage('error', options),
    info: (options) => createMessage('info', options),
    // 保留原始方法用于特殊场景
    create: (config) => createMessage(config.type, config),
    destroy: () => singleton.vm.destroy()
  }
}