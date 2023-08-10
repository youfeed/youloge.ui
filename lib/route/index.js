export default class useRoute{
  constructor(app,options){
    this.app = app;this.options=options;this.current = '/';
    this.mode = options.mode;this.routes = options.routes;this.routed = [
      {
        path:'404',
        title:'Bad request',
        method:'*',
        component:'<div>404 Pages no found</div>',
      }
    ];
    this.init()
  }
  init(){
    location.pathname ? '' : location.pathname = '/';
    window.addEventListener('load', () => {
      this.current = location.pathname;
      // console.log('this.load',this.current);
    })
    window.addEventListener('popstate', () => {
      this.current = location.pathname;
      // console.log('this.popstate',this.current);
    })
    // 遍历路由
    this.routes.forEach(route => this.addRoute(route))
  }
  // 渲染函数
  reduce(){
    return this.routes.reduce((res, current) => {
      res[current.path] = current.component;
      return res;
    }, {})
  }
  // 添加路由
  addRoute(route){
    this.routed.push(route)
  }
}