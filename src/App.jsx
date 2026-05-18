import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TabBar from './components/TabBar'
import HomeTab from './components/HomeTab'
import WalletTab from './components/WalletTab'
import GoalsTab from './components/GoalsTab'
import AnalysisTab from './components/AnalysisTab'
import TxModal from './components/TxModal'
import GoalModal from './components/GoalModal'
import ContribModal from './components/ContribModal'
import { loadFromCloud } from './sync'
import { tabFade } from './anim'
import useStore from './store'
import { setMuted } from './sounds'

export default function App() {
  const [tab, setTab] = useState('home')
  const [txModal, setTxModal] = useState(null)
  const [goalModal, setGoalModal] = useState(false)
  const [contribId, setContribId] = useState(null)
  const muted = useStore((s) => s.muted)

  useEffect(() => { loadFromCloud() }, [])
  useEffect(() => { setMuted(muted) }, [muted])

  return (
    <div style={{ width: '100%', height: '100svh', position: 'relative', overflow: 'hidden' }}>
      <div className="app-bg" />
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} {...tabFade}>
            {tab === 'home'     && <HomeTab     onOpenTx={setTxModal} onGoTab={setTab} />}
            {tab === 'wallet'   && <WalletTab   onOpenTx={setTxModal} />}
            {tab === 'goals'    && <GoalsTab    onOpenTx={setTxModal} onOpenGoal={() => setGoalModal(true)} onContrib={setContribId} />}
            {tab === 'analysis' && <AnalysisTab onGoTab={setTab} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <TabBar tab={tab} onChange={setTab} />
      <AnimatePresence>
        {txModal   && <TxModal     key="tx"      initType={txModal} onClose={() => setTxModal(null)} />}
        {goalModal && <GoalModal   key="goal"    onClose={() => setGoalModal(false)} />}
        {contribId && <ContribModal key="contrib" goalId={contribId} onClose={() => setContribId(null)} />}
      </AnimatePresence>
    </div>
  )
}
