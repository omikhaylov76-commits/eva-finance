import { motion } from 'framer-motion'
import useStore from '../store'
import { IconBow, IconMinus, IconPlus } from '../icons'
import { tap, spring } from '../anim'

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
const WDAYS  = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']

function fmt(n) {
  return Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function WalletCard({ compact = false, onAction }) {
  const txs = useStore((s) => s.transactions)
  const inc = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const exp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const bal = inc - exp

  const d = new Date()
  const dateStr = `${WDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`

  const [intPart, decPart] = fmt(bal).split(',')

  return (
    <div style={{ padding: '8px 14px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
        style={{
          position: 'relative',
          padding: compact ? '10px 14px' : '13px 16px 14px',
          borderRadius: 22,
          background: 'linear-gradient(150deg, var(--hero-1) 0%, var(--hero-2) 55%, var(--hero-3) 100%)',
          overflow: 'hidden',
          boxShadow: '0 10px 28px var(--accent-soft-2), 0 2px 4px rgba(0,0,0,.06)',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 60% 70% at 100% 0%, rgba(255,255,255,.28), transparent 60%),' +
            'radial-gradient(ellipse 50% 40% at 0% 100%, rgba(255,255,255,.14), transparent 50%)',
        }}/>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)',
        }}/>

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: compact ? 6 : 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#fff' }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7,
              background: 'rgba(255,255,255,.22)',
              border: '.5px solid rgba(255,255,255,.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              <IconBow size={12} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '.5px' }}>EVA</div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,.88)',
            padding: '4px 10px', borderRadius: 10,
            background: 'rgba(255,255,255,.16)',
            border: '.5px solid rgba(255,255,255,.25)',
          }}>
            {dateStr}
          </div>
        </div>

        {!compact && (
          <div style={{
            position: 'relative', zIndex: 1,
            color: 'rgba(255,255,255,.78)', fontSize: 11.5, fontWeight: 500, marginBottom: 3,
          }}>
            Доступно
          </div>
        )}

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'baseline', gap: 3,
          color: '#fff', fontWeight: 700, lineHeight: 1, letterSpacing: '-1.5px',
        }} className="tnum">
          <span style={{ fontSize: 20, fontWeight: 600, opacity: 0.78 }}>€</span>
          <motion.span
            key={intPart}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            style={{ fontSize: compact ? 28 : 38, display: 'inline-block' }}
          >
            {intPart}
          </motion.span>
          <span style={{ fontSize: 20, fontWeight: 600, opacity: 0.82 }}>,{decPart}</span>
        </div>

        {!compact && onAction && (
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, marginTop: 12 }}>
            <motion.button
              {...tap}
              onClick={() => onAction('expense')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 8px', borderRadius: 14,
                background: 'rgba(255,255,255,.18)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '.5px solid rgba(255,255,255,.32)',
                color: '#fff', fontWeight: 600, fontSize: 12.5, letterSpacing: '-.1px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
              }}
            >
              <IconMinus size={14} sw={2} />
              Трата
            </motion.button>
            <motion.button
              {...tap}
              onClick={() => onAction('income')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 8px', borderRadius: 14,
                background: 'rgba(255,255,255,.18)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '.5px solid rgba(255,255,255,.32)',
                color: '#fff', fontWeight: 600, fontSize: 12.5, letterSpacing: '-.1px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
              }}
            >
              <IconPlus size={14} sw={2} />
              Доход
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
