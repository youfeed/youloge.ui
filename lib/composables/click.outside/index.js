import useClickOutside from './outside.js'
useClickOutside.install = app =>{
  app.provide('useClickOutside',useClickOutside);
  app.config.globalProperties.useClickOutside = useClickOutside;
}
export default useClickOutside;