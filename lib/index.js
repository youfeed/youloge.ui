import { h } from 'vue'
import {version} from '../package.json'

import './style/style.js';
import functions from "./functions/functions";
import directive from "./directive/directive";
import components from "./components/components";
import route from "./route/index";

const install = (app,config)=>{
  let session = Object.assign({ukey:'',APIURL:'',VIPURL:'',size:'12',mode:'hash',routes:[]}, config);
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
    // console.log(is)
  });
  // 单独处理Route路由
  app.mixin({
    beforeCreate(){
      let current = '/'

      // app.util.defineReactive('_route',current)
    },
    destroyed(){}
  })
  let x = app.component('x-view',{
    // template:`199<a>a</solt></a>`,
    template:'<h1>自定义组件!</h1>',
    // data(){},
  })
  // console.log(1,x)
  // console.log(3,new route(app,session))
  
  // app.provide('useRoute',route)
};

const Youloge = {
  install,
  name: 'Youloge',
  version: version,
  ...components,
  ...functions
}
export default Youloge;