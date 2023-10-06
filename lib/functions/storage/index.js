import useStorage from './storage.js'
useStorage.install = app =>{
  app.provide('useStorage',useStorage)
}
export default useStorage;