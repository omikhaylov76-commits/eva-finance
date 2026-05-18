import { createClient } from '@supabase/supabase-js'
import useStore from './store'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null

function getUserId() {
  let id = localStorage.getItem('eva-user-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('eva-user-id', id)
  }
  return id
}

export async function loadFromCloud() {
  if (!supabase) return
  const userId = getUserId()
  try {
    const [{ data: txs }, { data: goals }, { data: limits }] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('goals').select('*').eq('user_id', userId).order('createdAt', { ascending: false }),
      supabase.from('category_limits').select('*').eq('user_id', userId),
    ])
    useStore.getState().hydrate({
      transactions: txs || [],
      goals: goals || [],
      limits: limits || [],
    })
  } catch (e) {
    console.warn('Supabase load failed, using local data:', e.message)
  }
}

export async function pushTransaction(tx) {
  if (!supabase) return
  await supabase.from('transactions').upsert({ ...tx, user_id: getUserId() })
}
export async function deleteTransactionRemote(id) {
  if (!supabase) return
  await supabase.from('transactions').delete().eq('id', id).eq('user_id', getUserId())
}

export async function pushGoal(g) {
  if (!supabase) return
  await supabase.from('goals').upsert({ ...g, user_id: getUserId() })
}
export async function deleteGoalRemote(id) {
  if (!supabase) return
  await supabase.from('goals').delete().eq('id', id).eq('user_id', getUserId())
}

export async function pushLimit(l) {
  if (!supabase) return
  await supabase.from('category_limits').upsert({ ...l, user_id: getUserId() })
}
export async function deleteLimitRemote(id) {
  if (!supabase) return
  await supabase.from('category_limits').delete().eq('id', id).eq('user_id', getUserId())
}
