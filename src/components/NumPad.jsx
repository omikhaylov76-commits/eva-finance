import { motion } from 'framer-motion'
import { IconBackspace } from '../icons'
import { playKey } from '../sounds'

const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','del']

export default function NumPad({ value, onChange }) {
  const handle = (k) => {
    playKey()
    if (k === 'del') { onChange(value.slice(0, -1)); return }
    if (k === '.' && value.includes('.')) return
    if (k === '.' && value === '') { onChange('0.'); return }
    if (value === '0' && k !== '.') { onChange(k); return }
    if (value.includes('.') && (value.split('.')[1]?.length ?? 0) >= 2) return
    if (value.replace('.', '').length >= 7) return
    onChange(value + k)
  }

  const display = value === '' ? '0' : value
  const zero = display === '0'

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4,
        padding: '8px 0 10px',
      }} className="tnum">
        <motion.span
          key={display}
          initial={{ scale: 0.92, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          style={{
            fontWeight: 700, fontSize: 38, letterSpacing: '-1.5px',
            color: zero ? 'var(--t2)' : 'var(--t0)',
            lineHeight: 1,
          }}
        >
          {display}
        </motion.span>
        <span style={{
          fontWeight: 600, fontSize: 18, color: 'var(--t1)',
          lineHeight: 1,
        }}>€</span>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
        marginBottom: 10,
      }}>
        {KEYS.map((k) => {
          const isDel = k === 'del'
          return (
            <motion.button
              key={k}
              whileTap={{ scale: 0.94 }}
              onPointerDown={(e) => { e.preventDefault(); handle(k) }}
              style={{
                height: 42, borderRadius: 13,
                background: isDel ? 'var(--accent-soft)' : '#fff',
                color: isDel ? 'var(--accent)' : 'var(--t0)',
                fontWeight: 600, fontSize: 18, letterSpacing: '-.3px',
                border: isDel ? '.5px solid rgba(255,126,85,.18)' : '.5px solid rgba(255,255,255,.95)',
                boxShadow: isDel
                  ? 'none'
                  : '0 1px 0 rgba(255,255,255,.9) inset, 0 2px 6px rgba(120,80,90,.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation',
              }}
            >
              {isDel ? <IconBackspace size={18} /> : k}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
