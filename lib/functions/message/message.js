import yMessage from './message.vue'

const useMessage = (cfg)=>{
  let config = cfg || {}
  config.timer = null
  // ['success','warning','info','error']
  const success = ()=>{
    console.log('success')
    console.log('config',config)
  }
  return {success}
}

export default {name:'useMessage',use:useMessage};