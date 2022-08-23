import { defineStore } from 'pinia'
import { useResourceApi } from '~/utils/useResourceApi'

const { add, getAll, update, remove } = useResourceApi('areas')

export interface IArea {
  area_id?: string
  name: string
  description: string
  icon: string
  color: string
  index: number
}

export interface ITopicArea {
  name: string
  icon: string
  index: number
}

interface IAreaState {
  data: IArea[]
}

const initialState: IAreaState = {
  data: [],
}

export const useAreaStore = defineStore({
  id: 'areas',
  state: () => {
    return initialState
  },
  actions: {
    async fetch() {
      this.data = await getAll()
    },
    async add(payload: IArea) {
      const records = await add(payload)
      this.data.push(...records)
    },
    async update(payload: IArea) {
      this.data.push(payload)
    },
    remove(id: number) {
      delete this.data[id]
    },
  },
})
