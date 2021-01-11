module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/firebase-messaging-sw.js'
    }
  }
}