<script setup lang="ts">
import { useResourceApi } from '~/utils/useResourceApi'
import { NDataTable } from 'naive-ui'
import { reactive } from 'vue'

const state = reactive({
  isLoading: false,
  prompts: [],
})

const { add, update, getAll } = useResourceApi('prompts', 'fields', [
  'title',
])
// api calls

const fetchPrompts = () => {
  state.isLoading = true
  getAll({ relationships: false }).then(( data) => {
    state.prompts = data
    state.isLoading = false
  })
}

fetchPrompts()

const savePrompt = (formData: Record<string, any>) => {
  const method = formData.id ? update : add
  const form = { ...formData }
  form.images = form.fields
    .filter((field: Record<string, any>) => field.type === 'pictureChoice' && field.title && field.options.map)
    .reduce((images: Record<string, any>[], field: Record<string, any>) => {
      return [...images, ...field.options.map((option: Record<string, any>) => option.image[0].raw)]
    }, []).filter((image: Record<string, any>) => image)

  formData.fields = formData.fields.filter((field: Record<string, any>) => field.title).map((field: Record<string, any>) => {
    if (field.type === 'pictureChoice' && field.options.map) {
      field.options.map((option: Record<string, any>) => {
        option.image = option.image[0].name || option.image
        return option
      })
    }
    return field
  })

  state.isLoading = false
  method(form).then(() => {
    state.isLoading = false
    fetchPrompts()
  })
}



const promptTable = reactive({
  cols: [{
    key: 'title',
    title: 'Name',
  }, {
    key: 'cycle',
    title: 'Cycle',
  }, {
    key: 'Task progress',
    title: 'Task progress',
  },
  {
    key: 'completed',
    title: 'Completed',
  },
  {
    key: 'related tasks',
    title: 'Related tasks',
  }, {
    key: 'related resources',
    title: 'Related resources',
  }],
  data: computed(() => state.prompts),
})
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <CreateTemplate @submit="savePrompt" />

    <NDataTable
      class="mt-4"
      :columns="promptTable.cols"
      :data="promptTable.data"
      bordered
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
