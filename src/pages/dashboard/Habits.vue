<script lang="ts" setup>
import HabitsTemplate from '~/components/templates/HabitsTemplate.vue'

const state = reactive({
  habits: [],
  labels: [],
})
</script>

<template>
  <HabitsTemplate v-bind="state" />
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
