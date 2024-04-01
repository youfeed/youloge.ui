/*
* 组件库未初始化
* 组件库专用方法
*/
export const getRandom32 = () => {
  return Math.random().toString(32).substring(2, 8);
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
export const apiFetch = (routed,params={})=>{
  let {UKEY,APIURL} = useConfig()
  return fetch(`${APIURL}/${routed}`,{method:'post',headers:{"Content-Type": "application/json",ukey:UKEY},body:JSON.stringify(params)}).then(r=>r.json());
}
export const vipFetch = (routed,params={}) =>{
  let {VIPURL} = useConfig(),{signature} = useStorage()
  return fetch(`${VIPURL}/${routed}`,{method:'post',headers:{"Content-Type": "application/json",signature:signature},body:JSON.stringify(params)}).then(r=>r.json());
}