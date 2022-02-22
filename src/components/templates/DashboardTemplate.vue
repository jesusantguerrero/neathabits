<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { AtWeek } from 'atmosphere-ui'
import EventForm from '~/components/organisms/EventForm.vue'
import type { IScheduleEvent } from '~/utils/useApi'
import { usePlanApi } from '~/utils/useApi'

defineProps<{
  labels: []
}>()

const state = reactive({
  week: [],
  selectedDay: new Date(),
  items: [],
  isAddingCycle: false,
})

// events setup
const { add, getAll, update, remove } = usePlanApi()

const fetchItems = async() => {
  getAll().then((data) => {
    state.items = data
  })
}

const itemEvents = computed(() => {
  return state.items.map((eventItem: IScheduleEvent) => ({
    ...eventItem,
    class: eventItem.labels && eventItem.labels.length > 0 ? eventItem.labels[0].colors : '',
  }))
})

const isModalOpen = ref(false)
const taskToCreate = reactive({})
const onSaved = async(item) => {
  if (item.id)
    await update(item.id, item)

  else
    await add(item)

  fetchItems()
  isModalOpen.value = false
}

const onUpdate = async(item) => {
  await update(item.id, item)
  state.items.splice(state.items.map(item => item.id).indexOf(item.id), 1, item)
  isModalOpen.value = false
}

const onDelete = async(item) => {
  await remove(item.id)
  state.items = state.items.filter(storedItem => storedItem.id !== item.id)
  isModalOpen.value = false
}

onMounted(() => {
  fetchItems()
})

// cycle
const cycles = reactive([
  {
    name: 'January 22',
    description: 'My january goals',
    startDate: '2022-01-06',
    endDate: '2022-03-7',
    objectives: [{
      title: 'Build MVP Neatlogs',
      completed: false,
    }, {
      title: 'Build Package for routine',
      completed: false,
    }, {
      title: 'Write 4 articles',
      completed: false,
    }],
  },
])

const onCycleSaved = async(cycle) => {
  cycles.push(cycle)
  state.isAddingCycle = false
}

</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="w-full">
      <h4 class="text-xl font-bold text-gray-500">
        Cycle Goals
      </h4>
      <table class="table-auto w-full border-collapse border border-slate-500 mt-5">
        <tr>
          <th class="border border-slate-200">
            Name
          </th>
          <th class="border border border-slate-200">
            Top Goals
          </th>
          <th class="border border border-slate-200">
            Due date
          </th>
          <th class="border border border-slate-200">
            Progress
          </th>
        </tr>
        <tr v-for="cycle in cycles" :key="cycle.name">
          <td class="border border border-slate-200 px-5">
            {{ cycle.name }}
          </td>
          <td class="border border border-slate-200 px-5">
            {{ cycle.objectives.map( ob => ob.title).join(', ') }}
          </td>
          <td class="border border border-slate-200 px-5">
            {{ cycle.endDate }}
          </td>
          <td class="border border border-slate-200 px-5">
            {{ cycle.objectives.filter(ob => ob.completed).length }} / {{ cycle.objectives.length }}
          </td>
        </tr>
        <tr>
          <td class="border border border-slate-200 px-5 text-center" colspan="4">
            <button v-if="!state.isAddingCycle" class="hover:text-primary transition py-2 text-gray-400 font-bold" @click="state.isAddingCycle = true">
              <div class="text-4xl">
                <I-carbon-add-filled inline-block />
              </div>
              Add new cycle plan
            </button>
            <CycleForm v-else class="mt-5" @submit="onCycleSaved" @cancel="state.isAddingCycle = false" />
          </td>
        </tr>
      </table>
    </div>
    <div class="flex mt-8">
      <div class="w-10/12">
        <AtWeek
          :week="state.week"
          :items="itemEvents"
          class="overflow-auto ic-scroller scheduler"
          @update="onUpdate"
        />
        <EventForm
          :event-data="taskToCreate"
          @delete="onDelete"
          @saved="onSaved"
        />
      </div>
      <div class="w-2/12">
        <h4 class="pb-4 font-bold text-center">
          Sections
        </h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scheduler {
  height: calc(100vh - 200px);
}

</style>
