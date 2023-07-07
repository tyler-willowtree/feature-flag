<script setup lang="ts">
/**
 * Simple feature flag component using an API to keep track of flags
 * created by: Tyler Baumler (tyler.baumler@dragoninnovatus.com)
 *
 * The API requires an env variable (VITE_APP_API_URL) set in order to call the API
 *
 * To use:
 * Wrap this component around the feature providing the 'name' from the API
 *
 * Example:
 * <FlaggedFeatureExample flagKey="spp-snackbar"><Snackbar /></FlaggedFeatureExample>
 *
 * If a flag is set to true or does not exist in the db, the feature will not render
 * Or there is also an optional altElement prop that can be passed in to render something
 * else if the flag is set to true
 *
 * Example:
 * <FlaggedFeatureExample
 *   flagKey="spp-snackbar"
 *   altElement={<div>Snackbar is disabled</div>}
 * >
 *   <Snackbar />
 * </FlaggedFeatureExample>
 *
 * If the flag is set to true or doesn't exist in the db, the altElement will render
 *
 * When flag is no longer needed, ie when feature is complete, tested, and usable
 * Remove this component as the wrapper, then after code is pushed to production, remove
 * it from the DB
 */
/* UPDATE THESE PATHS BEFORE USE */
import { onMounted, ref, watch } from 'vue'

/* These could be placed anywhere - START */
interface FeatureFlag {
  id: number
  name: string
  description: string
  enabled: boolean
  abPercentage: number
  abShowCount: number
  abHideCount: number
  updatedAt: Date
}

interface FeatureFlagPercentageUpdateProps {
  abShowCount?: number
  abHideCount?: number
}
/* These could be placed anywhere - END */

const props = defineProps<{
  flagKey: string
  showElse?: boolean
}>()

enum ShowState {
  FEATURE,
  ELSE,
  NONE
}

const error = ref<string>()
const flag = ref<FeatureFlag>()
const initialLoad = ref(true)
const loading = ref(true)
const showFeature = ref(ShowState.NONE)

const getFlagByName = () => {
  fetch(`${import.meta.env.VITE_APP_API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
        getFlagByName(name: "${props.flagKey}") {
          id
          name
          enabled
          abPercentage
          abShowCount
          abHideCount
        }
      }`
    })
  })
    .then((res) => res.json())
    .then((res) => {
      flag.value = res.data?.getFlagByName
      initialLoad.value = false
      loading.value = false
    })
}

const updateFlagAbCount = (data: string) => {
  fetch(`${import.meta.env.VITE_APP_API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation updateFlagPercentage {
            updateFlagPercentage(id: ${flag.value.id}, data: { ${data} }) {
            id
          }
        }`
    })
  }).then()
}

onMounted(() => {
  getFlagByName()
})

watch(flag, () => {
  if (!flag.value) {
    showFeature.value = props.showElse ? ShowState.ELSE : ShowState.NONE
    return
  }

  // HAVE FLAG DATA, IS NOT ENABLED, SHOW FEATURE
  // ignores the a/b percentage and just shows the feature
  if (!flag.value.enabled) {
    showFeature.value = ShowState.FEATURE
    return
  }

  // USE PERCENTAGE TO DETERMINE IF FEATURE SHOULD SHOW
  if (flag.value.abPercentage < 100) {
    const onOffRatio = Math.ceil(
      (flag.value.abShowCount / (flag.value.abShowCount + flag.value.abHideCount)) * 100
    )
    const enabledPercentage = flag.value.abPercentage
    const shouldShow = onOffRatio <= enabledPercentage

    if (shouldShow) {
      updateFlagAbCount(`abShowCount: ${flag.value.abShowCount + 1}`)
      showFeature.value = ShowState.FEATURE
      return
    }
  }

  // SHOW ELSE COMPONENT
  if (props.showElse) {
    updateFlagAbCount(`abHideCount: ${flag.value.abHideCount + 1}`)
    showFeature.value = ShowState.ELSE
    return
  }

  // DON'T SHOW ANYTHING
  updateFlagAbCount(`abHideCount: ${flag.value.abHideCount + 1}`)
  showFeature.value = ShowState.NONE
})
</script>

<template>
  <p v-if="error">{{ error.message }}</p>
  <p v-if="loading">Loading...</p>
  <template v-else>
    <slot v-if="showFeature === ShowState.FEATURE" name="default"></slot>
    <slot v-else-if="showFeature === ShowState.ELSE" name="altElement"></slot>
  </template>
</template>
