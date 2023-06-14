<script setup lang="ts">
import FlaggedFeature from '@/components/FlaggedFeature.vue'

defineProps<{
  names: string[]
}>()
</script>

<template>
  <div class="stacked stacked-row stacked-justified-between largeRowGap">
    <div v-for="flagName in names" :key="flagName" class="stacked">
      <h5>Flag name: '{{ flagName }}'</h5>

      <hr />

      <FlaggedFeature :flagKey="flagName">
        <div>Feature for {{ flagName }}</div>
      </FlaggedFeature>
    </div>
  </div>
</template>
