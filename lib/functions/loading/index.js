import Loading from './loading.js'
export default {
  install(app){
    app.config.globalProperties.$loading = Loading
  }
}