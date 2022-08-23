<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'saved'])
</script>

<template>
  <div class="px-3 py-2 overflow-hidden border rounded-md shadow-md">
    <input
      class="focus:outline-transparent"
      type="text"
      :value="modelValue"
      placeholder="Type a name"
      @input="$emit('update:modelValue')"
      @keydown.ctrl.enter="$emit('saved')"
    >
  </div>
</template>
