import useDialog from './dialog.js'
export default {
  install(app){
    app.config.globalProperties.$dialog = useDialog
  }
}