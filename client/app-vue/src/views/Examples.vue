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
        abPercentage
        abShowCount
        abHideCount
      }
    }
  `
)

const fakeNames = ['non-exist', 'test-84', 'test-85', 'test-86']
</script>

<template>
  <h1>Feature Flag Example (Vue)</h1>

  <h2>
    All available flags<br />
    <span>using single database option</span>
  </h2>

  <div v-if="error">{error.message}</div>
  <div v-if="loading">Loading...</div>
  <template v-else-if="result.getAllFlags">
    <div class="mainGrid">
      <div v-for="flag in result.getAllFlags" key="{flag.id}" class="font16">
        <template v-for="(value, key) in flag">
          <div v-if="key !== '__typename' && key !== 'id'">
            {{ key }}: <code>{{ value }}</code>
          </div>
        </template>
      </div>
    </div>

    <hr />

    <h2>
      ✅ Flags that are not enabled<br />
      <span>allow code to be used, ignores percentages by default</span>
    </h2>
    <FlagSection
      :names="result.getAllFlags.filter((flag) => !flag.enabled).map((flag) => flag.name)"
      :ignorePercentage="true"
    />

    <hr />

    <h2>
      ❌ Flags that are enabled<br />
      <span>hide code, no altElement, ignores percentages</span>
    </h2>
    <FlagSection
      :names="result.getAllFlags.filter((flag) => flag.enabled).map((flag) => flag.name)"
      :ignorePercentage="true"
    />

    <hr />

    <h2>
      🔆 Flags that are enabled<br />
      <span>show altElement, ignores percentages</span>
    </h2>
    <FlagSection
      :names="result.getAllFlags.filter((flag) => flag.enabled).map((flag) => flag.name)"
      :showElseElement="true"
      :ignorePercentage="true"
    />

    <hr />

    <h2>
      ❌ Flags that do not exist in the DB but are wrapped in the FlaggedFeatureExample component<br />
      <span>hide code, no altElement</span>
      <br />
      <span class="font16">
        This allows the feature to be started before the DB is updated (more useful when each
        environment has its own database)
      </span>
    </h2>
    <FlagSection :names="fakeNames" />

    <hr />

    <h2>
      🆎 Flags that are A/B testing, enabled, and uses else element
      <br />
      <span>uses percentages to decide to show or use else/hide</span>
    </h2>
    <FlagSection
      :names="
        result.getAllFlags
          .filter((flag) => flag.enabled && flag.abPercentage < 100)
          .sort((a, b) => (a.abPercentage < b.abPercentage ? 1 : -1))
          .map((flag) => flag.name)
      "
      :showElseElement="true"
    />
  </template>
</template>
