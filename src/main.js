import { createApp } from 'vue'

// import '../dist/index.css'
import App from './App.vue'
// import youloge from '../dist/youloge.es'
import Layout from './components/Layout.vue'
// import youloge, {functions,version,useLoading,useMessage} from '../lib/index.js'
import  youloge,{useLoading} from '../lib/index.js'
console.log('app',youloge,useLoading)
const app = createApp(App)
// * 处理路由
const modules = import.meta.glob(['/views/*.vue','/views/*/*.vue','/views/*/*/*.vue']);
const routes = []
for (const key in modules) {
  const mod = await modules[key]();
  const {name,icon} = mod.default;
  routes.push({
    name: name|| 'name',
    path:key.replace(/^\/views|\.vue$/g, ''),
    icon:icon || 'icon',
    component:modules[key],
  })
}
// console.log('modules',modules,routes)
app.use(youloge,{
  'ukey':'qRjE+HMLB8WcnAvdcon5Lx2BSGid7OdQUd5ozRV8QHj4sgP91+Y6xMfhrHZbONGpLErJGMZFZ8GAcEwINSE4VjwdEvna0DwHUJ3zzQNFlQg8s8nhqo4/I3y00q31eYi4',
  'APIURL':'https://api.youloge.com',
  'VIPURL':'https://www.youloge.com',
  'route':{
    layout:Layout,
    routes:routes
  }
}).mount('#app');

