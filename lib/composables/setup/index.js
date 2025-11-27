import useSetup from './setup.js'
useSetup.install = app =>{
  app.provide('useSetup',useSetup);
  app.config.globalProperties.useSetup = useSetup;
}
export default useSetup;