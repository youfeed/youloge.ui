import loading from "../loading/loading.js"
const useFetch = (cfg={})=>{
  let {APIURL,VIPURL,ukey} = JSON.parse(sessionStorage.getItem('youloge')|| '{}'),config = {...{ukey:ukey,APIURL:APIURL,VIPURL:VIPURL,mask:false},...cfg};
  let lang = navigator.language.toLowerCase();
  const request = (url='',options={},type='json')=>{
    options.headers.lang = lang;
    let {mask} = config,load = mask &&  loading.use();
    return new Promise((resolve,reject)=>{
      mask && load.show();
      return fetch(url,options).then(r=>r[type]()).then(r=>{
        let action = {
          200:()=>resolve(r),
          403:()=>(localStorage.removeItem('youloge'),reject(r)),
        }
        action[r.err] ? action[r.err]() : reject(r);
      }).catch(e=>reject(e))
    }).finally(()=>{
      mask && load.hide();
    });
  }
  const signature = ()=>JSON.parse(localStorage.getItem('youloge') || '{"signature":""}')['signature'];

  const json = (url='',options={})=>request(url,options,'json') 
  const text = (url='',options={})=>request(url,options,'text')
  const blob = (url='',options={})=>request(url,options,'blob')
  const buffer = (url='',options={})=>request(url,options,'arrayBuffer')

  const api = (path='',method='',params={})=>request(`${APIURL}/${path}`,{method:'post',headers:{"Content-Type": "application/json",ukey:ukey},body:JSON.stringify({method:method,params:params})})
  const vip = (path='',method='',params={})=>request(`${VIPURL}/${path}`,{method:'post',headers:{"Content-Type": "application/json",signature:(signature())},body:JSON.stringify({method:method,params:params})})
  return {api,vip,json,text,blob,buffer}
}
export default {name:'useFetch',use:useFetch}