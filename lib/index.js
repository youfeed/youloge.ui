import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import {version} from '../package.json'
import functions from "./functions/functions";
import directive from "./directive/directive";
import components from "./components/components";
const install = (app,config)=>{
  let {ukey,APIURL,VIPURL,route} = config;
  let session = Object.assign({ukey:'',APIURL:'',VIPURL:''}, {ukey,APIURL,VIPURL});
  sessionStorage.setItem('youloge',JSON.stringify(session));
  app.config.globalProperties.$config = session;
  
  functions.forEach(is=>{
    app.provide(is.name,is)
  })
  directive.forEach(is=>{
    app.directive(is.name,is) 
  })
  components.forEach((is) =>{
    app.component(is.name, is);
  });
  // 单独处理Route路由
  app.provide('useHash',route);
};

const Youloge = {
  install,
  name: 'Youloge',
  version: version,
  ...components,
  ...functions
}
export default Youloge;