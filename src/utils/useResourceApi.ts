import camelcase from 'camelcase'
import decamelize from 'decamelize'
/** @ts-expect-error: provide */
import { AuthState, useAuthState } from 'lumiere-utils/useAuth'
import { addRows, updateRow } from './useApiBase'

export function useResourceApi(tableName: string, relationshipTable?: string, relationshipFields?: string[]) {
  const supabase = AuthState.provider.supabase

  const updateRelationships = async(resource: Record<string, any>, savedResource: Record<string, any>) => {
    if (relationshipTable && resource[relationshipTable]) {
      const relation = resource[relationshipTable].map((record: Record<string, any>) => {
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
  const add = async(resource: Record<string, any>) => {
    const savedResource = await addRows(tableName, [parseRecord(resource, relationshipTable)])
    return updateRelationships(resource, savedResource)
  }
  const get = async(siteId: string) => {
    const { data, error } = await supabase.from('sites').select('*')
      .eq('user_uid', AuthState.user.id)
      .eq('id', siteId)
    if (error)
      throw error
    return data
  }

  const update = async(resource: Record<string, any>) => {
    await supabase.from(`${tableName}_${relationshipTable}`).delete().eq(`${tableName}_id`, resource.id)
    const savedResource = await updateRow(tableName, parseRecord(resource, relationshipTable), { returning: 'representation' })
    return updateRelationships(resource, savedResource)
  }

  const getAll = async(params = { relationships: true }) => {
    const relationshipsParam = params.relationships && relationshipTable
      ? `, ${tableName}_${relationshipTable} (             
      *
    )`
      : ''
    const { data, error } = await supabase.from(tableName)
      .select(`*
            ${relationshipsParam}
        `)
      .eq('user_id', AuthState.user.id)
    if (error)
      throw error
    const result = data?.map((evt: Record<string, any>) => recordToObject(evt, tableName, relationshipTable ? [relationshipTable] : []))
    return result
  }

  const remove = async(resourceId: string) => {
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
  const tableRecord: Record<string, any> = Object.keys(record).reduce((acc: Record<string, any>, key) => {
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

function recordToObject(record: Record<string, any>, tableName: string, relation: string[] = []) {
  return Object.keys(record).reduce((acc: Record<string, any>, key) => {
    acc[camelcase(key)] = record[key]

    if (key === (`${tableName}_${relation[0]}`))
      acc[relation[0]] = record[key]

    return acc
  }, {})
}
