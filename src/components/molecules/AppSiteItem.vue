<script setup lang="ts">
interface ISideItem {
  label: string
  icon?: string
  to: string
}
defineProps<{ item: ISideItem }>()
</script>

<template>
  <router-link :to="item.to" class="group">
    <div class="flex items-center py-3 pl-5 font-semibold group-hover:text-primary">
      <div v-if="item.icon" class="flex items-center justify-center w-8 h-8 mr-2 text-sm transition bg-gray-100 border-2 rounded-md side-item group-hover:bg-primary-400 group-hover:text-white">
        <component :is="item.icon" />
      </div>
      <span>
        {{ item.label }}
      </span>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.router-link-exact-active {
  @apply text-primary;

  .side-item {
    @apply bg-primary-400 text-white font-bold border-primary-200;
  }
}
</style>
