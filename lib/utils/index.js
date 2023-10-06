import { getCurrentInstance } from "vue";

const getRandom32 = () => {
  return Math.random().toString(32).substr(2, 8);
}
const getHashtag = () => {
  return `#${Math.random().toString(32)}`;
}
const useConfig = () => {
  return JSON.parse(sessionStorage.getItem('youloge')||"{}");
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
export {useConfig,getConfig,setConfig,getHashtag,getRandom32}