import { nextTick } from "vue"

const useRipple = {
  name:'ripple',
  mounted(el, binding, vnode, prevVnode){
    el.addEventListener('pointerdown', (e) => {
      console.log(e)
      el.style.overflow = 'hidden'
      let ripple = document.createElement('div')
      ripple.className = 'y-ripple'
      ripple.style = `position: absolute;transform: translate(-50%,-50%);  pointer-events: none; overflow: hidden;background: currentColor; border-radius: 50%;`;
      ripple.style.top =  e.offsetY + 'px'
      ripple.style.left =  e.offsetX + 'px'
      el.appendChild(ripple) 
      nextTick(()=>{
        ripple.animate([
          {width: '0px', height:'0px', opacity: .8},
          {width: '400px', height:'400px', opacity: 0},
        ],
        {
          iterations: 1,
          duration: 200,
          easing:'ease',
        })
      })
      setTimeout(() => {
        ripple.remove()
      }
      , 200)
    })
  },
  unmounted(){
    
  }
}

export default useRipple;