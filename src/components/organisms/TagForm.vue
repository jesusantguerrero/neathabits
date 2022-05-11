<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'set-colors', 'back', 'saved', 'deleted'])
const props = defineProps({
  tagColors: {
    type: Array,
    default() {
      return []
    },
  },
  selectedTag: {
    type: Object,
    default() {
      return {}
    },
  },
  modelValue: {
    type: Array,
    default() {

    },
  },
})
</script>

<template>
  <div>
    <div class="flex items-center mb-5">
      <button class="px-2 py-1 rounded-md hover:bg-gray-200 focus:outline-none" @click="$emit('back')">
        <i class="fa fa-chevron-left" />
      </button>
      <div class="ml-2 font-bold">
        Edit Tag
      </div>
    </div>
    <div class="mb-6 text-left">
      <label for="" class="inline-block mb-2 font-bold">Tag Name</label>
      <input
        ref="input"
        :value="modelValue"
        class="w-full h-8 px-2 border-2 border-gray-100 rounded-md dark:bg-gray-900 focus:outline-none focus:border-gray-200"
        type="text"
        placeholder="Add or create a tag"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>

    <div class="mt-2">
      <label for="" class="inline-block mb-2 font-bold">Pick a color</label>
      <div class="grid grid-cols-4">
        <div
          v-for="colors in tagColors"
          :key="colors[0]" class="flex w-10 h-10 my-2 overflow-hidden rounded-full cursor-pointer"
          :class="[`border-2 border-transparent ${colors.hover}`, selectedTag.colors && selectedTag.colors[0] == colors[0] && 'border-gray-600' ]"
          @click="$emit('set-colors', colors)"
        >
          <div :class="colors[0]" class="w-1/2 h-full" />
          <div :class="colors[1]" class="w-1/2 h-full" />
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        class="px-5 py-2 mr-2 text-white transition-colors bg-red-400 rounded-md focus:outline-none hover:bg-red-500"
        @click="$emit('deleted', selectedTag)"
      >
        Delete
      </button>
      <button
        class="px-5 py-2 text-white transition-colors bg-green-400 rounded-md focus:outline-none hover:bg-green-500 "
        @click="$emit('saved', selectedTag)"
      >
        Save
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.dark {
.el-popper.is-light {
    @apply bg-gray-700 border-gray-500 text-gray-300;
}
}
</style>
