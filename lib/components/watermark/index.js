/**
 * 水印组件
 * 
 */
import yWatermark from "./watermark.vue";
yWatermark.install = (app) => {
  app.component("y-watermark", yWatermark);
};
export default yWatermark;
