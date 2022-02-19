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

</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="">
      <h4> Cycle Goals</h4>
      <table>
        <tr>
          <th>Name</th>
          <th>Top Goals</th>
          <th>Due date</th>
          <th>Progress</th>
        </tr>
        <tr>
          <td>January 2022</td>
          <td>Build MVP Neatlogs, Build Package for routine, Write 4 Articles</td>
          <td>March 7, 2022</td>
          <td> 0 / 4</td>
        </tr>
      </table>
    </div>
    <div class="flex mt-8">
      <div class="w-10/12">
        <AtWeek
          :week="state.week"
          :items="itemEvents"
          @update="onUpdate"
          class="overflow-auto ic-scroller scheduler"
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
