import { createApp } from 'vue'
import './style.css'
import '../dist/index.css'
import App from './App.vue'
// import youloge from '../dist/youloge.es'
import youloge from '../lib/index.js'
const app = createApp(App)
app.use(youloge,{
  'ak':'123456',
  'font-size':'12px',
  'APIURL':'https://api.youloge.com/',
  'VIPURL':'https://vip.youloge.com/',
}).mount('#app')
