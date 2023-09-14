import { h,effectScope,computed,renderSlot,resolveComponent } from 'vue'
import {version} from '../package.json'

import './style/style.js';
import functions from "./functions/functions";
import directive from "./directive/directive";
import components from "./components/components";
import route from "./route/hash.js";

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
  app.component('hash-link', {
    props: ['href'],
    render(){
      return h('a',{
        name:'default',
        class:'hash-link',
        href:`#${this.$props.href}`
      },renderSlot(this.$slots,"default")
    )}
  })
  let x = app.component('hash-view',{
    props: ['msg'],
    render(){
      return h('component', {
        is:'name'
        // resolveComponent('404')
      },[]);
    }
  })
  //
  const scope = effectScope()
  // 单独处理Route路由
  app.mixin({
    beforeCreate(){
      scope.run(()=>{
        const current = computed(()=>location.hash)
        console.log(current)
      })
    },
    destroyed(){
      scope.stop()
    }
  })
  
  console.log(1,x)
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