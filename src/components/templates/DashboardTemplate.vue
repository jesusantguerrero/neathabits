<script lang="ts" setup>
import { reactive } from 'vue'
import { AtWeek } from 'atmosphere-ui'

defineProps<{
  scheduledEvents: []
  labels: []
}>()

const state = reactive({
  week: [],
  selectedDay: new Date(),
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
          :items="scheduledEvents"
          class="overflow-auto ic-scroller scheduler ic-scroller"
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
