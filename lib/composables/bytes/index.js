import useBytes from './bytes.js'
useBytes.install = app => {
  app.provide('useBytes',useBytes);
  app.config.globalProperties.useBytes = useBytes;
}
export default useBytes