import { useState } from 'react'
import { motion } from 'framer-motion'
import ModalShell, { FormGroup, FormInput, SubmitBtn } from './ModalShell'
import NumPad from './NumPad'
import useStore from '../store'
import { pushGoal } from '../sync'
import { IconTarget, IconCheck } from '../icons'

const GOAL_EMOJIS = ['🎮','👟','🎒','🎨','✈️','📱','🎵','🌈','🏆','🍕','🛍️','💎']

export default function GoalModal({ onClose }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [target, setTarget] = useState('')
  const [shake, setShake] = useState(false)
  const addGoal = useStore((s) => s.addGoal)

  const handleSave = () => {
    const amt = parseFloat(target)
    if (!name.trim() || !amt || amt <= 0) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
      return
    }
    const goal = { name: name.trim(), emoji, target: amt }
    addGoal(goal)
    pushGoal({ ...goal, id: crypto.randomUUID(), saved: 0, createdAt: new Date().toISOString() }).catch(() => {})
    onClose()
  }

  return (
    <ModalShell
      title="Новая цель"
      icon={<IconTarget size={13} />}
      onClose={onClose}
    >
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto',
        paddingBottom: 4, marginBottom: 12,
        scrollbarWidth: 'none',
      }}>
        {GOAL_EMOJIS.map((e) => {
          const active = e === emoji
          return (
            <motion.button
              key={e}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEmoji(e)}
              style={{
                flexShrink: 0, width: 42, height: 42, borderRadius: 12,
                background: active ? 'var(--accent)' : 'rgba(255,255,255,.7)',
                border: active ? 'none' : '.5px solid rgba(255,255,255,.9)',
                boxShadow: active
                  ? '0 3px 12px var(--accent-soft-2)'
                  : '0 1px 0 rgba(255,255,255,.8) inset, 0 2px 6px rgba(120,80,90,.04)',
                fontSize: 22,
                transition: 'background .15s',
              }}
            >
              {e}
            </motion.button>
          )
        })}
      </div>

      <FormGroup label="Название цели">
        <FormInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например, новый телефон"
          type="text"
        />
      </FormGroup>

      <FormGroup label="Сумма цели €">
        <motion.div animate={shake ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }} transition={{ duration: 0.28 }}>
          <NumPad value={target} onChange={setTarget} />
        </motion.div>
      </FormGroup>

      <SubmitBtn onClick={handleSave}>
        <IconCheck size={13} sw={2.4} />
        Создать цель
      </SubmitBtn>
    </ModalShell>
  )
}
