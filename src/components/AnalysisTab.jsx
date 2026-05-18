import { useMemo } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import WalletCard from './WalletCard'
import GlassSection from './GlassSection'
import { IconClock, IconBars, IconTrophy, IconChart, IconTarget, IconAnalysis, IconLock, IconPlus } from '../icons'
import { spring } from '../anim'

function fmt(n) {
  return Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function startOfWeek(d) {
  const x = new Date(d); const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); x.setHours(0,0,0,0); return x
}

const PALETTE = ['var(--accent)', 'var(--accent-2)', 'var(--violet)', 'var(--green-2)', '#F8C75A', 'var(--accent-3)']

export default function AnalysisTab({ onGoTab }) {
  const txs = useStore((s) => s.transactions)
  const goals = useStore((s) => s.goals)
  const limits = useStore((s) => s.limits)
  const weeklyPace = useStore((s) => s.weeklyPace)
  const setWeeklyPace = useStore((s) => s.setWeeklyPace)

  const weekStats = useMemo(() => {
    const now = new Date()
    const wStart = startOfWeek(now)
    const prevStart = new Date(wStart); prevStart.setDate(prevStart.getDate() - 7)
    let inc=0, exp=0, incPrev=0, expPrev=0
    txs.forEach((t) => {
      const d = new Date(t.date)
      if (d >= wStart) {
        if (t.type === 'income') inc += t.amount; else exp += t.amount
      } else if (d >= prevStart) {
        if (t.type === 'income') incPrev += t.amount; else expPrev += t.amount
      }
    })
    const saved = inc - exp
    const savedPrev = incPrev - expPrev
    const delta = saved - savedPrev
    return { inc, exp, saved, dInc: inc - incPrev, dExp: exp - expPrev, dSav: delta }
  }, [txs])

  const topCats = useMemo(() => {
    const map = {}
    txs.filter((t) => t.type === 'expense').forEach((t) => {
      const k = t.cat || 'Другое'
      if (!map[k]) map[k] = { name: k, value: 0, emoji: t.emoji || '💸' }
      map[k].value += t.amount
    })
    return Object.values(map).sort((a,b) => b.value - a.value).slice(0,3)
  }, [txs])
  const maxCatValue = topCats[0]?.value || 1

  const limitsView = useMemo(() => {
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0)
    return limits.map((l) => {
      const used = txs
        .filter((t) => t.type === 'expense' && t.cat === l.category && new Date(t.date) >= monthStart)
        .reduce((s, t) => s + t.amount, 0)
      const pct = l.amount > 0 ? Math.min(100, Math.round(used / l.amount * 100)) : 0
      const state = used > l.amount ? 'over' : used > l.amount * 0.7 ? 'warn' : 'ok'
      return { ...l, used, pct, state }
    })
  }, [limits, txs])

  const totalSaved = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    - txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const goalsDone = goals.filter((g) => g.saved >= g.target).length

  function forecast(remaining) {
    if (remaining <= 0) return { label: 'готово', weeks: 0, done: true }
    if (weeklyPace <= 0) return { label: '—', weeks: 0, done: false }
    const weeks = Math.ceil(remaining / weeklyPace)
    const d = new Date(); d.setDate(d.getDate() + weeks * 7)
    const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
    return { label: `${d.getDate()} ${months[d.getMonth()]}`, weeks, done: false }
  }
  const activeGoals = goals.filter((g) => g.saved < g.target)

  const weekNumber = Math.ceil(((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 86400000 + 1) / 7)

  return (
    <div style={{ paddingBottom: 90 }}>
      <WalletCard compact />

      <div style={{
        padding: '10px 16px 4px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px' }}>Анализ</div>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--t1)' }}>
          неделя {weekNumber}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
        style={{
          margin: '10px 14px 0',
          padding: '14px 16px',
          borderRadius: 22,
          background: 'linear-gradient(150deg, #fff7f1 0%, #ffe6d4 100%)',
          border: '.5px solid rgba(255,255,255,.95)',
          boxShadow: '0 6px 22px rgba(120,80,90,.08), inset 0 1px 0 rgba(255,255,255,.8)',
          overflow: 'hidden', position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,126,85,.18), transparent 65%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 10, fontWeight: 600, color: 'var(--accent)',
          textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 6,
        }}>
          <IconClock size={13} /> Итог недели
        </div>
        <div style={{
          fontSize: 16, fontWeight: 700, letterSpacing: '-.4px',
          lineHeight: 1.3, marginBottom: 10,
        }}>
          {weekStats.saved >= 0
            ? <>На этой неделе ты <b style={{ background: 'linear-gradient(120deg, var(--accent), var(--hero-3))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontWeight: 800 }}>отложила €{fmt(weekStats.saved)}</b> {weekStats.dSav > 0 ? '💪' : ''}</>
            : <>На этой неделе перерасход <b>€{fmt(-weekStats.saved)}</b></>
          }
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <HeroMini label="Заработала" value={`€${fmt(weekStats.inc)}`} delta={weekStats.dInc} up={weekStats.dInc > 0} />
          <HeroMini label="Потратила" value={`€${fmt(weekStats.exp)}`} delta={weekStats.dExp} up={weekStats.dExp < 0} invert />
          <HeroMini label="В копилку" value={`€${fmt(Math.max(0, weekStats.saved))}`} delta={weekStats.dSav} up={weekStats.dSav > 0} />
        </div>
      </motion.div>

      <GlassSection title="На что уходят деньги" icon={<IconBars size={14} />} delay={1}>
        {topCats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '14px 8px', color: 'var(--t2)', fontSize: 12 }}>
            Расходов пока нет
          </div>
        ) : topCats.map((c, i) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 0' }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--t2)', width: 14 }}>{i + 1}</div>
            <div style={{
              width: 28, height: 28, borderRadius: 9,
              background: '#fff',
              border: '.5px solid rgba(255,255,255,.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15,
              boxShadow: '0 1px 3px rgba(120,80,90,.06)',
            }}>
              {c.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: 12, letterSpacing: '-.1px' }}>{c.name}</span>
                <span
                  className="tnum"
                  style={{ fontWeight: 700, fontSize: 12, color: PALETTE[i] }}
                >
                  €{fmt(c.value)}
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(0,0,0,.05)', borderRadius: 3, marginTop: 5, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.value / maxCatValue * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', borderRadius: 3, background: PALETTE[i] }}
                />
              </div>
            </div>
          </div>
        ))}
      </GlassSection>

      <GlassSection title="Достижения" icon={<IconTrophy size={14} />} delay={2}>
        <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
          <Badge active title="Стрик" sub="2 недели" Icon={IconChart} />
          <Badge active={goalsDone > 0} title="Первая цель" sub={goalsDone > 0 ? 'достигнута' : '0 из 1'} Icon={IconTarget} />
          <Badge active={totalSaved >= 500} title="€500" sub={`${Math.round(totalSaved)}/500`} Icon={IconLock} />
          <Badge active={goals.length >= 3} title="3 цели" sub={`${goals.length} из 3`} Icon={IconLock} />
        </div>
      </GlassSection>

      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...spring, delay: 0.18 }}
        style={{
          margin: '10px 14px 0',
          padding: 14,
          borderRadius: 22,
          background: 'rgba(255,255,255,.7)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '.5px solid rgba(255,255,255,.85)',
          boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 8px 24px rgba(120,80,90,.08)',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}>
            <span style={{ color: 'var(--accent)', display: 'flex' }}><IconAnalysis size={14} /></span>
            Прогноз по целям
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--t1)' }}>потяни ползунок</div>
        </div>

        <div style={{
          padding: '10px 8px 6px', marginBottom: 10,
          background: 'rgba(255,255,255,.5)', borderRadius: 14,
          border: '.5px solid rgba(255,255,255,.9)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 8, padding: '0 4px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '.4px' }}>
              Откладывать
            </div>
            <div className="tnum" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--accent)' }}>
              €{weeklyPace}<span style={{ fontSize: 11, fontWeight: 500, color: 'var(--t1)', marginLeft: 2 }}>/нед</span>
            </div>
          </div>
          <input
            type="range" min="5" max="50" step="1"
            value={weeklyPace}
            onChange={(e) => setWeeklyPace(+e.target.value)}
            style={{
              width: '100%', height: 6, appearance: 'none', WebkitAppearance: 'none',
              background: `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${(weeklyPace - 5) / 45 * 100}%, rgba(0,0,0,.06) ${(weeklyPace - 5) / 45 * 100}%, rgba(0,0,0,.06) 100%)`,
              borderRadius: 4, outline: 'none',
            }}
            className="weekly-slider"
          />
          <style>{`
            .weekly-slider::-webkit-slider-thumb {
              -webkit-appearance: none; appearance: none;
              width: 20px; height: 20px; border-radius: 50%;
              background: #fff; border: 1px solid var(--accent);
              box-shadow: 0 2px 8px var(--accent-soft-2);
              cursor: pointer;
            }
            .weekly-slider::-moz-range-thumb {
              width: 20px; height: 20px; border-radius: 50%;
              background: #fff; border: 1px solid var(--accent);
              box-shadow: 0 2px 8px var(--accent-soft-2);
              cursor: pointer;
            }
          `}</style>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '6px 4px 0',
            fontSize: 9.5, color: 'var(--t2)', fontWeight: 500,
          }}>
            <span>€5</span><span>€50</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeGoals.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--t1)', textAlign: 'center', padding: '8px 0' }}>
              Нет активных целей — добавь на странице «Цели»
            </div>
          ) : activeGoals.map((g) => {
            const rem = g.target - g.saved
            const f = forecast(rem)
            const p = Math.min(100, Math.round(g.saved / g.target * 100))
            return (
              <div key={g.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: 8, borderRadius: 14,
                background: 'rgba(255,255,255,.6)',
                border: '.5px solid rgba(255,255,255,.85)',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: '#fff', border: '.5px solid rgba(0,0,0,.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(120,80,90,.06)',
                }}>
                  {g.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600, letterSpacing: '-.1px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {g.name}
                    </div>
                    <div className="tnum" style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                      {f.label}
                    </div>
                  </div>
                  <div style={{ height: 4, background: 'rgba(0,0,0,.05)', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        height: '100%', borderRadius: 3,
                        background: 'linear-gradient(90deg, var(--accent-2), var(--accent))',
                      }}
                    />
                  </div>
                  <div className="tnum" style={{ fontSize: 9.5, color: 'var(--t1)', marginTop: 3, lineHeight: 1 }}>
                    осталось €{fmt(rem)} · ~{f.weeks || '—'} нед
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      <GlassSection title="Мои лимиты" icon={<IconClock size={14} />} delay={3}>
        {limitsView.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '14px 8px', color: 'var(--t2)', fontSize: 12 }}>
            Лимиты пока не настроены
          </div>
        ) : limitsView.map((l) => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 9,
              background: '#fff',
              border: '.5px solid rgba(255,255,255,.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15,
              boxShadow: '0 1px 3px rgba(120,80,90,.06)',
            }}>
              {l.emoji || '💼'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{l.category}</div>
                <div className="tnum" style={{ fontSize: 11, fontWeight: 700 }}>
                  <span style={{ color: l.state === 'over' ? 'var(--red)' : 'var(--t0)' }}>€{fmt(l.used)}</span>{' '}
                  <span style={{ color: 'var(--t1)' }}>/ €{fmt(l.amount)}</span>
                </div>
              </div>
              <div style={{ height: 5, background: 'rgba(0,0,0,.06)', borderRadius: 3, marginTop: 5, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${l.pct}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: '100%', borderRadius: 3,
                    background: l.state === 'over'
                      ? 'linear-gradient(90deg, #FF9F8A, #FF4A55)'
                      : l.state === 'warn'
                        ? 'linear-gradient(90deg, #FFD08A, #F8A23B)'
                        : 'linear-gradient(90deg, var(--green-2), var(--green))',
                  }}
                />
              </div>
              <div style={{
                fontSize: 9.5, marginTop: 3, lineHeight: 1,
                color: l.state === 'over' ? 'var(--red)' : 'var(--t1)',
                fontWeight: l.state === 'over' ? 600 : 500,
              }}>
                {l.state === 'over'
                  ? `Превышен на €${fmt(l.used - l.amount)}`
                  : `Осталось €${fmt(l.amount - l.used)}`
                }
              </div>
            </div>
          </div>
        ))}
      </GlassSection>
    </div>
  )
}

function HeroMini({ label, value, delta, up, invert }) {
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 13,
      background: 'rgba(255,255,255,.7)',
      border: '.5px solid rgba(255,255,255,.9)',
    }}>
      <div style={{ fontSize: 9.5, color: 'var(--t1)', fontWeight: 500, marginBottom: 2, lineHeight: 1 }}>
        {label}
      </div>
      <div className="tnum" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.3px', lineHeight: 1 }}>
        {value}
      </div>
      {Math.abs(delta) > 0.01 && (
        <div className="tnum" style={{
          fontSize: 9.5, fontWeight: 600, marginTop: 2, lineHeight: 1,
          color: up ? 'var(--green)' : 'var(--accent)',
        }}>
          {(invert ? !up : up) ? '↑' : '↓'} €{Math.abs(delta).toFixed(0)}
        </div>
      )}
    </div>
  )
}

function Badge({ active, title, sub, Icon }) {
  return (
    <div style={{
      flex: 1, padding: '10px 8px 8px', borderRadius: 14,
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4,
      minWidth: 0,
      background: active
        ? 'linear-gradient(150deg, #fff, #ffe6d4)'
        : 'rgba(255,255,255,.5)',
      border: '.5px solid ' + (active ? 'var(--accent-soft)' : 'rgba(255,255,255,.7)'),
      boxShadow: active ? '0 4px 14px var(--accent-soft)' : 'none',
      opacity: active ? 1 : .55,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        background: active
          ? 'linear-gradient(150deg, var(--accent), var(--hero-3))'
          : 'rgba(0,0,0,.15)',
        boxShadow: active ? '0 3px 10px var(--accent-soft-2)' : 'none',
      }}>
        <Icon size={14} sw={2} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
      <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--t1)', lineHeight: 1 }}>{sub}</div>
    </div>
  )
}
