<script lang="ts" setup>
import { reactive } from 'vue'

const state = reactive({
  scheduledEvents: [],
})
</script>

<template>
  <DashboardTemplate :scheduled-events="state.scheduledEvents" />
</template>

<route lang="yaml">
name: dashboard
meta:
  layout: home
  requiresAuth: true
</route>
