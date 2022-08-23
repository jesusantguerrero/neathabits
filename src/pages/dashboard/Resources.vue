<script setup>
import { reactive } from 'vue'
import { useResourceStore } from '~/stores/resources'
import { useResourceApi } from '~/utils/useResourceApi'

const { add, update, getAll } = useResourceApi('resources')

const resources = reactive([])

const addResource = () => {
  resources.push({
    title: '',
  })
}

const saveResource = (resource) => {
  add(resource).then(() => {
    //
  })
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <h4> Tha Resources </h4>
    <div>
      <div v-for="resource in resources" :key="resource.id">
        <ResourceItem v-model="resource.title" @saved="saveResource(resource)" />
      </div>
      <button @click="addResource">
        New resource
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
