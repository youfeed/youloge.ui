import useTheme from './theme.js'
useTheme.install = app =>{
  app.provide('useTheme',useTheme);
  app.config.globalProperties.useTheme = useTheme;
}
export default useTheme;