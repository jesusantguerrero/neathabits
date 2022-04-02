<script setup lang="ts">
// cycle
const { add, getAll, update, remove } = useCycleApi('objectives', [
  'title',
  'description',
  'startDate',
  'endDate',
])
// api calls
const saveForm = (formData) => {
  const method = formData.id ? 'put' : 'post'
  const param = formData.id ? `/${formData.id}` : ''
  const form = { ...formData }
  form.images = form.fields
    .filter(field => field.type === 'pictureChoice' && field.title && field.options.map)
    .reduce((images, field) => {
      return [...images, ...field.options.map(option => option.image[0].raw)]
    }, []).filter(image => image)

  formData.fields = formData.fields.filter(field => field.title).map((field) => {
    if (field.type === 'pictureChoice' && field.options.map) {
      field.options.map((option: Record<string, any>) => {
        option.image = option.image[0].name || option.image
        return option
      })
    }
    return field
  })
  savePrompts(formData)
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <CreateTemplate @saved="onSave" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
