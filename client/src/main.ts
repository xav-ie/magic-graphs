import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  // @ts-ignore i have no idea why this is throwing
  .use(router)
  .mount('#app')
