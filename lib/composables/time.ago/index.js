import useTimeAgo from './ago.js'
useTimeAgo.install = app =>{
  app.provide('useTimeAgo',useTimeAgo);
  app.config.globalProperties.useTimeAgo = useTimeAgo;
}
export default useTimeAgo;