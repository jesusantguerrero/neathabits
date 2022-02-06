<script setup lang="ts">
interface IEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}
defineProps<{
  habit: IEvent;
}>();
</script>

<template>
  <article class="rounded-md w-full border px-5 py-2">
    <h4 class="font-semibold">
      {{ habit.title }}
    </h4>
    <p>{{ habit.description }}</p>
    <small> {{ habit.startTime }} - {{ habit.endTime }} </small>
  </article>
</template>
