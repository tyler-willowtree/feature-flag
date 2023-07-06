<script setup lang="ts">
import FlaggedFeature from '@/components/FlaggedFeature.vue'

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

      <FlaggedFeature
        :flagKey="flagName"
        :show-else="showElseElement"
        :ignorePercentage="ignorePercentage"
      >
        <template v-if="showElseElement" #elseElement>
          <div>Coming soon</div>
        </template>
        <div class="text-center">Feature for {{ flagName }}</div>
      </FlaggedFeature>
    </div>
  </div>
</template>
