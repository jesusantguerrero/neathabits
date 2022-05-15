import { defineStore } from 'pinia'

const parseNotionPage = (page: any) => {
  const { properties: { Name } } = page
  return {
    Name: Name.title.length && Name.title[0].plain_text,
  }
}

export const useResourceStore = defineStore('resources', {
  state: () => {
    return {
      data: [],
      properties: ['Name'],
    }
  },
  actions: {
    async fetchResources() {
      const { results } = await fetch('http://localhost:5000/resources?filter[Type]=note').then(res => res.json())
      this.properties = results.length && Object.keys(results[0].properties)
      this.data = results.map(parseNotionPage)
    },
  },
})
