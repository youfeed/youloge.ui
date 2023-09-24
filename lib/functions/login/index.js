import useLogin from './login.js'
useLogin.install = app =>{
  app.provide('useLogin',useLogin)
}
export default useLogin;