// EVA Finance — звуки через WebAudio API.
let ctx = null
let muted = false

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      ctx = new AC()
    } catch (e) { return null }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

export function setMuted(v) { muted = !!v }
export function isMuted() { return muted }

function tone({ freq, type = 'sine', start = 0, dur = 0.12, gain = 0.18, attack = 0.005, release = 0.08 }) {
  const c = getCtx(); if (!c || muted) return
  const t = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + release)
  osc.connect(g).connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + release + 0.02)
}

function noiseBurst({ start = 0, dur = 0.04, gain = 0.08, hp = 3000 } = {}) {
  const c = getCtx(); if (!c || muted) return
  const t = c.currentTime + start
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const src = c.createBufferSource()
  src.buffer = buf
  const hpf = c.createBiquadFilter()
  hpf.type = 'highpass'
  hpf.frequency.value = hp
  const g = c.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(hpf).connect(g).connect(c.destination)
  src.start(t)
  src.stop(t + dur + 0.02)
}

export function playKey() {
  tone({ freq: 880, type: 'triangle', dur: 0.03, gain: 0.05, attack: 0.001, release: 0.04 })
}

export function playCoin() {
  tone({ freq: 1320, type: 'triangle', dur: 0.06, gain: 0.12, attack: 0.002, release: 0.08 })
  tone({ freq: 1760, type: 'sine',     dur: 0.05, gain: 0.10, start: 0.02, attack: 0.002, release: 0.1 })
  noiseBurst({ start: 0.005, dur: 0.05, gain: 0.06, hp: 4000 })
}

export function playCashRegister() {
  const c = getCtx(); if (!c || muted) return
  tone({ freq: 880,  type: 'square',   dur: 0.05, gain: 0.06, start: 0,    release: 0.04 })
  tone({ freq: 1175, type: 'triangle', dur: 0.08, gain: 0.14, start: 0.04, release: 0.1 })
  tone({ freq: 1760, type: 'sine',     dur: 0.10, gain: 0.10, start: 0.08, release: 0.14 })
  noiseBurst({ start: 0.06, dur: 0.08, gain: 0.05, hp: 5000 })
  tone({ freq: 1480, type: 'triangle', dur: 0.06, gain: 0.10, start: 0.16, release: 0.1 })
}

export function playGoalDone() {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) => {
    tone({ freq: f, type: 'triangle', dur: 0.18, gain: 0.14, start: i * 0.07, attack: 0.005, release: 0.25 })
  })
  tone({ freq: 1568, type: 'sine', dur: 0.4, gain: 0.08, start: 0.32, attack: 0.01, release: 0.5 })
}

export function playTap() {
  tone({ freq: 540, type: 'sine', dur: 0.04, gain: 0.06, attack: 0.001, release: 0.04 })
}
