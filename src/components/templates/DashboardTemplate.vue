<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { AtButton, AtWeek } from 'atmosphere-ui'
import { format } from 'date-fns'
import EventForm from '~/components/organisms/EventForm.vue'
import type { IScheduleEvent } from '~/utils/useApi'
import { usePlanApi } from '~/utils/useApi'
import { useCycleApi } from '~/utils/useCycleApi'

defineProps<{
  labels: []
}>()

const state = reactive({
  week: [],
  selectedDay: new Date(),
  cycle: null,
  items: [],
  cycles: [],
  isAddingCycle: false,
})

const formatDate = (date: Date) => format(new Date(date), 'MMM dd, yyyy')

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

// cycle
const { add: addCycle, getAll: getAllCycles, update: updateCycle, remove: removeCycle } = useCycleApi('objectives', [
  'title',
  'description',
  'startDate',
  'endDate',
])

onMounted(() => {
  Promise.allSettled([
    getAll(),
    getAllCycles(),
  ]).then(([items, cycles]) => {
    state.items = items.value
    state.cycles = cycles.value
  })
})

const fetchCycles = () => {
  getAllCycles().then((data) => {
    state.cycles = data
  })
}

const onCycleSaved = async(cycle) => {
  const method = cycle.id ? updateCycle : addCycle
  method(cycle).then(() => {
    fetchCycles()
    state.isAddingCycle = false
  })
}

const onRemoveCycle = async(cycleId) => {
  removeCycle(cycleId).then(() => {
    fetchCycles()
  })
}

const onEdit = (cycle) => {
  const dataToEdit = {
    ...cycle,
    startDate: new Date(cycle.startDate),
    endDate: new Date(cycle.endDate),
  }
  state.cycle = dataToEdit
  state.isAddingCycle = true
}

</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="w-full">
      <h4 class="text-xl font-bold text-gray-500">
        Cycle Goals
      </h4>
      <table class="w-full mt-5 border border-collapse table-auto border-slate-500">
        <tr>
          <th class="py-2 border border-slate-200">
            Name
          </th>
          <th class="border border-slate-200">
            Top Goals
          </th>
          <th class="border border-slate-200 w-36">
            Due date
          </th>
          <th class="w-20 border border-slate-200">
            Progress
          </th>
          <th class="w-5 border border-slate-200">
            Actions
          </th>
        </tr>
        <tr v-for="cycle in state.cycles" :key="cycle.name">
          <td class="px-5 border border-slate-200">
            {{ cycle.name }}
          </td>
          <td class="px-5 border border-slate-200">
            {{ cycle.objectives.map( ob => ob.title).join(', ') }}
          </td>
          <td class="px-5 border border-slate-200">
            {{ formatDate(cycle.endDate) }}
          </td>
          <td class="px-5 border border-slate-200">
            {{ cycle.objectives.filter(ob => ob.completed).length }} / {{ cycle.objectives.length }}
          </td>
          <td class="flex px-5 space-x-2 border border-slate-200">
            <AtButton type="primary" class="flex space-x-2" @click="onEdit(cycle)">
              <i-carbon-pen inline-block class="text-4xl text-white" />
              Edit
            </AtButton>
            <AtButton type="danger" class="flex space-x-2" @click="onRemoveCycle(cycle.id)">
              <div>
                <i-carbon-trash-can inline-block class="text-4xl text-white" />
              </div>
              Remove
            </AtButton>
          </td>
        </tr>
        <tr>
          <td class="px-5 text-center border border-slate-200" colspan="5">
            <button v-if="!state.isAddingCycle" class="py-2 font-bold text-gray-400 transition hover:text-primary" @click="state.isAddingCycle = true">
              <div class="text-4xl">
                <I-carbon-add-filled inline-block />
              </div>
              Add new cycle plan
            </button>
            <CycleForm
              v-else
              class="mt-5"
              :form-data="state.cycle"
              @submit="onCycleSaved"
              @cancel="state.isAddingCycle = false"
            />
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
