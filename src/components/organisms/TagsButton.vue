<script setup lang="ts">
import { computed, reactive, ref, toRefs, watch } from 'vue'

const props = defineProps({
  selectedTags: {
    type: Array,
    default() {
      return []
    },
  },
  limit: {
    type: Number,
    default: 2,
  },
})

const input = ref(null)
const button = ref(null)

const emit = defineEmits({
  'update:modelValue': Array,
  'added': Object,
  'selected': Object,
})

const state = reactive({
  cursor: -1,
  isOpen: false,
  selectedTag: null,
  tagColors: [
    ['bg-green-200', 'bg-green-400', 'hover:border-green-600'],
    ['bg-blue-200', 'bg-blue-400', 'hover:border-blue-600'],
    ['bg-red-200', 'bg-red-400', 'hover:border-red-600'],
    ['bg-yellow-200', 'bg-yellow-400', 'hover:border-yellow-600'],
    ['bg-purple-200', 'bg-purple-400', 'hover:border-purple-600'],
    ['bg-pink-200', 'bg-pink-400', 'hover:border-pink-600'],
    ['bg-indigo-200', 'bg-indigo-400', 'hover:border-indigo-600'],
    ['bg-gray-200', 'bg-gray-400', 'hover:border-gray-600'],
  ],
})

// Tags
const searchText = ref('')
const { tags, allowAdd } = toRefs(props)

const formattedTags = computed(() => {
  return selectedTags.value && selectedTags.value.map(item => item.name).join(' ')
})

const moreTags = computed(() => {
  return selectedTags.value && selectedTags.value.slice(props.limit).map(item => item.name).join(' ')
})

const { filteredList } = useFuseSearch(searchText, tags, ref([]), ['name'])

const isSelected = (uid) => {
  return selectedTags.value.find(tag => tag.uid == uid)
}

// Cursor

const focusButton = (e) => {
  e.target.click()
}

watch(() => filteredList.value, (tags) => {
  if (state.cursor > filteredList.value.length - 1)
    state.cursor = 0
})

const preSelectedValue = computed(() => {
  return state.cursor <= filteredList.value.length ? filteredList.value[state.cursor] : ''
})

const container = ref(null)
const gotoTop = () => {
  container.value.scrollTop = 0
}
const checkScroll = () => {
  if (state.cursor > -1)
    container.value.querySelector(`.select-item-${state.cursor}`).scrollIntoView({ behavior: 'smooth' })
}

const moveCursorUp = () => {
  if (state.cursor > -1) {
    state.cursor = state.cursor - 1
    checkScroll()
  }
}
</script>

<template>
  <button
    ref="button"
    :class="{'text-gray-500': true }"
    class="flex items-center h-full space-x-1 text-xs focus:outline-none dark:bg-transparent dark:text-gray-300"
    @mousedown.prevent
    @focus.prevent="focusButton"
  >
    <i class="cursor-pointer fa fa-tags" />
    <span v-if="!selectedTags.length"> {{ placeholder }} </span>
    <span
      v-for="tag in selectedTags.slice(0, limit)"
      :key="tag.name"

      class="flex items-center pl-2 mr-1 text-white bg-gray-500 rounded-md"
      :class="tag.colors"
    >
      {{ tag.name }}

      <button class="py-1 transition-colors hover:bg-gray-700 rounded-r-md" @click.prevent.stop="select(tag)">
        <i class="px-2 fa fa-times" />
      </button>
    </span>
    <span
      v-if="moreTags"
      :title="moreTags"
      class="px-2 py-1 mr-1 text-white bg-gray-500 rounded-md"
    >
      + {{ selectedTags.slice(limit).length }}
    </span>
  </button>
</template>

<style lang="scss">
.dark {
.el-popper.is-light {
    @apply bg-gray-700 border-gray-500 text-gray-300;
}
}
</style>
