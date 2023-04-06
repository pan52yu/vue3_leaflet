import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
const app = createApp(App)

// 挂载Pinia
app.use(store)

app.mount('#app')
