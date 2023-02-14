import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import youloge from '../dist/youloge.es'
createApp(App).use(youloge).mount('#app')
