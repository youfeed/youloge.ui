import {version} from '../package.json'

import './style/style.js';
import functions from "./functions/functions";
import directive from "./directive/directive";
import components from "./components/components";

const install = (app,config)=>{
  let session = Object.assign({ak:'',APIURL:'',VIPURL:'',size:'12'}, config);
  sessionStorage.setItem('youloge',JSON.stringify(session));

  app.config.globalProperties.$config = session;
  functions.map(({name,use})=>{
    app.provide(name,use)
  })
  directive.map(({name,use})=>{
    app.directive(name,use)
  })
  components.map((is) =>{
    app.component(is.name, is);
  });
  // 单独处理Route路由
};

const Youloge = {
  install,
  name: 'Youloge',
  version: version,
  ...components,
  ...functions
}
export default Youloge;