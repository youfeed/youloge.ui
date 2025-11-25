import useDialog from './dialog.js'
useDialog.install = app =>{
  app.provide('useDialog',useDialog)
  app.config.globalProperties.useDialog = useDialog;
}
export default useDialog;