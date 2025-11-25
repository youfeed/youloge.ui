import yMessage from './message.vue'
import { createApp } from 'vue'

let singleton = {
    app:null,
    vm:null,
    el:null,
};
const initInstance = () => {
    if (singleton.el) return;
    //
    const el = document.createElement('div');
    el.className = 'y-message-instance';document.body.appendChild(el);
    //
    const app = createApp(yMessage);
    const vm = app.mount(el);
    singleton.app = app;
    singleton.vm = vm;
    singleton.el = el;
}

export default function useMessage() {
    initInstance();
    //
    const onCreate = (type,options)=>{
        const config = typeof options === 'object' ? options : { content: options };
        console.log('config',config)
        config.type = type;
        const uuid = singleton.vm.create(config)
        return {
            uuid:uuid,
            close:()=>singleton.vm.close(uuid),
            destroy:()=>singleton.vm.destroy()
        }
    }
    //
    const success = deploy => onCreate('success',deploy);
    const warning = deploy => onCreate('warning',deploy);
    const error = deploy => onCreate('error',deploy);
    const info = deploy => onCreate('info',deploy);

    return {
        success:success,
        warning:warning,
        error:error,
        info:info,
    }
}