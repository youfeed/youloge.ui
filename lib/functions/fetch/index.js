import Fetch from './fetch.js'

export default {
  install(app){
    app.config.globalProperties.$Fetch = Fetch
  }
}