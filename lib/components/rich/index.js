/**
 * 由于内嵌视频图片会有跨域问题
 * 后续想办法支持将渲染html回传
 * 【不限制使用任何编辑器：但是最终必须转成 JSON格式】
 */
import yRich from './rich.vue';
yRich.install = app => {
  app.component('y-rich', yRich);
};
export default yRich;