/**
 * 配置文件读取与设置
**/
export default function useConfig(val=false){
  let data = JSON.parse(sessionStorage.getItem('youloge')||"{}");
  if(val){
    Object.assign(config,item);sessionStorage.setItem('youloge',JSON.stringify(data));
  }
  return data;
}