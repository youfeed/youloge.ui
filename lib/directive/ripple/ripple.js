import { nextTick } from "vue"

const useRipple = {
  mounted(el, binding, vnode, prevVnode){
    let computedStyles  = getComputedStyle(el)
    el.addEventListener('mousedown', (e) => {
      el.style.position = 'relative'
      el.style.overflow = 'hidden'

      console.log(computedStyles.position,e.clientX,el.offsetLeft)
      let ripple = document.createElement('div')
      ripple.className = 'y-ripple'
      ripple.style.top = e.clientY - el.offsetTop + 'px'
      ripple.style.left = e.clientX - el.offsetLeft + 'px'
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
  unmounted(){}
}

export default {name:'ripple',use:useRipple}