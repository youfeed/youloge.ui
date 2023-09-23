import { getCurrentInstance } from "vue";

const getRandom32 = () => {
  return Math.random().toString(32).substr(2, 8);
}
const getHashtag = () => {
  return `#${Math.random().toString(32)}`;
}
// 
const getConfig = (key) => {
  console.log(JSON.parse(sessionStorage.getItem('youloge')||"{}")['IFRAME'])
  const {[key]:result} = JSON.parse(sessionStorage.getItem('youloge')||"{}");
  return result || {};
}
const setConfig = (key,val) =>{
  const config = JSON.parse(sessionStorage.getItem('youloge')||"{}");
  const configs = {...result, [key]:val}
  sessionStorage.setItem('youloge',JSON.stringify(configs))
  return config;
}
export {getConfig,setConfig,getHashtag,getRandom32}