import useImage from './image.js'
useImage.install = app => {
  app.provide('useImage',useImage);
  app.config.globalProperties.useImage = useImage;
}
export default useImage