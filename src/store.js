import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      goals: [],
      limits: [],
      weeklyPace: 20,
      muted: false,

      addTransaction: (tx) => set((s) => ({
        transactions: [{ id: crypto.randomUUID(), date: new Date().toISOString(), ...tx }, ...s.transactions],
      })),
      deleteTransaction: (id) => set((s) => ({
        transactions: s.transactions.filter((t) => t.id !== id),
      })),

      addGoal: (g) => set((s) => ({
        goals: [...s.goals, { id: crypto.randomUUID(), saved: 0, createdAt: new Date().toISOString(), ...g }],
      })),
      contributeToGoal: (id, amount) => set((s) => ({
        goals: s.goals.map((g) => g.id === id ? { ...g, saved: g.saved + amount } : g),
      })),
      deleteGoal: (id) => set((s) => ({
        goals: s.goals.filter((g) => g.id !== id),
      })),

      addLimit: (l) => set((s) => ({
        limits: [...s.limits, { id: crypto.randomUUID(), ...l }],
      })),
      updateLimit: (id, patch) => set((s) => ({
        limits: s.limits.map((l) => l.id === id ? { ...l, ...patch } : l),
      })),
      deleteLimit: (id) => set((s) => ({
        limits: s.limits.filter((l) => l.id !== id),
      })),

      setWeeklyPace: (n) => set({ weeklyPace: n }),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),

      hydrate: (data) => set((s) => ({
        transactions: data.transactions ?? s.transactions,
        goals: data.goals ?? s.goals,
        limits: data.limits ?? s.limits,
      })),
    }),
    {
      name: 'eva-finance',
      partialize: (s) => ({
        transactions: s.transactions,
        goals: s.goals,
        limits: s.limits,
        weeklyPace: s.weeklyPace,
        muted: s.muted,
      }),
    }
  )
)

export default useStore
