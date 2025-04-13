/*
* 组件库未初始化
* 组件库专用方法
*/
export const useConfig = (key,val=false) => {
  let data = JSON.parse(sessionStorage.getItem(key)||"{}");
  if(val){
    Object.assign(config,item);sessionStorage.setItem(key,JSON.stringify(data));
  }
  return data;
}
export const useStorage = (key,val=false)=>{
  let data = JSON.parse(localStorage.getItem(key)||"{}");
  if(val){
    Object.assign(config,item);localStorage.setItem(key,JSON.stringify(data));
  }
  return data;
}
export const useAuth = ()=>{
  let {expire,signature} = useStorage('profile');
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
/**
 * 表单校验规则
 * @param {object} rule 规则
 * @param {string} value 值
 * @param {function} callback 回调函数
 * @returns {void}
 * @example
 * required
**/ 
export const useValidate = (rule,value,callback)=>{
  let [rules,message] = rule.split('#');
  let [ss] = rules.split('|');

}
/*
* ====================================
* 全局实例属性或方法
* 默认导出 default
* ====================================
*/
/**
 * 用户个人资料
 * @returns {string} 用户个人资料
 * @param {string} key 键名
 * @param {string} def 默认值
 * @example
 * const profile = atProfile('name','未登录'); // {id:1,name:'张三'}
*/
export const atProfile = (key,def='')=>{
    let {[key]:data} = useStorage('profile'); return data || def;
};
/**
 * 用户是否登录
 * @returns {boolean} 是否登录
 * @example
 * const isLogin = atAuth(); // true
 * 
*/
export const atLogged = ()=>{
    let {expire,access_token} = useStorage('profile');
    return access_token && expire > (new Date().getTime() / 1000 >> 0);
}
/*
* 图片URL处理
*/
export const atImage = (uuid,size=80)=>{
  return `https://img.youloge.com/${uuid}!${size}`
}
/*
* 字节转 KB MB GB TB
*/
export const atBytes = (size)=>{
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }
    return `${index === 0 ? size : size.toFixed(2)} ${units[index]}`;
}
/*
* 字面量时间
*/
export const atTimeago = (t,offset=0) =>{
    const tar = Number(t) ? new Date(Number(t) * 1000) : new Date(t.replace(/-/g, '/'));
    const now = new Date();
    const timeUnits = [
        { get: 'getFullYear', unit: ['年',' Years'] },
        { get: 'getMonth', unit: ['月',' Months'] },
        { get: 'getDate', unit: ['天',' Days'] },
        { get: 'getHours', unit: ['小时',' Hours'] },
        { get: 'getMinutes', unit: ['分钟',' Minutes'] }
    ];
    for (const { get, unit } of timeUnits) {
        const diff = now[get]() - tar[get]();
        if (diff!== 0) {
            return `${Math.abs(diff)}${unit[offset]}${diff > 0 ? ['前',' ago'][offset] : ['后',' after'][offset]}`;
        }
    }
    return ['刚刚','just now'][offset];
}

export default {
    atLogged,atProfile,atBytes,atImage,atTimeago,
}