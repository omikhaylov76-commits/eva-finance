// Apple 2026 motion tokens — используем во всём проекте
// Spring stiffness 280-340, damping 30-40, cubic [0.32, 0.72, 0, 1]

export const apple = [0.32, 0.72, 0, 1]
export const easeOut = [0.22, 1, 0.36, 1]

export const spring = { type: 'spring', stiffness: 320, damping: 35 }
export const springSnappy = { type: 'spring', stiffness: 380, damping: 30 }

export const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: spring,
}

export const tap = { whileTap: { scale: 0.97 } }
export const tapKey = { whileTap: { scale: 0.94 } }

export const sheetMotion = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { type: 'spring', stiffness: 340, damping: 36 },
}

export const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.24, ease: apple },
}

export const tabFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.22, ease: apple },
}
