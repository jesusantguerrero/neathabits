<script lang="ts" setup>
import { reactive } from 'vue'
import { useResourceApi } from '~/utils/useResourceApi'

const state = reactive({
  scheduledEvents: [],
  labels: [],
})

const { getAll: getLabels } = useResourceApi('labels')

getLabels().then((data) => {
  state.labels = data
})

</script>

<template>
  <DashboardTemplate
    :scheduled-events="state.scheduledEvents"
    :labels="state.labels"
  />
</template>

<route lang="yaml">
name: dashboard
meta:
  layout: home
  requiresAuth: true
</route>
