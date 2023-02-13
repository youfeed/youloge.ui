export default class Route{
  constructor(app,options){
    this.app = app;this.options=options;this.current = '/';
    this.mode = options.mode;this.routes = options.routes;this.routed = [];
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
    this.routes.forEach(route => this.addRoute(route))
    // console.log('this.current',this.current);
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