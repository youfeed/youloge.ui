const useFetch = (config={})=>{
  let {APIURL,VIPURL} = JSON.parse(sessionStorage.getItem('youloge')),signer = localStorage.getItem('signer');
  (typeof config == 'string') && (APIURL = VIPURL = config);
  
  
  const json = (url='',options={})=>{
    return fetch(url,options).then(r=>r.json()).then(r=>{return r}).catch(e=>{return e})
  }
  const text = (url='',options={})=>{
    return fetch(url,options).then(r=>r.text()).then(r=>{return r}).catch(e=>{return e})
  }
  const blob = (url='',options={})=>{
    return fetch(url,options).then(r=>r.blob()).then(r=>{return r}).catch(e=>{return e})
  }
  const api = (method='',params={})=>{
    let body = {method:method,params:params};
    return json(APIURL,{method:'post',headers:{signer:signer},body:JSON.stringify(body)})
  }
  const vip = (method='',params={})=>{
    let body = {method:method,params:params};
    return json(VIPURL,{method:'post',headers:{signer:signer},body:JSON.stringify(body)})
  }
  return {api,vip,json,text,blob}
}
export default {name:'useFetch',use:useFetch}