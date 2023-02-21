import {version} from '../package.json'

import './style/style.js';
import functions from "./functions/functions";
import directive from "./directive/directive";
import components from "./components/components";

const install = (app,options)=>{
  app.config.globalProperties.options = options;
  components.map((is) => {
    app.component(is.name, is);
  });
  functions.map(is=>{
    app.provide(is.name,is)
  })
  directive.map(is=>{
    app.directive(is.name,is)
  })
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