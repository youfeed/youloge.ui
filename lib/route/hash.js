export default class useHash{
  constructor(app,options){
    this.app = app;
    this.routes = options.routes;
    this.init()
  }
  init(){
    window.addEventListener("hashchange", ()=>{
        console.log("The hash has changed!");
    },false,);
    // 遍历路由
    this.routes.forEach(route => this.addRoute(route))
  }
  addRoute(route){
    this.routed.push(route)
  }
  toRoute(route){

  }
}