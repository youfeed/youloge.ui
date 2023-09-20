import { nextTick } from "vue"
const vRipple = {
  name:'ripple',
  mounted(el, binding, vnode, prevVnode){
    let computedStyles  = getComputedStyle(el)
    // console.log(computedStyles)
    el.addEventListener('pointerdown', (e) => {
      const target = e.currentTarget;
      const { top, left } = target.getBoundingClientRect();
      const { clientWidth, clientHeight } = target;
      const diameter = Math.sqrt(clientWidth ** 2 + clientHeight ** 2);
      const radius = diameter / 2;
      const localX = e.clientX - left;
      const localY = e.clientY - top;
      const ripple = document.createElement('span');
      console.log(radius, clientWidth, clientHeight)
      ripple.setAttribute(
        'style',
        `
          pointer-events: none;
          position: absolute; background-color: currentColor; border-radius: 50%; opacity: 0.2;
          transform: scale(0);
          width: ${diameter}px;
          height: ${diameter}px;
          left: ${localX - radius}px;
          top: ${localY - radius}px;
        `,
      );

    target.appendChild(ripple);
    ripple.addEventListener('animationend', ()=>{
      console.log('unmounted')
    });
      nextTick(()=>{
        ripple.animate([
          { transform:'scale(0)'},
          { transform:'scale(4)'},
        ],
        {
          iterations: 1,
          duration: 200,
          easing:'linear',
        })
      });
      setTimeout(() => {
        ripple.remove()
      }, 30000);
      // 
    })
  },
  unmounted(){
    console.log('unmounted')
  }
}
export default  vRipple;
