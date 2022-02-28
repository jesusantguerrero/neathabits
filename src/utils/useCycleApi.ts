import { parseISO } from 'date-fns'
/** @ts-expect-error: provide */
import { AuthState, useAuthState } from 'lumiere-utils/useAuth'
import { addRows, updateRow } from './useApiBase'

export function useCycleApi() {
  const { provider, user } = useAuthState()

  const tableName = 'cycles'
  const add = async(scheduledEvent) => {
    const savedEvents = await addRows(tableName, [parseEvent(scheduledEvent)])

    if (scheduledEvent.labels) {
      await addRows('cycle_objectives', scheduledEvent.labels.map(label => ({
        event_id: savedEvents[0].id,
        label_id: label.id,
        name: label.name,
      })))
    }

    savedEvents.labels = scheduledEvent.labels
    return savedEvents
  }

  const get = async(siteId) => {
    const supabase = provider.supabase
    const { data, error } = await supabase.from('sites').select('*')
      .eq('user_uid', user.id)
      .eq('id', siteId)
    if (error) throw error
    return data
  }

  const update = async(id, scheduledEvent) => {
    const supabase = AuthState.provider.supabase
    await supabase.from('cycle_objectives').delete().eq('event_id', id)
    const savedEvent = await updateRow(tableName, parseEvent(scheduledEvent), { returning: 'minimal' })
    await addRows('cycle_objectives', scheduledEvent.labels.map(label => ({
      event_id: savedEvent[0].id,
      label_id: label.id,
      name: label.name,
      user_id: AuthState.user.id,
    })))

    savedEvent[0].labels = scheduledEvent.labels
    return savedEvent[0]
  }

  const getAll = async() => {
    const supabase = provider.supabase
    const { data, error } = await supabase.from(tableName)
      .select(`*, 
            cycle_objectives (
                event_id,
                labels (
                    id,
                    name,
                    colors,
                    color_type
                )
            )
        `)
      .eq('user_id', user.id)
    if (error) throw error
    return data?.map((evt: Record<string, any>) => eventToObject(evt, user))
  }

  const remove = async(resourceId) => {
    const supabase = provider.supabase
    return await supabase.from(tableName).delete().eq('id', resourceId)
  }

  return {
    add,
    get,
    update,
    getAll,
    remove,
  }
}

export interface ILabel {
  id: number
  name: string
  colors?: string
  color_type: string
}

export interface IScheduleEvent {
  title: string
  description: string
  startTime: Date
  endTime: Date
  recurrence?: string
  labels?: ILabel[]
  user_id?: string
  id?: string
}

function parseEvent(scheduledEvent: IScheduleEvent) {
  const newEvent: Record<string, any> = {
    title: scheduledEvent.title,
    description: scheduledEvent.description,
    start_time: scheduledEvent.startTime,
    end_time: scheduledEvent.endTime,
    user_id: AuthState.user?.id,
    recurrence: scheduledEvent.recurrence || '',
    label_ids: scheduledEvent.labels && scheduledEvent.labels.map(label => label.id),
  }

  if (scheduledEvent.id)
    newEvent.id = scheduledEvent.id

  return newEvent
}

function eventToObject(scheduledEvent: Record<string, any>, user) {
  return {
    id: scheduledEvent.id,
    title: scheduledEvent.title,
    description: scheduledEvent.description,
    startTime: parseISO(scheduledEvent.start_time),
    endTime: parseISO(scheduledEvent.end_time),
    user_id: user.id,
    recurrence: scheduledEvent.recurrence || '',
    labels: scheduledEvent.scheduled_events_labels.length
      ? scheduledEvent.scheduled_events_labels.map((label: { labels: ILabel[] }) => ({
        ...label.labels,
      }))
      : [],
  }
}
