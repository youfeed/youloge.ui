const useFetch = {
  name:'useFetch',
  api(method,params){
    return this.ajax('//api.youloge.com',{},{method:method,params:params})
  },
  vip(method,params){
    return this.ajax('//vip.youloge.com',{access:localStorage.getItem('token')},{method:method,params:params})
  },
  ajax(url,head={},params={}){
    return fetch(url,{method:'post',headers:head,body:JSON.stringify(params)}).then(r=>r.json()).then(r=>{
      return r
    }).catch(e=>{
      return e
    })
  } 
}
export default useFetch