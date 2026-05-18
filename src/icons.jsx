// SVG-иконки outline 1.8px.
const SW = 1.8

function I({ size = 18, sw = SW, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

export const IconHome      = (p) => <I {...p}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></I>
export const IconWallet    = (p) => <I {...p}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 15h2"/></I>
export const IconTarget    = (p) => <I {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></I>
export const IconAnalysis  = (p) => <I {...p}><path d="M3 18l5-5 4 4 9-9"/><path d="M14 8h7v7"/></I>
export const IconPlus      = (p) => <I {...p}><path d="M12 5v14M5 12h14"/></I>
export const IconMinus     = (p) => <I {...p}><path d="M5 12h14"/></I>
export const IconArrowUp   = (p) => <I {...p}><path d="M7 17l10-10M7 7h10v10"/></I>
export const IconArrowDown = (p) => <I {...p}><path d="M17 7L7 17M17 17H7V7"/></I>
export const IconClock     = (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></I>
export const IconChevRight = (p) => <I {...p}><path d="M9 6l6 6-6 6"/></I>
export const IconTrash     = (p) => <I {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></I>
export const IconBulb      = (p) => <I {...p}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></I>
export const IconBars      = (p) => <I {...p}><path d="M3 18h6M3 12h12M3 6h18"/></I>
export const IconTrophy    = (p) => <I {...p}><path d="M12 2l2.4 6.9H22l-6 4.4 2.3 7.2L12 16l-6.3 4.5L8 13.3 2 8.9h7.6L12 2z"/></I>
export const IconChart     = (p) => <I {...p}><path d="M3 18l4-8 4 5 4-9 6 12"/></I>
export const IconLock      = (p) => <I {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></I>
export const IconClose     = (p) => <I {...p}><path d="M6 6l12 12M18 6L6 18"/></I>
export const IconCheck     = (p) => <I {...p} sw={2.4}><path d="M5 12l5 5L20 7"/></I>
export const IconBackspace = (p) => <I {...p}><path d="M3 12l5-6h12v12H8z"/><path d="M12 9l4 6M16 9l-4 6"/></I>
export const IconVolumeOn  = (p) => <I {...p}><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 9c1.5 1 1.5 5 0 6M19 7c3 2 3 8 0 10"/></I>
export const IconVolumeOff = (p) => <I {...p}><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 9l6 6M22 9l-6 6"/></I>

export const IconBow = (p) => (
  <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6h12M2 10h12M4 3l1 3M12 3l-1 3M4 13l1-3M12 13l-1-3"/>
  </svg>
)
