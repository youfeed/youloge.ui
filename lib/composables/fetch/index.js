import useFetch from './fetch.js'
useFetch.install = app =>{
  app.provide('useFetch',useFetch);
  app.config.globalProperties.useFetch = useFetch;
}
export default useFetch;