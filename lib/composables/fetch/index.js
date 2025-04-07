import useFetch from './fetch.js'
useFetch.install = app =>{
  app.provide('useFetch',useFetch)
}
export default useFetch;