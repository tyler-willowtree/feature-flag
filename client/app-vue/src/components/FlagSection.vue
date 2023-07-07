<script setup lang="ts">
import FlaggedFeatureExample from '@/components/FlaggedFeature.vue'
import FlaggedFeatureExample from '@/components/FlaggedFeatureExample.vue'

defineProps<{
  names: string[]
  showElseElement?: boolean
  ignorePercentage?: boolean
}>()
</script>

<template>
  <div class="featureGrid">
    <div v-for="flagName in names" :key="flagName" class="stacked">
      <h5>Flag name: '{{ flagName }}'</h5>

      <hr />

      <FlaggedFeatureExample
        v-if="ignorePercentage"
        :flagKey="flagName"
        :show-else="showElseElement"
        :ignorePercentage="ignorePercentage"
      >
        <template v-if="showElseElement" #altElement>
          <div>Coming soon</div>
        </template>
        <div class="text-center">Feature for {{ flagName }}</div>
      </FlaggedFeatureExample>

      <FlaggedFeature v-else :flagKey="flagName" :show-else="showElseElement">
        <template v-if="showElseElement" #altElement>
          <div>Coming soon</div>
        </template>
        <div class="text-center">Feature for {{ flagName }}</div>
      </FlaggedFeature>
    </div>
  </div>
</template>
