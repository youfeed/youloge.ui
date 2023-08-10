import { createApp } from 'vue'
import './style.css'
import '../dist/index.css'
import App from './App.vue'
// import youloge from '../dist/youloge.es'
import youloge from '../lib/index.js'
const app = createApp(App)
app.use(youloge,{
  'ukey':'PEc8/t7+w5yfcl2lRr7N5GSQ/1seZLYR1tRU2iSoWJclRNPJbpRsz/YCwYEE5WqrPaCav7UzH4tCurwoMFlvyaFP9f2p7eBgmm748WShzzGooQGTxwl7Eb7TkJrg/Ujf',
  'font-size':'12px',
  'APIURL':'https://api.youloge.com',
  'VIPURL':'https://vip.youloge.com',
}).mount('#app')
