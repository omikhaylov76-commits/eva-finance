import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IconClose } from '../icons'

function useViewportHeight() {
  const [h, setH] = useState(() => window.visualViewport?.height ?? window.innerHeight)
  useEffect(() => {
    const vp = window.visualViewport
    if (!vp) return
    const upd = () => setH(vp.height)
    vp.addEventListener('resize', upd)
    vp.addEventListener('scroll', upd)
    return () => {
      vp.removeEventListener('resize', upd)
      vp.removeEventListener('scroll', upd)
    }
  }, [])
  return h
}

export default function ModalShell({ title, icon, onClose, children }) {
  const vpH = useViewportHeight()
  const maxH = Math.min(vpH - 48, 700)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(30,10,15,.22)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 640,
          background: 'rgba(255,250,246,.88)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderTop: '.5px solid rgba(255,255,255,.9)',
          borderRadius: '28px 28px 0 0',
          boxShadow: '0 -10px 40px rgba(60,30,40,.18), inset 0 1px 0 rgba(255,255,255,.9)',
          padding: '0 16px max(16px, env(safe-area-inset-bottom))',
          maxHeight: maxH,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{
          width: 36, height: 4, background: 'rgba(0,0,0,.18)',
          borderRadius: 2, margin: '8px auto 6px',
        }} />

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2px 8px',
        }}>
          <div style={{
            fontWeight: 700, fontSize: 16, letterSpacing: '-.3px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {icon && (
              <div style={{
                width: 22, height: 22, borderRadius: 7,
                background: 'var(--accent-soft)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {icon}
              </div>
            )}
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 14,
              background: 'rgba(0,0,0,.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--t0)',
            }}
          >
            <IconClose size={13} sw={2.2} />
          </button>
        </div>

        {children}
      </motion.div>
    </motion.div>
  )
}

export function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{
        display: 'block', marginBottom: 6,
        fontSize: 10, fontWeight: 600, color: 'var(--t1)',
        textTransform: 'uppercase', letterSpacing: '.5px',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export function FormInput(props) {
  return (
    <input
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '11px 14px', borderRadius: 14,
        background: 'rgba(255,255,255,.7)',
        border: '.5px solid rgba(255,255,255,.9)',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 2px 6px rgba(120,80,90,.04)',
        fontSize: 14, fontWeight: 500, color: 'var(--t0)',
        outline: 'none', fontFamily: 'inherit',
        ...props.style,
      }}
    />
  )
}

export function SubmitBtn({ onClick, children, color = 'var(--accent)' }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: '100%', padding: 11, marginTop: 10,
        borderRadius: 14,
        background: color, color: '#fff',
        fontWeight: 600, fontSize: 14, letterSpacing: '-.2px',
        boxShadow: '0 6px 18px var(--accent-soft-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}
    >
      {children}
    </motion.button>
  )
}
