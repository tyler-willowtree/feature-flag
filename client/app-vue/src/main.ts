// @ts-ignore
import App from '@/App.vue'
import { routes } from '@/router/routes'
import { createApp, provide, h } from 'vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import * as VueRouter from 'vue-router'

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  cache,
  uri: `${import.meta.env.VITE_APP_API_URL}`
})

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App)
})
app.use(router)

app.mount('#app')
