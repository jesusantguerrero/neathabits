<script setup lang="ts">
interface ISideItem {
  label: string
  icon?: string
  to: string
}
defineProps<{ item: ISideItem }>()
</script>

<template>
  <router-link :to="item.to">
    <div class="flex items-center py-3 pl-5 font-semibold text-primary">
      <div v-if="item.icon" class="flex items-center justify-center w-6 h-6 mr-2 text-sm rounded-md bg-primary-100">
        <component :is="item.icon" />
      </div>
      <span>
        {{ item.label }}
      </span>
    </div>
  </router-link>
</template>
