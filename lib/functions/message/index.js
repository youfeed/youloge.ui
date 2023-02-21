import useMessage from './message.js'

export default {
  install(app){
    app.provide(`useMessage`,useMessage)
    app.config.globalProperties.$message = useMessage
  }
}