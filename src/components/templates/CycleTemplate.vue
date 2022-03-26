<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { AtButton } from 'atmosphere-ui'
import { format } from 'date-fns'
import { cloneDeep } from 'lodash'
import { useCycleApi } from '~/utils/useCycleApi'

const state = reactive({
  cycle: null,
  cycles: [],
  isAddingCycle: false,
  isCollapsed: false,
  collapseLabel: computed(() => state.isCollapsed ? 'Expand' : 'Collapse'),
})

const formatDate = (date: Date) => format(new Date(date), 'MMM dd, yyyy')

// cycle
const { add: addCycle, getAll: getAllCycles, update: updateCycle, remove: removeCycle } = useCycleApi('objectives', [
  'title',
  'description',
  'startDate',
  'endDate',
])

onMounted(() => {
  getAllCycles().then((data) => {
    state.cycles = data
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
  state.cycle = cloneDeep(dataToEdit)
  state.isAddingCycle = true
}

</script>

<template>
  <div class="w-full">
    <h4 class="text-xl font-bold flex justify-between px-2" :class="{'border-b pb-4': state.isCollapsed }">
      Cycle Goals
      <button @click="state.isCollapsed=!state.isCollapsed">
        {{ state.collapseLabel }}
      </button>
    </h4>
    <Transition name="fade">
      <table v-if="!state.isCollapsed" class="w-full mt-5 border border-collapse table-auto border-slate-500">
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
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.scheduler {
  height: calc(100vh - 200px);
}

</style>
