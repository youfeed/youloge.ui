import useLoading from "../loading/loading.js"
import useConfig from "../config";
import useStorage from "../storage";
export default function useFetch(cfg={}){
  let {APIURL,VIPURL,UKEY} = useConfig(),config = {...{mask:true,duration:8000},...cfg};
  const request = (url='',options={},type='json')=>{
    let loading = useLoading();
    options.headers.lang = navigator.language.toLowerCase();
    return new Promise((resolve,reject)=>{
      config.mask && loading.show();
      return fetch(url,options).then(r=>r[type]()).then(r=>{
        let action = {
          200:()=>resolve(r),
          403:()=>(useStorage('youloge',{}),reject(r)),
        }
        action[r.err] ? action[r.err]() : reject(r);
      }).catch(e=>reject(e))
    }).finally(()=>{
      config.mask && loading.hide();
    });
  }
  const signature = ()=>useStorage('youloge')['signature'];

  const json = (url='',options={})=>request(url,options,'json') 
  const text = (url='',options={})=>request(url,options,'text')
  const blob = (url='',options={})=>request(url,options,'blob')
  const buffer = (url='',options={})=>request(url,options,'arrayBuffer')
  const api = (path='',method='',params={})=>request(`${APIURL}/${path}`,{method:'post',headers:{"Content-Type": "application/json",ukey:UKEY},body:JSON.stringify({method:method,params:params})})
  const vip = (path='',method='',params={})=>request(`${VIPURL}/${path}`,{method:'post',headers:{"Content-Type": "application/json",signature:(signature())},body:JSON.stringify({method:method,params:params})})
  return {api,vip,json,text,blob,buffer};
}