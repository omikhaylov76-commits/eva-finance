import { useState } from 'react'
import { motion } from 'framer-motion'
import ModalShell, { SubmitBtn } from './ModalShell'
import NumPad from './NumPad'
import useStore from '../store'
import { pushTransaction } from '../sync'
import { IconMinus, IconPlus, IconCheck } from '../icons'
import { playCoin, playCashRegister } from '../sounds'

const EXP_CATS = [
  { e:'🍦', n:'Сладости' },{ e:'🎮', n:'Игры' },{ e:'📚', n:'Учёба' },{ e:'👗', n:'Одежда' },
  { e:'🎨', n:'Творч.' },{ e:'🚌', n:'Транс.' },{ e:'🎁', n:'Подарки' },{ e:'💝', n:'Другое' },
]
const INC_CATS = [
  { e:'💶', n:'Карман.' },{ e:'🎂', n:'Др' },{ e:'💪', n:'Заработ.' },{ e:'🎁', n:'Подарок' },
  { e:'📚', n:'Стипенд.' },{ e:'🏆', n:'Награда' },{ e:'🛍️', n:'Продала' },{ e:'🌟', n:'Другое' },
]

export default function TxModal({ initType, onClose }) {
  const [type, setType] = useState(initType)
  const [amount, setAmount] = useState('')
  const [catIdx, setCatIdx] = useState(0)
  const [shake, setShake] = useState(false)
  const addTransaction = useStore((s) => s.addTransaction)

  const cats = type === 'expense' ? EXP_CATS : INC_CATS
  const cat = cats[catIdx] || cats[0]

  const handleSave = () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
      return
    }
    const tx = {
      type, amount: amt,
      cat: cat.n, emoji: cat.e, desc: cat.n,
    }
    addTransaction(tx)
    pushTransaction({ ...tx, id: crypto.randomUUID(), date: new Date().toISOString() }).catch(() => {})
    if (type === 'income') playCashRegister(); else playCoin()
    onClose()
  }

  return (
    <ModalShell
      title={type === 'expense' ? 'Новая трата' : 'Новый доход'}
      icon={type === 'expense' ? <IconMinus size={13} sw={2.5} /> : <IconPlus size={13} sw={2.5} />}
      onClose={onClose}
    >
      <div style={{
        display: 'flex', padding: 3, borderRadius: 14,
        background: 'rgba(0,0,0,.05)', marginBottom: 10,
      }}>
        {['expense', 'income'].map((t) => {
          const active = type === t
          return (
            <motion.button
              key={t}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setType(t); setCatIdx(0) }}
              style={{
                flex: 1, padding: '8px 8px', borderRadius: 11,
                textAlign: 'center', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                background: active ? '#fff' : 'none',
                color: active
                  ? (t === 'income' ? 'var(--green)' : 'var(--accent)')
                  : 'var(--tab-inactive)',
                boxShadow: active
                  ? '0 1px 0 rgba(255,255,255,.9) inset, 0 2px 8px rgba(120,80,90,.1)'
                  : 'none',
                transition: 'background .2s, color .2s',
              }}
            >
              {t === 'expense' ? <IconMinus size={12} sw={2.5} /> : <IconPlus size={12} sw={2.5} />}
              {t === 'expense' ? 'Трата' : 'Доход'}
            </motion.button>
          )
        })}
      </div>

      <motion.div animate={shake ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }} transition={{ duration: 0.28 }}>
        <NumPad value={amount} onChange={setAmount} />
      </motion.div>

      <div style={{
        fontSize: 10, fontWeight: 600, color: 'var(--t1)',
        textTransform: 'uppercase', letterSpacing: '.5px',
        margin: '2px 2px 6px',
      }}>
        Категория
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, marginBottom: 8,
      }}>
        {cats.map((c, i) => {
          const active = i === catIdx
          return (
            <motion.button
              key={c.n}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCatIdx(i)}
              style={{
                height: 48, borderRadius: 12,
                background: active ? 'var(--accent)' : 'rgba(255,255,255,.7)',
                border: active ? 'none' : '.5px solid rgba(255,255,255,.9)',
                boxShadow: active
                  ? '0 3px 12px var(--accent-soft-2)'
                  : '0 1px 0 rgba(255,255,255,.8) inset, 0 2px 6px rgba(120,80,90,.04)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                transition: 'background .15s',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{c.e}</span>
              <span style={{
                fontSize: 9, fontWeight: 600, lineHeight: 1.1,
                letterSpacing: '-.1px',
                color: active ? '#fff' : 'var(--t0)',
              }}>
                {c.n}
              </span>
            </motion.button>
          )
        })}
      </div>

      <SubmitBtn onClick={handleSave}>
        <IconCheck size={13} sw={2.4} />
        Сохранить
      </SubmitBtn>
    </ModalShell>
  )
}
