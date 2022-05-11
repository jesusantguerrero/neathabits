<script setup lang="ts">
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useFuseSearch } from '../../utils/useFuseSearch'
import { useCollection } from '../../utils/useCollection'

const props = defineProps({
  tags: {
    type: Array,
    default() {
      return []
    },
  },
  modelValue: {
    type: Array,
    default() {

    },
  },
  limit: {
    type: Number,
    default: 2,
  },
  multiple: Boolean,
  placeholder: {
    type: String,
    default: 'Add tags',
  },
  allowAdd: {
    type: Boolean,
    default: true,
  },
})
const selectedTags = ref([])
const setSelectedTags = () => {
  selectedTags.value = props.modelValue.map((item) => {
    const tag = props.tags.find(tag => tag.uid == item.uid)
    if (!item.colors || (tag && tag.colors && tag.colors[0] != item.colors[0]))
      item.colors = tag ? tag.colors || [] : []

    return item
  })
}
watch(() => [...props.modelValue], () => {
  setSelectedTags()
}, { immediate: true })

watch(() => props.tags, () => {
  setSelectedTags()
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
const focusInput = () => {
  input.value && input.value.focus()
}

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

const moveCursorDown = () => {
  if ((state.cursor + 1) < filteredList.value.length) {
    state.cursor = state.cursor + 1
    checkScroll()
  }
}

// emits
const addTag = () => {
  if (searchText.value) {
    emit('added', {
      name: searchText.value,
    })
    searchText.value = ''
  }
}

const { update: updateTags, destroy: deleteTags } = useCollection()
const updateTag = (tag) => {
  if (tag.uid) {
    updateTags('tags', tag).then(() => {
      ElNotification({
        message: 'Tag updated',
        type: 'success',
      })
      state.selectedTag = null
    })
  }
}

const deleteTag = async(tag) => {
  const canDelete = await ElMessageBox.confirm(`Are you sure you want to delete the tag: "${tag.name}"?<br> This tag won't be deleted from already saved tasks`, 'Delete Tag', {
    dangerouslyUseHTMLString: true,
  })

  if (tag.uid && canDelete) {
    deleteTags('tags', tag).then(() => {
      ElNotification({
        message: 'Tag deleted',
        type: 'success',
      })
      state.selectedTag = null
    })
  }
}

const selectTag = (tag) => {
  if (filteredList.value.length) {
    const selected = tag || filteredList.value[state.cursor]
    select(selected)
  }
  else {
    addTag()
  }
}

const select = (tag) => {
  const index = selectedTags.value.findIndex(item => tag.uid == item.uid)
  if (index < 0 && props.multiple)
    selectedTags.value.push(tag)

  else if (index < 0 && !props.multiple)
    selectedTags.value = [tag]

  else
    selectedTags.value.splice(index, 1)

  if (props.multiple)
    input.value.focus()

  else
    state.isOpen = false

  emit('update:modelValue', selectedTags.value)
}
</script>

<template>
  <div class="flex items-center justify-center tag-select">
    <el-popover
      v-model="state.isOpen"
      placement="bottom-end"
      popper-class="tag-select dark:bg-gray-900 dark:text-gray-300"
      :width="240"
      :show-arrow="false"
      @hide="state.selectedTag=null"
      @after-enter="focusInput()"
    >
      <TagContent
        :selected-tag="state.selectedTag"
        @set-color="state.selectedTag.colors=colors"
        @back="state.selectedTag = null"
        @delete="deleteTag(state.selectedTag)"
        @update="updateTag(state.selectedTag)"
      />

      <template #reference>
        <TagsButton
          :selected-tags="selectedTags"
        />
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss">
.dark {
.el-popper.is-light {
    @apply bg-gray-700 border-gray-500 text-gray-300;
}
}
</style>
