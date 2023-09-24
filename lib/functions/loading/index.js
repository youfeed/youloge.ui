import useLoading from './loading.js'
useLoading.install = app => {
  app.provide('useLoading',useLoading);
}
export default useLoading