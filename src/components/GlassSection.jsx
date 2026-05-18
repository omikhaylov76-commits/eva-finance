import { motion } from 'framer-motion'
import { IconChevRight } from '../icons'
import { spring } from '../anim'

export default function GlassSection({ title, icon, onAll, children, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring, delay: delay * 0.06 }}
      style={{
        margin: '10px 14px 0',
        padding: '12px 14px 8px',
        borderRadius: 20,
        background: 'rgba(255,255,255,.62)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '.5px solid rgba(255,255,255,.8)',
        boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 6px 20px rgba(120,80,90,.06)',
        ...style,
      }}
    >
      {(title || onAll) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8, padding: '0 2px',
        }}>
          {title && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontWeight: 600, fontSize: 13.5, letterSpacing: '-.2px',
            }}>
              {icon && <span style={{ color: 'var(--accent)', display: 'flex' }}>{icon}</span>}
              {title}
            </div>
          )}
          {onAll && (
            <button
              onClick={onAll}
              style={{
                fontWeight: 600, fontSize: 11.5, color: 'var(--accent)',
                display: 'flex', alignItems: 'center', gap: 2,
              }}
            >
              Все <IconChevRight size={11} sw={2} />
            </button>
          )}
        </div>
      )}
      {children}
    </motion.div>
  )
}
