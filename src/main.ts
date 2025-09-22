import 'nes.css/css/nes.min.css'
import 'vue-final-modal/style.css'
import '@/assets/css/main.css'
import '@/assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(createVfm())
app.use(router)

app.mount('#app')
