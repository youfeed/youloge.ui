/**
 * 系统会侦测UUID
 * 官方UUID：不区分开发者Ukey 文件ID 视频ID 用户ID 
 * 评论UUID：原文地址与Referer不符会有明显提示:[查看原文] 
 * 任意字符串：自动转义成评论UUID(Ukey区分+Referer)
 */
import yDiscuss from './discuss.vue'
yDiscuss.install = app=>{
  app.component('y-discuss', yDiscuss);
}
export default yDiscuss