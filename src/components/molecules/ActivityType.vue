<script lang="ts" setup>
interface ActivityType {
  name: string
  icon: string
  label?: string
}

defineProps<{ activityType: ActivityType }>()

</script>

<template>
  <div v-if="activityType">
    <i :class="activityType.icon" />
    {{ activityType.label || activityType.name }}
  </div>
</template>
