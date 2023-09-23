import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import {version} from '../package.json'
// 函数组件
import useLoading from './functions/loading/index.js'
import useFetch from './functions/fetch/fetch.js'
import useMessage from './functions/message/message.js'
import useDialog from './functions/dialog/dialog.js'
import usePayment from './functions/payment/payment.js'
import usePlus from './functions/plus/plus.js'
import useCaptcha from './functions/captcha/captcha.js'
import useLogin from './functions/login/login.js'
export { useLoading,useFetch,useMessage,useDialog,usePayment,usePlus,useLogin };
// 指令函数
import vCopy from "./directive/copy/copy.js";
import vLogin from "./directive/login/login.js";
import vRipple from "./directive/ripple/ripple.js";
export { vCopy,vLogin,vRipple };
// 基础组件
import yAd from "./components/ad/ad.js"
import hashView from "./components/hashview/hashview.js";
import yHeader from "./components/header/header.js";
import yRich from "./components/rich/rich.js"
import yDiscuss from "./components/discuss/discuss.js";
import yRgba from "./components/rgba/rgba.js";
import yVideo from "./components/video/video.js";
import yLogin from "./components/login/login.js";
export { yAd,yHeader,hashView,yRich,yDiscuss,yRgba,yVideo,yLogin };
// 不要自动安装插件：要配置参数
const install = (app,config)=>{
  let {ukey,APIURL,VIPURL,route} = config;
  let session = Object.assign({ukey:'',APIURL:'',VIPURL:'',IFRAME:'https://open.youloge.com'}, {ukey,APIURL,VIPURL});
  sessionStorage.setItem('youloge',JSON.stringify(session));
  app.config.globalProperties.CONFIG = session;
  
  [useLoading,useFetch,useMessage,useDialog,usePayment,usePlus,useLogin].forEach(is=>{
    app.provide(is.name,is)
  });
  [vCopy,vLogin,vRipple].forEach(is=>{
    app.directive(is.name,is) 
  });
  [yAd,yHeader,hashView,yRich,yDiscuss,yRgba,yVideo,yLogin].forEach((is) =>{
    app.component(is.name, is);
  });
  // 单独处理Route路由
  app.provide('useHash',route);
};

export default {
  name:'youloge',
  version:version,
  install:install
}