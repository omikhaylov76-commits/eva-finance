import { AnimatePresence } from 'framer-motion'
import useStore from '../store'
import WalletCard from './WalletCard'
import GlassSection from './GlassSection'
import TxRow from './TxRow'
import { deleteTransactionRemote } from '../sync'

export default function WalletTab({ onOpenTx }) {
  const txs = useStore((s) => s.transactions)
  const deleteTransaction = useStore((s) => s.deleteTransaction)

  const handleDelete = (id) => {
    deleteTransaction(id)
    deleteTransactionRemote(id).catch(() => {})
  }

  const month = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'][new Date().getMonth()]

  return (
    <div style={{ paddingBottom: 90 }}>
      <WalletCard onAction={onOpenTx} />

      <div style={{
        padding: '10px 16px 4px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px' }}>Все операции</div>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--t1)' }}>
          {txs.length} за {month}
        </div>
      </div>

      <GlassSection style={{ marginTop: 4 }}>
        {txs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--t2)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🌸</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Пока пусто!</div>
          </div>
        ) : (
          <AnimatePresence>
            {txs.map((tx) => <TxRow key={tx.id} tx={tx} onDelete={handleDelete} />)}
          </AnimatePresence>
        )}
      </GlassSection>
    </div>
  )
}
