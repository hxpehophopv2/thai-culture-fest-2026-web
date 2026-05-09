import '@/assets/styles/root.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.$i18n = {}
app.config.globalProperties.$t = (key) => key
app.use(router)
app.mount('#app')
