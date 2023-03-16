import loading from "../loading/loading.js"
const useFetch = (cfg={})=>{
  let {APIURL,VIPURL,ukey} = JSON.parse(sessionStorage.getItem('youloge')|| '{}'),config = {...{ukey:ukey,APIURL:APIURL,VIPURL:VIPURL,mask:false},...cfg};

  const request = (url='',options={},type='json')=>{
    let {mask} = config,load = mask &&  loading.use();
    return new Promise((resolve,reject)=>{
      mask && load.show()
      fetch(url,options).then(r=>r[type]()).then(r=>{
        r.err === -1 ? (localStorage.removeItem('youloge'),reject(r)):resolve(r);
      }).catch(e=>reject(e))
    }).finally(()=>{
      mask && load.hide();
    });
  }
  const signer = ()=>JSON.parse(localStorage.getItem('youloge')|| '{"signer":""}')['signer']

  const json = (url='',options={})=>request(url,options,'json')
  const text = (url='',options={})=>request(url,options,'text')
  const blob = (url='',options={})=>request(url,options,'blob')
  const buffer = (url='',options={})=>request(url,options,'arrayBuffer')

  const api = (method='',params={})=>request(APIURL,{method:'post',headers:{ukey:ukey},body:JSON.stringify({method:method,params:params})})
  const vip = (method='',params={})=>request(VIPURL,{method:'post',headers:{signer:signer()},body:JSON.stringify({method:method,params:params})})
  return {api,vip,json,text,blob,buffer}
}
export default {name:'useFetch',use:useFetch}