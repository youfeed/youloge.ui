/**
 * 素材选择选择器
 * 图片 视频 音频 附件
 **/
import { createApp,markRaw } from 'vue';
import yMaterial from './material.vue'
let dialogApp = null, el = null;
export default function useMaterial(options) {
    return new Promise((resolve, reject) => {
        el = document.createElement('div'); el.className = 'y-material-container';
        if (dialogApp) {
            el.remove();
            dialogApp.unmount();
            dialogApp = null;
        }
        options.onConfirm = (item) => {
            console.log('onConfirm');
            el.remove(); dialogApp.unmount(); resolve(item);
        }
        options.onCancel = () => {
            console.log('onCancel');
            el.remove(); dialogApp.unmount(); reject();
        }
        let app = createApp(yMaterial, options);
        dialogApp = markRaw(app);
        document.body.appendChild(el); dialogApp.mount(el);
    });
}