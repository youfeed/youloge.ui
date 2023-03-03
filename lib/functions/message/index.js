import useMessage from './message.js'

export default {
  install(app){
    app.config.globalProperties.$message = useMessage
  }
}