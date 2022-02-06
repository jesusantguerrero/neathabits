<script lang="ts" setup>

const state = reactive({
  scheduledEvents: [],
})
</script>

<template>
  <DashboardTemplate :scheduled-events="state.scheduledEvents" />
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: false
</route>
