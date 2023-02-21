import useLogin from './login.js'

export default {
  install(app){
    app.provide(`useLogin`,useLogin)
    app.config.globalProperties.$Login = useLogin
  }
}