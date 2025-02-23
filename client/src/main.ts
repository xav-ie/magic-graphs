import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './main.css';

import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App)
  .use(PrimeVue, { theme: 'none' })
  .use(ToastService)
  .use(router);

app.directive('tooltip', Tooltip);

app.mount('#app');
