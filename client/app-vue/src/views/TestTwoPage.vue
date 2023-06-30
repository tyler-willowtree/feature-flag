<script setup lang="ts">
import FlaggedFeature from '@/components/FlaggedFeature.vue'
</script>

<template>
  <FlaggedFeature flagKey="a-example-only">
    <template #elseElement><h3>Page coming soon</h3></template>
    <template #default>
      <h1>Test Two Page</h1>
      <p>This page is only visible if the flag is set to true</p>
    </template>
  </FlaggedFeature>
</template>
