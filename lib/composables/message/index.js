import useMessage from './message.js'
useMessage.install = app =>{
  app.provide('useMessage',useMessage)
  app.config.globalProperties.useMessage = useMessage;
}
export default useMessage;