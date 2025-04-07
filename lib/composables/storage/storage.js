/**
 * 仅支持对象
 * key 关键词
 * val 覆盖对象
 */
export default function useStorage(key,val=null){
  try{
    var Item = JSON.parse(localStorage.getItem(key)) || {};
  }catch(err){
    var Item = {};
  }
  if(val){
    Item = {...Item, ...val};
    localStorage.setItem(key,JSON.stringify(Item));
  }
  return Item;
}