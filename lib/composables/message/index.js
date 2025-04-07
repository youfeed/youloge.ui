import useMessage from './message.js'
useMessage.install = app =>{
  app.provide('useMessage',useMessage)
}
export default useMessage;