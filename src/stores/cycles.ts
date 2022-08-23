import { defineStore } from 'pinia'
import { useResourceApi } from '~/utils/useResourceApi'

const { add: addCycle, getAll: getAllCycles, update: updateCycle, remove: removeCycle } = useResourceApi('cycles', 'objectives', [
  'title',
  'description',
  'startDate',
  'endDate',
])

export interface ICycle {
  title: string
  description: string
  startDate: Date
  endDate: Date
}

export const useCycleStore = defineStore({
  id: 'cycles',
  state: () => {
    return {
      data: [],
    }
  },
  actions: {
    async fetch() {
      const data = await getAllCycles()
      this.data = data
    },
    async add(payload: ICycle) {
      return await addCycle(payload)
    },
    async update(payload: ICycle) {
      return await updateCycle(payload)
    },
    remove(id: string) {
      return removeCycle(id)
    },
  },
})
