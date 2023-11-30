/*
* 组件库未初始化
* 组件库专用方法
*/
export const getRandom32 = () => {
  return Math.random().toString(32).substr(2, 8);
}
export const getHashtag = () => {
  return `#${Math.random().toString(32)}`;
}
export const useConfig = () => {
  return JSON.parse(sessionStorage.getItem('youloge')||"{}");
}
export const setConfig = (item)=>{
  let config = useConfig();
  Object.assign(config,item);
  return sessionStorage.setItem('youloge',JSON.stringify(config));
}
export const useStorage = ()=>{
  return JSON.parse(localStorage.getItem('youloge')||"{}");
}
export const setStorage = (item)=>{
  let storage = useStorage();
  Object.assign(storage,item);
  return localStorage.setItem('youloge',JSON.stringify(storage));
}
export const useAuth = ()=>{
  let {expire,signature} = useStorage();
  return signature && expire > new Date().getTime() / 1000 >> 0;
}
export const apiFetch = (routed,method,params={})=>{
  let {UKEY,APIURL} = useConfig(),body = {method:method,params:params};
  return fetch(`${APIURL}/${routed}`,{method:'post',headers:{"Content-Type": "application/json",ukey:UKEY},body:JSON.stringify(body)}).then(r=>r.json());
}
export const vipFetch = (routed,method,params={}) =>{
  let {VIPURL} = useConfig(),{signature} = useStorage(),body = {method:method,params:params};
  return fetch(`${VIPURL}/${routed}`,{method:'post',headers:{"Content-Type": "application/json",Signature:signature},body:JSON.stringify(body)}).then(r=>r.json());
}
// VIPURL APIURL OPENURL
export const getConfig = (key) => {
  console.log(JSON.parse(sessionStorage.getItem('youloge')||"{}")['OPENURL'])
  const {[key]:result} = JSON.parse(sessionStorage.getItem('youloge')||"{}");
  return result || {};
}