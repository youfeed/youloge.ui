import useDialog from './dialog.js'
useDialog.install = app =>{
  app.provide('useDialog',useDialog)
}
export default useDialog;