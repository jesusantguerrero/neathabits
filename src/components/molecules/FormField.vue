<template>
  <div class="w-full">
    <component
      :is="tag"
      ref="input"
      :placeholder="label"
      :value="modelValue"
      class="block w-full px-2 py-1 bg-transparent border-b border-gray-200 focus:outline-none focus:border-emerald-400"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <small v-if="errorMessage" class="block text-red-400">{{ prettyError }}</small>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
  field: string
  errors: Record<string, string>,
  tag?: string
  label?: string
}>()

defineEmits(['update:modelValue'])

const errorMessage = computed(() => {
  return props.errors[props.field]
})

const prettyError = computed(() => {
  return errorMessage.value && errorMessage.value.replace(props.field, props.label)
})

const inputRef = ref()
watch(
  () => props.modelValue,
  (value) => {
    if (value !== props.modelValue)
      inputRef.value.value = value
  },
)
</script>
