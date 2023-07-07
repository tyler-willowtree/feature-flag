<script setup lang="ts">
import { ref, watch } from 'vue'
import { routes } from '@/router/routes'
import { useQuery } from '@vue/apollo-composable'
import { Query } from '@/generated/graphql'
import { gql } from 'graphql-tag'

const { result } = useQuery<Query>(
  gql`
    query GetAllFlags {
      getAllFlags {
        id
        name
        enabled
        enablePercentage
        onCount
        offCount
      }
    }
  `
)
const flags = ref(result)
const navRoutes = ref([])

const getFlagIsEnabled = (name: string, flagList: any[]) => {
  const exists = flagList.find((flag) => flag.name === name)
  return exists === undefined ? false : !exists.enabled
}

watch(flags, (newVal) => {
  if (newVal.getAllFlags) {
    navRoutes.value = routes.filter((rte) => {
      if (rte.meta.inNav) {
        const { flagName } = rte.meta.inNav
        if (flagName) {
          return getFlagIsEnabled(flagName, newVal.getAllFlags)
        }
        return true
      }
      return false
    })
  }
})
</script>

<template>
  <nav>
    <RouterLink v-for="route in navRoutes" :to="route.path" :key="route.path">
      {{ route.meta.inNav.label }}
    </RouterLink>
  </nav>

  <main class="body">
    <p class="text-center">
      To show/hide "Test Two" page, toggle the flag "a-example-only" on the own db option<br />
      Refresh page to see a/b testing update
    </p>

    <slot />
  </main>
</template>
