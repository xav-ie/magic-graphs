import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
import PrimeVue from 'primevue/config';

import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)
  .use(PrimeVue, { theme: 'none' })
  .use(router)
  .use(pinia)

app.mount('#app')