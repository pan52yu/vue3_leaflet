import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router/index'
const app = createApp(App)

// 挂载Pinia
app.use(store)
app.use(router)

app.mount('#app')
