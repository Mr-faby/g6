import { createApp } from 'vue'
import { createPinia } from 'pinia'
import registerAntDesign from '@/core/lazyUse'

import App from './App.vue'
import router from './router'

const app = createApp(App, {})

app.use(createPinia())
app.use(router)
registerAntDesign(app)

app.mount('#app')
