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
export const useConfig = (key,val) => {
  let data = JSON.parse(sessionStorage.getItem(key)||"{}");
  if(val){
    Object.assign(config,item);sessionStorage.setItem(key,JSON.stringify(data));
  }
  return data;
}
export const useStorage = (key,val)=>{
  let data = JSON.parse(localStorage.getItem(key)||"{}");
  if(val){
    Object.assign(config,item);localStorage.setItem(key,JSON.stringify(data));
  }
  return data;
}
export const useAuth = ()=>{
  let {expire,signature} = useStorage();
  return signature && expire > new Date().getTime() / 1000 >> 0;
}
export const apiFetch = (routed,params={})=>{
  let {APIKEY,APIURL} = useConfig(),{access_token} = useStorage('profile');
  return fetch(`${APIURL}/${routed}`,{method:'post',headers:{
    "Content-Type": "application/json",
    Organization:APIKEY,Authorization:access_token
  },body:JSON.stringify(params)}).then(r=>r.json());
}
export const vipFetch = (routed,params={}) =>{
  let {APIKEY,VIPURL} = useConfig(),{access_token} = useStorage('profile')
  return fetch(`${VIPURL}/${routed}`,{method:'post',headers:{
    "Content-Type": "application/json",
    Organization:APIKEY,Authorization:access_token
  },body:JSON.stringify(params)}).then(r=>r.json());
}