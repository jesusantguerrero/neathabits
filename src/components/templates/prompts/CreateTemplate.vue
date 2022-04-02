<script setup>
import { AtButton, AtFormBlock, AtOptionsCreator, useForm } from 'atmosphere-ui'
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
  errors: {
    type: Object,
    default() {
      return {}
    },
  },
})

const emit = defineEmits(['submit', 'cancel'])

const state = reactive({
  formData: useForm({
    title: '',
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
  }, { emit }),
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
const ActionButtons = ref(null)

const checkScroll = () => {
  nextTick(() => {
    ActionButtons.value.scrollIntoView({ smooth: true })
  })
}

const onCopy = (field) => {
  field.name = uuid()
  state.formData.fields.push({ ...field })
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
    is_required: 0,
  })

  checkScroll()

  const submitForm = () => {
    state.formData.submit('submit')
  }
}
</script>

<template>
  <div class="space-y-5 ">
    <AtButton type="primary" @click="submitForm">
      Save Prompt
    </AtButton>
    <div class="w-full px-5 py-10 space-y-5 text-gray-600 bg-white border-t-4 border-gray-200 border-blue-400 rounded-md shadow-md">
      <div class="flex items-end">
        <div class="flex items-end w-full">
          <span class="mr-2 font-bold"> Title:</span>
          <div class="w-full text-3xl font-bold">
            <input v-model="state.formData.title" class="w-full font-bold border-b focus:outline-none focus:border-gray-400" placeholder="Untitled Form">
            <div v-if="errors.title" class="text-xs text-red-400">
              {{ errors.title }}
            </div>
          </div>
        </div>
      </div>
      <div>
        <input v-model="state.formData.description" class="w-full border-b focus:outline-none focus:border-gray-400" placeholder="Description">
        <div v-if="errors.description" class="text-xs font-bold text-red-400">
          {{ errors.description }}
        </div>
      </div>
    </div>

    <at-form-block
      v-for="(field, index) in state.formData.fields"
      :key="`field-${index}`"
      :field="field"
      :field-types="state.fieldTypes"
      class="shadow-md"
    />

    <div ref="ActionButtons" class="space-x-5 mt-2">
      <at-button type="success" @click="addFieldBlock()">
        Add
      </at-button>
      <at-button type="success">
        Add title
      </at-button>
    </div>
  </div>
</template>
