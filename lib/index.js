import './style/style.js';
import functions from "./functions/functions";
import components from "./components/components";
import directive from "./directive/directive";
const install = function(app,options){
  components.map((is) => {
    app.component(is.name, is);
  });
  functions.map(is=>{
    app.config.globalProperties[`$${is.name}`] = is;
    // provide
    app.provide(`use${is.name}`,is)
  })
  directive.map(is=>{
    console.log(1,is)
    app.directive(is.name,is)
  })
  // 单独处理Route路由
};
// if(typeof window !== 'undefined' && window.Vue){ install(window.Vue) }
const Youloge = {
  install,
  name: 'Youloge',
  version: '0.2.0',
  ...components,
  ...functions
}
export default Youloge;