<script setup lang="ts">
import FlagSection from '@/components/FlagSection.vue'
import { Query, QueryGetFlagByNameArgs } from '@/generated/graphql'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const { result, loading, error } = useQuery<Query, QueryGetFlagByNameArgs>(
  gql`
    query GetAllFlags {
      getAllFlags {
        id
        name
        enabled
      }
    }
  `
)

const fakeNames = ['non-exist', 'test-84', 'test-85', 'test-86']
</script>

<template>
  <div class="body">
    <h1>Feature Flags Example (Vue)</h1>

    <h2>All available flags <span>(uses single database option)</span></h2>

    <div v-if="error">{error.message}</div>
    <div v-if="loading">Loading...</div>
    <template v-else-if="result.getAllFlags">
      <div class="mainGrid">
        <div v-for="flag in result.getAllFlags" key="{flag.id}" class="font16">
          Name: <code>{{ flag.name }}</code>
          <br />
          Enabled: <code>{{ flag.enabled ? 'true' : 'false' }}</code>
        </div>
      </div>

      <hr />

      <h2>Flags that are enabled (allow code to be used)</h2>
      <FlagSection
        :names="result.getAllFlags.filter((flag) => flag.enabled).map((flag) => flag.name)"
      />

      <hr />

      <h2>Flags that are not enabled (hide code)</h2>
      <FlagSection
        :names="result.getAllFlags.filter((flag) => !flag.enabled).map((flag) => flag.name)"
      />

      <hr />

      <h2>
        Flags that do not exist in the DB but are wrapped in the FlaggedFeature component (hide
        code)
        <br />
        <span class="font16"> This allows the feature to be started before the DB is updated </span>
      </h2>
      <FlagSection :names="fakeNames" />
    </template>
  </div>
</template>

<style>
@import 'assets/index.css';
</style>
