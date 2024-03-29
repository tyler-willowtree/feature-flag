<script setup lang="ts">
import { Mutation, MutationUpdateFlagPercentageArgs } from '@/generated/graphql'
import type { FeatureFlag } from '@/generated/graphql'
import { GET_FLAG_BY_NAME, UPDATE_FLAG_PERCENTAGE } from '@/graphql'
import { onMounted, ref } from 'vue'
import { useMutation, useLazyQuery } from '@vue/apollo-composable'

/**
 * Simple feature flag component using an API to keep track of flags
 * created by: Tyler Baumler (tyler.baumler@dragoninnovatus.com)
 *
 * The API requires an env variable (VITE_APP_API_URL) set in order to call the API
 *
 * To use:
 * Wrap this component around the feature providing the 'key' from the API
 *
 * Example:
 * <FlaggedFeatureExample flagKey="spp-snackbar"><Snackbar /></FlaggedFeatureExample>
 *
 * If a flag is set to true or does not exist in the db, the feature will not render
 * Or there is also an optional altElement prop that can be passed in to render something
 * else if the flag is set to true
 *
 * Example:
 * <FlaggedFeatureExample flagKey="spp-snackbar" altElement={<div>Snackbar is disabled</div>}><Snackbar /></FlaggedFeatureExample>
 *
 * If the flag is set to true or doesn't exist in the db, the altElement will render
 *
 * When flag is no longer needed, ie when feature is complete, tested, and usable
 * Remove it from the DB and remove this component as the wrapper
 */
const props = defineProps<{
  flagKey: string
  ignorePercentage?: boolean
  showElse?: boolean
}>()

enum ShowState {
  FEATURE,
  ELSE,
  NONE
}

const { load, result, error, loading, onResult } = useLazyQuery(GET_FLAG_BY_NAME, {
  name: props.flagKey
})
const { mutate: updateFlagPercentage, onDone } = useMutation<
  Mutation,
  MutationUpdateFlagPercentageArgs
>(UPDATE_FLAG_PERCENTAGE)

const showFeature = ref(ShowState.NONE)
const flag = ref<FeatureFlag>()
const initialLoad = ref(true)

onMounted(() => {
  load()
})

onDone(() => {
  flag.value = result.value.getFlagByName
})

onResult(() => {
  if (result.value && initialLoad.value) {
    initialLoad.value = false
    flag.value = result.value.getFlagByName

    if (!flag.value) {
      showFeature.value = props.showElse ? ShowState.ELSE : ShowState.NONE
      return
    }

    // HAVE FLAG DATA
    if (!flag.value.enabled) {
      showFeature.value = ShowState.FEATURE
      return
    }

    // FLAG IS ENABLED
    // ignore percentage
    if (props.ignorePercentage) {
      showFeature.value = props.showElse ? ShowState.ELSE : ShowState.NONE
      return
    }

    // USE PERCENTAGE
    if (flag.value.abPercentage < 100) {
      const onOffRatio = Math.ceil(
        (flag.value.abShowCount / (flag.value.abShowCount + flag.value.abHideCount)) * 100
      )
      const enabledPercentage = flag.value.abPercentage
      const shouldShow = onOffRatio <= enabledPercentage

      if (shouldShow) {
        updateFlagPercentage({
          id: flag.value.id,
          data: { abShowCount: flag.value.abShowCount + 1 }
        })
        showFeature.value = ShowState.FEATURE
        return
      }
    }

    // SHOW ELSE
    if (props.altElement) {
      updateFlagPercentage({ id: flag.value.id, data: { abHideCount: flag.value.abHideCount + 1 } })
      showFeature.value = ShowState.ELSE
      return
    }

    updateFlagPercentage({ id: flag.value.id, data: { abHideCount: flag.value.abHideCount + 1 } })
    showFeature.value = ShowState.NONE
  }
})
</script>

<template>
  <p v-if="error">{{ error.message }}</p>
  <p v-if="loading">Loading...</p>
  <template v-else>
    <div v-if="!ignorePercentage && flag" class="font16">
      A/B: {{ flag.abPercentage }}% ({{ flag.abShowCount }} / {{ flag.abHideCount }})
    </div>
    <slot v-if="showFeature === ShowState.FEATURE" name="default"></slot>
    <slot v-else-if="showFeature === ShowState.ELSE" name="altElement"></slot>
  </template>
</template>
