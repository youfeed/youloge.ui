import yLogin from './login.js'

export default {
  install(app){
    app.config.globalProperties.$Login = yLogin
  }
}