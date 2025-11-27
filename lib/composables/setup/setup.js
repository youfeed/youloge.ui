/**
 * 全屏独立加载异步路由
 * 用于非跳转加载页面
**/
import ySetup from './setup.vue'
import { h, render, inject } from 'vue'

export default function useSetup(options, element = null) {
    const { promise, resolve, reject } = Promise.withResolvers();
    const container = document.querySelector('y-setup-container') || (
        element = document.createElement('div'),
        element.className = 'y-setup-container',
        document.body.appendChild(element),
        element
    );
    // 
    document.body.style.overflow = 'hidden'
    const onDestroy = () => {
        container.remove();
        document.body.style.overflow = 'auto'
    }
    // 
    const routes = inject('getRoutes')
    // 创建虚拟节点并渲染
    const vnode = h(ySetup, {
        ...options,
        routes: routes,
        ready: (data) => {
            console.log('ready', data)
            resolve({
                ...data,
                ...routes,
                destroy: () => onDestroy()
            })
        },
        error: () => {
            reject()
        },
        destroy: () => onDestroy()
    });
    render(vnode, container);
    return promise;
}