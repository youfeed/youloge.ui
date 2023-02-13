import Login from './login.js'

export default {
  install(app){
    app.config.globalProperties.$Login = Login
  }
}