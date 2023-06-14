<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { Query, QueryGetFlagByNameArgs } from '@/generated/graphql'
import { gql } from 'graphql-tag'

/**
 * Simple feature flag component using an API to keep track of flags
 * created by: Tyler Baumler (tyler.baumler@dragoninnovatus.com)
 *
 * The API requires an env variable (REACT_APP_API_URL) set in order to call the API
 *
 * To use:
 * Wrap this component around the feature providing the 'key' from the API
 *
 * Example:
 * <FlaggedFeature flagKey="spp-snackbar"><Snackbar /></FlaggedFeature>
 *
 * If a flag is set to true or key does not exist in the file, the feature will not render
 *
 * When flag is no longer needed, ie when feature is complete, tested, and usable
 * Remove it from the DB and remove this component as the wrapper
 */
const props = defineProps<{
  flagKey: string
}>()

const { result, loading, error } = useQuery<Query, QueryGetFlagByNameArgs>(
  gql`
    query GetFlagByName($name: String!) {
      getFlagByName(name: $name) {
        id
        name
        enabled
      }
    }
  `,
  { name: props.flagKey }
)
</script>

<template>
  <p v-if="error">{{ error.message }}</p>
  <p v-if="loading">Loading...</p>
  <slot v-else-if="result.getFlagByName"></slot>
</template>
