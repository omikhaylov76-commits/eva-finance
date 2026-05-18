import { motion } from 'framer-motion'
import useStore from '../store'
import WalletCard from './WalletCard'
import GlassSection from './GlassSection'
import TxRow from './TxRow'
import { IconArrowUp, IconArrowDown, IconClock, IconTarget, IconBulb } from '../icons'
import { spring } from '../anim'

const TIPS = [
  'Откладывай хотя бы 10% от любых денег, которые получаешь.',
  'Перед покупкой подожди 24 часа — может, оно и не нужно?',
  'Ставь конкретные цели — намного приятнее копить на мечту.',
  'Сравнивай цены — можно сэкономить очень много денег.',
  'Записывай каждую трату — так поймёшь, куда уходят деньги.',
]

function fmt(n) {
  return Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function MiniPill({ kind, label, value }) {
  const isIn = kind === 'income'
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 9,
      padding: '9px 12px', borderRadius: 14,
      background: 'rgba(255,255,255,.6)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '.5px solid rgba(255,255,255,.75)',
      boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 4px 14px rgba(120,80,90,.06)',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8,
        background: isIn ? 'var(--green-soft)' : 'var(--accent-soft)',
        color: isIn ? 'var(--green)' : 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {isIn ? <IconArrowUp size={13} sw={2} /> : <IconArrowDown size={13} sw={2} />}
      </div>
      <div>
        <div style={{ fontSize: 10, color: 'var(--t1)', fontWeight: 500, lineHeight: 1, marginBottom: 3 }}>
          {label}
        </div>
        <div className="tnum" style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '-.3px', lineHeight: 1 }}>
          {isIn ? '+' : '−'}€{fmt(value)}
        </div>
      </div>
    </div>
  )
}

function GoalMini({ goal }) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100))
  const done = pct >= 100
  return (
    <div style={{
      flex: 1, padding: '10px 12px', borderRadius: 14,
      background: 'rgba(255,255,255,.9)',
      border: '.5px solid rgba(255,255,255,.95)',
      boxShadow: '0 1px 0 rgba(255,255,255,.9) inset, 0 3px 10px rgba(120,80,90,.05)',
      display: 'flex', flexDirection: 'column', gap: 6,
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 7,
          background: 'rgba(0,0,0,.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, flexShrink: 0,
        }}>
          {goal.emoji}
        </div>
        <div style={{
          fontWeight: 600, fontSize: 11.5, letterSpacing: '-.1px',
          flex: 1, minWidth: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {goal.name}
        </div>
      </div>
      <div style={{ height: 4, background: 'rgba(0,0,0,.05)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%', borderRadius: 3,
            background: done
              ? 'linear-gradient(90deg, var(--green-2), var(--green))'
              : 'linear-gradient(90deg, var(--accent-2), var(--accent))',
          }}
        />
      </div>
      <div className="tnum" style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 9.5, fontWeight: 600, color: 'var(--t1)',
      }}>
        <span>€{Math.round(goal.saved)} / €{Math.round(goal.target)}</span>
        <span style={{ color: done ? 'var(--green)' : 'var(--accent)' }}>{pct}%</span>
      </div>
    </div>
  )
}

export default function HomeTab({ onOpenTx, onGoTab }) {
  const txs = useStore((s) => s.transactions)
  const goals = useStore((s) => s.goals)
  const inc = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const exp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const recent = txs.slice(0, 4)
  const tip = TIPS[new Date().getDate() % TIPS.length]
  const topGoals = goals.slice(0, 2)

  return (
    <div style={{ paddingBottom: 90 }}>
      <WalletCard onAction={onOpenTx} />

      <div style={{ display: 'flex', gap: 8, padding: '10px 14px 0' }}>
        <MiniPill kind="income"  label="Доход за май"  value={inc} />
        <MiniPill kind="expense" label="Расход за май" value={exp} />
      </div>

      <GlassSection
        title="Последние операции"
        icon={<IconClock size={14} />}
        onAll={() => onGoTab('wallet')}
        delay={1}
      >
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '14px 8px', color: 'var(--t2)', fontSize: 12 }}>
            Пока пусто — добавь первую запись
          </div>
        ) : recent.map((tx) => <TxRow key={tx.id} tx={tx} />)}
      </GlassSection>

      <GlassSection
        title="Мои цели"
        icon={<IconTarget size={14} />}
        onAll={() => onGoTab('goals')}
        delay={2}
      >
        {topGoals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '14px 8px', color: 'var(--t2)', fontSize: 12 }}>
            Добавь первую цель и начни копить
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, padding: 2 }}>
            {topGoals.map((g) => <GoalMini key={g.id} goal={g} />)}
          </div>
        )}
      </GlassSection>

      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...spring, delay: 0.18 }}
        style={{
          margin: '10px 14px 0',
          padding: '11px 14px',
          borderRadius: 18,
          background: 'rgba(255,255,255,.62)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '.5px solid rgba(255,255,255,.8)',
          boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 6px 20px rgba(120,80,90,.06)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 10,
          background: 'var(--accent-soft)', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <IconBulb size={15} />
        </div>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 600, color: 'var(--t1)',
            textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2,
          }}>
            Совет дня
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-.1px' }}>
            {tip}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
