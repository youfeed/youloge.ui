import useLoading from './loading.js'
useLoading.install = app => {
  app.provide('useLoading',useLoading);
  app.config.globalProperties.useLoading = useLoading;
}
export default useLoading