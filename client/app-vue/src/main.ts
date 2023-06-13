// @ts-ignore
import App from '@/App.vue'
import { createApp, provide, h } from 'vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  cache,
  uri: `${import.meta.env.VITE_APP_API_URL}`
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App)
})

app.mount('#app')
