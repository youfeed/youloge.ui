import youloge from '@lib/index.js'

export default ({ app, options, router, siteData, isServer }) => {
  app.use(youloge);
};