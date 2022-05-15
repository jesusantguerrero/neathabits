<script setup>
import { useResourceStore } from '~/stores/resources'
const resources = useResourceStore()
resources.fetchResources({
  filter: {
    property: 'Type',
    text: {
      contains: 'Note',
    },
  },
})
</script>

<template>
  <div>
    Esto es algo epico
    <table class="w-full mt-5 border border-collapse table-auto border-slate-500">
      <thead>
        <tr>
          <th v-for="property in resources.properties" :key="property" class="py-2 border border-slate-200">
            {{ property }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(resource, index) in resources.data" :key="resource.id">
          <td v-for="property in resources.properties" :key="`value-${property}-${index}`" class="px-5 border border-slate-200">
            {{ resource[property] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
