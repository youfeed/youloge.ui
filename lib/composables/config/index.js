import useConfig from './config.js'
useConfig.install = app =>{
  app.provide('useConfig',useConfig);
  app.config.globalProperties.useConfig = useConfig;
}
export default useConfig;