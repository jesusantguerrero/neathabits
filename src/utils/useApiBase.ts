/** @ts-expect-error: provide */
import { AuthState } from 'lumiere-utils/useAuth'

export async function addRows(tableName: string, rows: any[]) {
  const supabase = AuthState.provider.supabase
  const { data, error } = await supabase
    .from(tableName)
    .insert(rows.map(row => ({
      ...row,
      user_id: AuthState.user.id,

    })))

  if (error) throw error
  return data
}

export async function updateRow(tableName: string, row: any, config: Record<string, string> = {}) {
  const supabase = AuthState.provider.supabase
  const { data, error } = await supabase
    .from(tableName)
    .update(row, { returning: 'representation', ...config })
    .eq('id', row.id)

  if (error) throw error
  return data
}
