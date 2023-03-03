import useFetch from './fetch.js'
export default {
  install(app){
    app.config.globalProperties.$Fetch = useFetch
  }
}