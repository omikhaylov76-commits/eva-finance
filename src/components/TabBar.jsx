import { motion } from 'framer-motion'
import { IconHome, IconWallet, IconTarget, IconAnalysis, IconVolumeOn, IconVolumeOff } from '../icons'
import useStore from '../store'

const TABS = [
  { id: 'home',     label: 'Главная',    Icon: IconHome },
  { id: 'wallet',   label: 'Кошелёк',    Icon: IconWallet },
  { id: 'goals',    label: 'Цели',       Icon: IconTarget },
  { id: 'analysis', label: 'Анализ',     Icon: IconAnalysis },
]

export default function TabBar({ tab, onChange }) {
  const muted = useStore((s) => s.muted)
  const toggleMuted = useStore((s) => s.toggleMuted)

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5,
      padding: '0 14px max(14px, env(safe-area-inset-bottom))',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleMuted}
        aria-label={muted ? 'Включить звук' : 'Выключить звук'}
        style={{
          flexShrink: 0,
          width: 44, height: 44, borderRadius: 22,
          background: 'rgba(255,255,255,.55)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          border: '.5px solid rgba(255,255,255,.75)',
          color: muted ? 'var(--tab-inactive)' : 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow:
            '0 1px 0 rgba(255,255,255,.7) inset,' +
            '0 10px 28px rgba(120,80,90,.12),' +
            '0 2px 6px rgba(0,0,0,.06)',
        }}
      >
        {muted ? <IconVolumeOff size={18} /> : <IconVolumeOn size={18} />}
      </motion.button>

      <div style={{
        flex: 1,
        display: 'flex', padding: 6, gap: 3,
        background: 'rgba(255,255,255,.55)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        border: '.5px solid rgba(255,255,255,.75)',
        borderRadius: 24,
        boxShadow:
          '0 1px 0 rgba(255,255,255,.7) inset,' +
          '0 10px 28px rgba(120,80,90,.12),' +
          '0 2px 6px rgba(0,0,0,.06)',
      }}>
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '8px 4px 7px',
                borderRadius: 18,
                color: active ? 'var(--accent)' : 'var(--tab-inactive)',
                background: active
                  ? 'linear-gradient(150deg, #FFE6D4 0%, #FFD2BC 100%)'
                  : 'none',
                border: active ? '.5px solid rgba(255,255,255,.9)' : 'none',
                boxShadow: active
                  ? '0 1px 0 rgba(255,255,255,.9) inset, 0 3px 12px var(--accent-soft-2), 0 0 0 .5px var(--accent-soft) inset'
                  : 'none',
                transition: 'color .2s cubic-bezier(.32,.72,0,1), background .25s cubic-bezier(.32,.72,0,1), box-shadow .25s cubic-bezier(.32,.72,0,1)',
              }}
            >
              <motion.div
                animate={{ scale: active ? 1.06 : 1 }}
                transition={{ type: 'spring', stiffness: 460, damping: 30 }}
                style={{ display: 'flex' }}
              >
                <t.Icon size={22} />
              </motion.div>
              <span style={{
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                letterSpacing: '.1px',
                lineHeight: 1,
              }}>
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
