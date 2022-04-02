<script setup>
import { AtFormBlock, AtOptionsCreator, AtButton, useForm } from 'atmosphere-ui'
import { reactive } from 'vue'
import { v4 as uuid } from 'uuid'

const props = defineProps({
  form: {
    type: Object,
    default() {
      return {
        fields: [],
      }
    },
  },
})

const state = reactive({
  formData: useForm({
    title: '',
    uuid: uuid(),
    description: '',
    theme_color: '',
    background_color: '',
    fields: [
      {
        name: uuid(),
        title: '',
        description: '',
        type: 'input',
        send_to_next_question: false,
        send_form: false,
        is_required: 0,
      },
    ],
  }),
  fieldTypes: [
    {
      name: 'input',
      label: 'Input',
    },
    {
      name: 'textarea',
      label: 'Textarea',
    },
    {
      name: 'singleSelect',
      label: 'Select',
      component: AtOptionsCreator,
    },
    {
      name: 'opinionScale',
      label: 'Opinion scale',
      component: AtOptionsCreator,
    },
    {
      name: 'checkbox',
      label: 'Checkbox',
    },
  ],
  backUrl: computed(() => {
    let back = '/forms'
    if (props.form)
      back += `/${props.form.id}`

    return back
  }),
})

state.formData = {
  ...state.formData,
  ...props.form,
  fields: props.form
    ? [...props.form.fields.map((field) => {
      field.is_required = Boolean(Number(field.is_required))
      field.should_accept_comment = Boolean(Number(field.should_accept_comment))
      field.options = field.options ? JSON.parse(field.options) : []
      return field
    }), ...state.formData.fields]
    : state.formData.fields,
}

// actions
const ActionButtons = ref(null);

const checkScroll = () => {
    nextTick(() => {
        ActionButtons.value.scrollIntoView({ smooth: true })
    })
}

const onCopy = (field) => {
    field.name = uuid();
    state.formData.fields.push({...field})
    checkScroll()
}

const onDelete = (index) => {
    state.formData.fields.splice(index, 1)
    checkScroll()
}

const addFieldBlock = () => {
    const fieldName = uuid()
    state.formData.fields.push({
        name: fieldName,
        title: '',
        description: '',
        type: 'input',
        send_to_next_question: false,
        send_form: false,
        is_required: 0
    })

    checkScroll()
}
</script>

<template>
  <div class="space-y-5 ">
    <at-form-block
      v-for="(field, index) in state.formData.fields"
      :key="`field-${index}`"
      :field="field"
      :field-types="state.fieldTypes"
      class="shadow-md"
    />

    <div class="space-x-5 mt-2" ref="ActionButtons">
      <at-button type="success" @click="addFieldBlock()">
        Add
      </at-button>
      <at-button type="success">
        Add title
      </at-button>
    </div>
  </div>
</template>
