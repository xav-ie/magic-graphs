import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { VBtn, VIcon, VMenu, VTooltip } from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import PrimeVue from 'primevue/config';

import { createPinia } from 'pinia'

import './main.css'

const pinia = createPinia()

const vuetify = createVuetify({
  components: {
    VTooltip,
    VMenu,
    VIcon,
    VBtn,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
})

createApp(App)
  .use(PrimeVue, { theme: 'none' })
  .use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app')
