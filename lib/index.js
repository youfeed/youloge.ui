import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import {version} from '../package.json'
// 引入路由 
import { setupRoute } from "./mixins/route";
// 函数组件
import useLoading from './functions/loading'
import useFetch from './functions/fetch'
import useMessage from './functions/message'
import useDialog from './functions/dialog'
import usePayment from './functions/payment'
import usePlus from './functions/plus'
import useCaptcha from './functions/captcha'
import useLogin from './functions/login'
import useShopcart from './functions/shopcart'
import useStorage from './functions/storage'
const functions = {useLoading,useFetch,useMessage,useDialog,usePayment,usePlus,useCaptcha,useLogin,useShopcart,useStorage}
export { useLoading,useFetch,useMessage,useDialog,usePayment,usePlus,useCaptcha,useLogin,useShopcart,useStorage };
// 指令函数
import vCopy from "./directive/copy";
import vLogin from "./directive/login";
import vRipple from "./directive/ripple";
import vSearch from "./directive/search";
const directive =  {vCopy,vLogin,vRipple,vSearch};
export {vCopy,vLogin,vRipple,vSearch}
// 基础组件
import yAd from "./components/ad"
// import hashView from "./components/hashview";
import yHeader from "./components/header";
import yRich from "./components/rich"
import yDiscuss from "./components/discuss";
import yRgb from "./components/rgb";
import yVideo from "./components/video";
import yLogin from "./components/login";
import yPayment from "./components/payment";
import ySearch from "./components/search";
const components = {yAd,yHeader,yRich,yDiscuss,yRgb,yVideo,yLogin,yPayment,ySearch};
export {yAd,yHeader,yRich,yDiscuss,yRgb,yVideo,yLogin,yPayment,ySearch}
// 不要自动安装插件：要配置参数
//
export const install = (app,config)=>{
  let {UKEY,APIURL,VIPURL,ROUTES} = config;
  let session = Object.assign({UKEY:'',APIURL:'',VIPURL:'',WWWURL:'',OPENURL:'https://open.youloge.com',ROUTES:[]}, {UKEY,APIURL,VIPURL,ROUTES});
  sessionStorage.setItem('youloge',JSON.stringify(session));
  // 生成式组件没有根组件globalProperties属性值
  app.config.globalProperties.CONFIG = session;
  // 对象循环-不知道为啥会丢name
  Object.keys(components).forEach(key =>{
    app.component(key, components[key]);
  });
  Object.keys(functions).forEach(key=>{
    app.provide(key,functions[key])
  })
  Object.values(directive).forEach(val=>{
    app.directive(val.name,val) 
  })
  // 导出路由
  app.provide('useHash',ROUTES);
  // 导出配置
  app.provide('useConfig',session);
  // 混入路由
  setupRoute(ROUTES);
};
const youloge = { 'name':'youloge',version, install}
export default youloge
