import Password from './password.js'
export default {
  install(app){
    app.config.globalProperties.$password = Password
  }
}