import useStorage from './storage.js'
useStorage.install = app =>{
  app.provide('useStorage',useStorage);
  app.config.globalProperties.useStorage = useStorage;
}
export default useStorage;