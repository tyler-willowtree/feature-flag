<script setup lang="ts"></script>

<template>
  <component :is="$route.meta.layout">
    <RouterView />
  </component>
</template>

<style>
@import 'assets/index.css';
</style>
