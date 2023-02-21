import useFetch from './fetch.js'
export default {
  install(app){
    app.provide('useFetch',useFetch)
    app.config.globalProperties.$Fetch = useFetch
  }
}