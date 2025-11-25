/**
 * 挂载指令 - 对v-html 的扩展
 * 挂载 DOM 对象到指令所在元素
 * */
const vDom = {
    name:'dom',
    mounted(el, binding){
        if (!(binding.value instanceof HTMLElement)) return;
        el.innerHTML = '';
        el.appendChild(binding.value);
    },
    unmounted(el){
    }
}
export default vDom;