import Loading from './loading.vue'
export default {
  install(app){
    app.provide('useLoading',Loading)
    app.config.globalProperties.$loading = Loading
  }
}