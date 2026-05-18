import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import WalletCard from './WalletCard'
import { IconPlus, IconTrash } from '../icons'
import { deleteGoalRemote } from '../sync'
import { spring } from '../anim'

function fmt(n) {
  return Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function GoalCard({ goal, onContrib, onDelete, idx }) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100))
  const done = pct >= 100

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { ...spring, delay: idx * 0.06 } }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      style={{
        margin: '10px 14px 0',
        padding: 14,
        borderRadius: 20,
        background: 'rgba(255,255,255,.65)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '.5px solid rgba(255,255,255,.85)',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 6px 20px rgba(120,80,90,.06)',
      }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: '#fff', border: '.5px solid rgba(0,0,0,.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 2px 6px rgba(120,80,90,.08)',
          }}>
            {goal.emoji}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-.2px' }}>
              {goal.name}
            </div>
            {done && (
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 2 }}>
                Цель достигнута 🎉
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            className="tnum"
            style={{
              fontWeight: 700, fontSize: 16, letterSpacing: '-.4px',
              color: done ? 'var(--green)' : 'var(--t0)',
            }}
          >
            €{fmt(goal.saved)}
          </div>
          <div className="tnum" style={{ fontSize: 11, color: 'var(--t1)', fontWeight: 500, marginTop: 2 }}>
            из €{fmt(goal.target)}
          </div>
        </div>
      </div>

      <div style={{ height: 8, background: 'rgba(0,0,0,.05)', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%', borderRadius: 6,
            background: done
              ? 'linear-gradient(90deg, var(--green-2), var(--green))'
              : 'linear-gradient(90deg, var(--accent-2), var(--accent))',
          }}
        />
      </div>

      <div style={{
        fontSize: 11.5, fontWeight: 600, marginBottom: 10,
        color: done ? 'var(--green)' : 'var(--accent)',
      }}>
        {done ? '100% накоплено' : `${pct}% накоплено · осталось €${fmt(goal.target - goal.saved)}`}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onContrib(goal.id)}
          style={{
            flex: 1, padding: 9, borderRadius: 13,
            background: done ? 'var(--green)' : 'var(--accent)',
            color: '#fff', fontWeight: 600, fontSize: 12.5, letterSpacing: '-.1px',
            boxShadow: done
              ? '0 4px 14px rgba(48,180,120,.25)'
              : '0 4px 14px var(--accent-soft-2)',
          }}
        >
          + В копилку
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(goal.id)}
          style={{
            width: 38, padding: 9, borderRadius: 13,
            background: 'rgba(255,255,255,.7)',
            border: '.5px solid rgba(0,0,0,.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--t1)',
          }}
        >
          <IconTrash size={15} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function GoalsTab({ onOpenTx, onOpenGoal, onContrib }) {
  const goals = useStore((s) => s.goals)
  const deleteGoal = useStore((s) => s.deleteGoal)

  const handleDelete = (id) => {
    deleteGoal(id)
    deleteGoalRemote(id).catch(() => {})
  }

  return (
    <div style={{ paddingBottom: 90 }}>
      <WalletCard onAction={onOpenTx} />

      <div style={{
        padding: '10px 16px 4px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px' }}>Мои цели</div>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--t1)' }}>
          {goals.length} {goals.length === 1 ? 'активная' : 'активные'}
        </div>
      </div>

      <AnimatePresence>
        {goals.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--t2)' }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>⭐</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Добавь цель и начни копить!</div>
          </motion.div>
        )}
        {goals.map((g, i) => (
          <GoalCard
            key={g.id} goal={g} idx={i}
            onContrib={onContrib}
            onDelete={handleDelete}
          />
        ))}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onOpenGoal}
        style={{
          margin: '10px 14px 0',
          padding: 12, borderRadius: 18,
          background: 'rgba(255,126,85,.05)',
          border: '1.5px dashed rgba(255,126,85,.45)',
          color: 'var(--accent)',
          fontWeight: 600, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: 'calc(100% - 28px)',
        }}
      >
        <IconPlus size={14} sw={2} />
        Добавить новую цель
      </motion.button>
    </div>
  )
}
