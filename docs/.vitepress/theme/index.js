
import DefaultTheme from 'vitepress/theme'
import '../../../dist/style.css'
import youloge from '../../../dist/youloge.es.js'

export default {
    extends:DefaultTheme,
    enhanceApp({app}){
        app.use(youloge,{APIKEY:''})
    }
};