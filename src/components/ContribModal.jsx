import { useState } from 'react'
import { motion } from 'framer-motion'
import ModalShell, { SubmitBtn } from './ModalShell'
import NumPad from './NumPad'
import useStore from '../store'
import { pushGoal } from '../sync'
import { IconPlus, IconCheck } from '../icons'
import { playCoin, playGoalDone } from '../sounds'

function fmt(n) {
  return Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function ContribModal({ goalId, onClose }) {
  const [amount, setAmount] = useState('')
  const [shake, setShake] = useState(false)
  const goals = useStore((s) => s.goals)
  const contributeToGoal = useStore((s) => s.contributeToGoal)
  const goal = goals.find((g) => g.id === goalId)
  if (!goal) return null

  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100))

  const handleSave = () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
      return
    }
    contributeToGoal(goal.id, amt)
    pushGoal({ ...goal, saved: goal.saved + amt }).catch(() => {})
    const reaches = goal.saved + amt >= goal.target
    if (reaches) playGoalDone(); else playCoin()
    onClose()
  }

  return (
    <ModalShell
      title={`${goal.emoji || '🎯'} ${goal.name}`}
      icon={<IconPlus size={13} sw={2.5} />}
      onClose={onClose}
    >
      <div style={{ marginBottom: 14 }}>
        <div className="tnum" style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, fontWeight: 600, color: 'var(--t1)', marginBottom: 6,
        }}>
          <span>Накоплено: €{fmt(goal.saved)}</span>
          <span>Цель: €{fmt(goal.target)}</span>
        </div>
        <div style={{
          height: 8, borderRadius: 6, background: 'rgba(0,0,0,.05)', overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '100%', borderRadius: 6,
              background: 'linear-gradient(90deg, var(--accent-2), var(--accent))',
            }}
          />
        </div>
      </div>

      <motion.div animate={shake ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }} transition={{ duration: 0.28 }}>
        <NumPad value={amount} onChange={setAmount} />
      </motion.div>

      <SubmitBtn onClick={handleSave}>
        <IconCheck size={13} sw={2.4} />
        В копилку
      </SubmitBtn>
    </ModalShell>
  )
}
