import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.scss";
import router from './router'
import { useCacheStore } from './stores/cache';

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  }
})

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(vuetify);

const cacheStore = useCacheStore(pinia);
cacheStore.initializeCache();

app.mount("#app");
