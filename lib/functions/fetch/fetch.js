import loading from "../loading/loading.js"
const useFetch = (cfg={})=>{
  let {APIURL,VIPURL} = JSON.parse(sessionStorage.getItem('youloge')|| '{}'),{signer} = JSON.parse(localStorage.getItem('youloge')|| '{}');
  let config = Object.assign({APIURL:APIURL,VIPURL:VIPURL,signer:signer,mask:false},cfg);

  const request = (url='',options={},type='json')=>{
    let {mask} = config
    let load = mask ?  loading.use() : '';
    mask && load.show();
    return fetch(url,options).then(r=>r[type]()).then(r=>{
      mask && load.hide();
      r.err == -1 && localStorage.removeItem('youloge');
      return r
    }).catch(e=>{
      mask && load.hide();
      return e
    })
  }

  const text = (url='',options={})=>request(url,options,'text')
  const blob = (url='',options={})=>request(url,options,'blob')
  const buffer = (url='',options={})=>request(url,options,'arrayBuffer')

  const api = (method='',params={})=>request(APIURL,{method:'post',headers:{signer:config.signer},body:JSON.stringify({method:method,params:params})})
  const vip = (method='',params={})=>request(VIPURL,{method:'post',headers:{signer:config.signer},body:JSON.stringify({method:method,params:params})})
  return {api,vip,text,blob,buffer}
}
export default {name:'useFetch',use:useFetch}