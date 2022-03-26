import camelcase from 'camelcase'
import decamelize from 'decamelize'
/** @ts-expect-error: provide */
import { AuthState, useAuthState } from 'lumiere-utils/useAuth'
import { addRows, updateRow } from './useApiBase'

export function useCycleApi(relationshipTable?: string, relationshipFields?: string[]) {
  const { provider, user } = useAuthState()

  const tableName = 'cycles'
  const updateRelationships = async(resource, savedResource) => {
    if (relationshipTable && resource[relationshipTable]) {
      const relation = resource[relationshipTable].map((record) => {
        const fields: Record<string, any> = {}
        if (relationshipFields) {
          relationshipFields.forEach((field) => {
            fields[decamelize(field)] = record[field]
          })
        }
        else {
          Object.keys(record).forEach((field) => {
            fields[decamelize(field)] = record[field]
          })
          delete fields.id
        }
        return {
          ...fields,
          [`${tableName}_id`]: savedResource[0].id,
        }
      })
      await addRows(`${tableName}_${relationshipTable}`, relation)
      savedResource[relationshipTable] = resource[relationshipTable]
    }

    return savedResource
  }
  const add = async(resource) => {
    const savedResource = await addRows(tableName, [parseRecord(resource, relationshipTable)])
    return updateRelationships(resource, savedResource)
  }
  const get = async(siteId) => {
    const supabase = provider.supabase
    const { data, error } = await supabase.from('sites').select('*')
      .eq('user_uid', user.id)
      .eq('id', siteId)
    if (error) throw error
    return data
  }

  const update = async(resource) => {
    const supabase = AuthState.provider.supabase
    await supabase.from(`${tableName}_${relationshipTable}`).delete().eq(`${tableName}_id`, resource.id)
    const savedResource = await updateRow(tableName, parseRecord(resource, relationshipTable), { returning: 'representation' })
    return updateRelationships(resource, savedResource)
  }

  const getAll = async() => {
    const supabase = provider.supabase
    const { data, error } = await supabase.from(tableName)
      .select(`*, 
            ${tableName}_${relationshipTable} (             
              *
            )
        `)
      .eq('user_id', user.id)
    if (error) throw error
    const result = data?.map((evt: Record<string, any>) => recordToObject(evt, user, tableName, ['objectives']))
    return result
  }

  const remove = async(resourceId: string) => {
    const supabase = provider.supabase
    if (relationshipTable)
      await supabase.from(`${tableName}_${relationshipTable}`).delete().eq(`${tableName}_id`, resourceId)

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

function parseRecord(record: Record<string, any>, relationTable?: string) {
  const tableRecord: Record<string, any> = Object.keys(record).reduce((acc, key) => {
    acc[decamelize(key)] = record[key]
    return acc
  }, {})

  if (record.id)
    tableRecord.id = record.id
  if (!record.id || record.id === 'new')
    delete tableRecord.id

  if (relationTable)
    delete tableRecord[relationTable]

  return tableRecord
}

function recordToObject(record: Record<string, any>, user, tableName, relation: string[] = []) {
  return Object.keys(record).reduce((acc, key) => {
    acc[camelcase(key)] = record[key]

    if (key === (`${tableName}_${relation[0]}`))
      acc[relation[0]] = record[key]

    return acc
  }, {})
}
