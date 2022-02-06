<script lang="ts" setup>

const state = reactive({
  scheduledEvents: [],
})
</script>

<template>
  <div class="py-20 text-center">
    <DashboardTemplate :scheduled-events="state.scheduledEvents" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: false
</route>
