import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './plugins/apollo'
import App from './App.vue'
import router from './router'
import i18n from './i18n.js'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.provide(DefaultApolloClient, apolloClient)

app.mount('#app')