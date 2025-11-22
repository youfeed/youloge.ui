import useViews from './views.js'
useViews.install = app =>{
  app.provide('useViews',useViews);
  app.config.globalProperties.useViews = useViews;
}
export default useViews;