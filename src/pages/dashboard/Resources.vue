<script setup>
import { onMounted, ref } from 'vue'
import { AtButton } from 'atmosphere-ui'
import { useAreaStore } from '~/stores/areas'

const areas = useAreaStore()
const area = ref()

const addArea = () => {
  area.value = {
    name: '',
  }
}

const saveResource = (resource) => {
  areas.add(resource)
  area.value = null
}

onMounted(() => {
  areas.fetch()
})
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <h4> Resources </h4>
    <div class="flex overflow-auto space-x-2 pb-4">
      <div v-for="areaItem in areas.data" :key="areaItem.id" class="w-full px-5 rounded-md border min-w-fit py-2">
        {{ areaItem.name }}
      </div>
    </div>
    <div class="mt-2">
      <div v-if="area">
        <ResourceItem v-model="area.name" @saved="saveResource(area)" @closed="area=null" />
      </div>
      <AtButton class="bg-blue-600 text-white" rounded @click="addArea">
        New Area
      </AtButton>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
