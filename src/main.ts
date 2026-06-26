import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Design System
import './design-system/tokens/colors.css'
import './design-system/tokens/typography.css'
import './design-system/tokens/spacing.css'
import './design-system/tokens/shadows.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
