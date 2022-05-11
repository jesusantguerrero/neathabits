import { toRefs } from 'vue'

export const exposeState = (state: Record<string, any>) => {
  return toRefs(state)
}
