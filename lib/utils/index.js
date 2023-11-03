/*
* 组件库未初始化
* 组件库专用方法
*/
const getRandom32 = () => {
  return Math.random().toString(32).substr(2, 8);
}
const getHashtag = () => {
  return `#${Math.random().toString(32)}`;
}
const useConfig = () => {
  return JSON.parse(sessionStorage.getItem('youloge')||"{}");
}
const useStorage = ()=>{
  return JSON.parse(localStorage.getItem('youloge')||"{}");
}
const apiFetch = (routed,method,params={})=>{
  let {ukey,APIURL} = useConfig(),body = {method:method,params:params};
  return fetch(`${APIURL}/${routed}`,{method:'post',headers:{"Content-Type": "application/json",ukey:ukey},body:JSON.stringify(body)}).then(r=>r.json());
}
const vipFetch = (routed,method,params={}) =>{
  let {VIPURL} = useConfig(),{signature} = useStorage(),body = {method:method,params:params};
  return fetch(`${VIPURL}/${routed}`,{method:'post',headers:{"Content-Type": "application/json",Signature:signature},body:JSON.stringify(body)}).then(r=>r.json());
}
// VIPURL APIURL OPENURL
const getConfig = (key) => {
  console.log(JSON.parse(sessionStorage.getItem('youloge')||"{}")['OPENURL'])
  const {[key]:result} = JSON.parse(sessionStorage.getItem('youloge')||"{}");
  return result || {};
}
const setConfig = (key,val) =>{
  const config = JSON.parse(sessionStorage.getItem('youloge')||"{}");
  const configs = {...result, [key]:val}
  sessionStorage.setItem('youloge',JSON.stringify(configs))
  return config;
}
export {useConfig,useStorage,vipFetch,apiFetch,getConfig,setConfig,getHashtag,getRandom32}