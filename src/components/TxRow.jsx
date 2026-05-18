import { motion } from 'framer-motion'
import { IconTrash } from '../icons'

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']

function fmt(n) {
  return Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function formatDate(iso) {
  const today = new Date(); today.setHours(0,0,0,0)
  const d = new Date(iso)
  const day0 = new Date(d); day0.setHours(0,0,0,0)
  if (day0.getTime() === today.getTime()) return 'Сегодня'
  const yest = new Date(today); yest.setDate(yest.getDate() - 1)
  if (day0.getTime() === yest.getTime()) return 'Вчера'
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export default function TxRow({ tx, onDelete }) {
  const isIncome = tx.type === 'income'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, transition: { duration: 0.18 } }}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '7px 2px',
        borderBottom: '.5px solid var(--line)',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: 'rgba(255,255,255,.9)',
        border: '.5px solid rgba(255,255,255,.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        boxShadow: '0 2px 6px rgba(120,80,90,.07)',
      }}>
        {tx.emoji || (isIncome ? '💰' : '💸')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 600, fontSize: 12.5, letterSpacing: '-.1px',
          color: 'var(--t0)', lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {tx.desc || tx.cat || (isIncome ? 'Доход' : 'Расход')}
        </div>
        <div style={{
          fontWeight: 500, fontSize: 10.5, color: 'var(--t2)',
          marginTop: 1, lineHeight: 1,
        }}>
          {formatDate(tx.date)}
        </div>
      </div>
      <div
        className="tnum"
        style={{
          fontWeight: 700, fontSize: 12.5, letterSpacing: '-.2px',
          color: isIncome ? 'var(--green)' : 'var(--accent)',
          flexShrink: 0, textAlign: 'right',
        }}
      >
        {isIncome ? '+' : '−'}€{fmt(tx.amount)}
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(tx.id)}
          style={{
            width: 24, height: 24, opacity: .4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--t2)', flexShrink: 0,
          }}
        >
          <IconTrash size={14} />
        </button>
      )}
    </motion.div>
  )
}
