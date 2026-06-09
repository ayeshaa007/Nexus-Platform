import React, { useState } from 'react';
import {
  ArrowDownLeft, ArrowUpRight, RefreshCw, X, Check, AlertCircle,
} from 'lucide-react';
import { WalletCard } from '../../components/payments/WalletCard';
import { TransactionTable } from '../../components/payments/TransactionTable';
import { FundingDealFlow } from '../../components/payments/FundingDealFlow';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { walletData, transactions, fundingDealFlow, addTransaction } from '../../data/paymentsData';

// Modal component
const Modal = ({ title, icon, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const PaymentsPage = () => {
  const { user } = useAuth();
  const [txList, setTxList] = useState([...transactions]);
  const [wallet, setWallet] = useState(
    walletData[user?.id] || { balance: 0, currency: 'USD', escrowBalance: 0 }
  );
  const [modal, setModal] = useState(null); // 'deposit' | 'withdraw' | 'transfer' | null
  const [form, setForm] = useState({ amount: '', recipient: '', note: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const setF = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleAction = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) { setError('Enter a valid amount.'); return; }

    if (modal === 'withdraw' && amount > wallet.balance) {
      setError('Insufficient balance.');
      return;
    }

    const tx = addTransaction({
      type: modal,
      amount,
      senderId: user?.id || 'current',
      senderName: user?.name || 'You',
      receiverId: modal === 'deposit' ? 'nexus' : form.recipient || 'recipient',
      receiverName: modal === 'deposit' ? 'Nexus Wallet' : form.recipient || 'Recipient',
      description: form.note || `${modal.charAt(0).toUpperCase() + modal.slice(1)} of ${fmt(amount)}`,
      status: 'completed',
    });

    setTxList((prev) => [tx, ...prev]);

    if (modal === 'deposit') setWallet((w) => ({ ...w, balance: w.balance + amount }));
    if (modal === 'withdraw') setWallet((w) => ({ ...w, balance: w.balance - amount }));
    if (modal === 'transfer') setWallet((w) => ({ ...w, balance: w.balance - amount }));

    setSuccess(`${modal.charAt(0).toUpperCase() + modal.slice(1)} of ${fmt(amount)} successful!`);
    setForm({ amount: '', recipient: '', note: '' });
    setError('');
    setTimeout(() => { setSuccess(''); setModal(null); }, 1800);
  };

  const openModal = (type) => { setModal(type); setError(''); setSuccess(''); };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Wallet</h1>
        <p className="text-gray-600">Manage deposits, withdrawals, transfers and deal funding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="space-y-5">
          {/* Wallet card */}
          <WalletCard
            wallet={wallet}
            onDeposit={() => openModal('deposit')}
            onWithdraw={() => openModal('withdraw')}
            onTransfer={() => openModal('transfer')}
          />

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Total Deposited',
                value: fmt(txList.filter((t) => t.type === 'deposit' && t.senderId === user?.id).reduce((s, t) => s + t.amount, 0) + 50000),
                color: 'text-green-700',
                bg: 'bg-green-50',
              },
              {
                label: 'Total Withdrawn',
                value: fmt(txList.filter((t) => t.type === 'withdrawal' && t.senderId === user?.id).reduce((s, t) => s + t.amount, 0)),
                color: 'text-red-600',
                bg: 'bg-red-50',
              },
              {
                label: 'In Escrow',
                value: fmt(wallet.escrowBalance || 0),
                color: 'text-yellow-700',
                bg: 'bg-yellow-50',
              },
              {
                label: 'Transactions',
                value: txList.length,
                color: 'text-primary-700',
                bg: 'bg-primary-50',
              },
            ].map((s) => (
              <Card key={s.label} className={s.bg}>
                <CardBody className="py-3 px-4">
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Right col: deal flow + recent */}
        <div className="lg:col-span-2 space-y-5">
          <FundingDealFlow
            steps={fundingDealFlow}
            dealName="TechWave AI – Series A"
            totalAmount="$1.5M"
          />

          {/* Recent transactions (mini) */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            </CardHeader>
            <CardBody className="space-y-2 p-3">
              {txList.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${
                    tx.type === 'deposit' ? 'bg-green-50' :
                    tx.type === 'withdrawal' ? 'bg-red-50' :
                    tx.type === 'escrow' ? 'bg-yellow-50' : 'bg-blue-50'
                  }`}>
                    {tx.type === 'deposit' ? <ArrowDownLeft size={15} className="text-green-600" /> :
                     tx.type === 'withdrawal' ? <ArrowUpRight size={15} className="text-red-500" /> :
                     <RefreshCw size={15} className="text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.senderId === user?.id ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.senderId === user?.id ? '-' : '+'}{fmt(tx.amount)}
                    </p>
                    <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'primary'} size="sm">
                      {tx.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Full transaction table */}
      <TransactionTable transactions={txList} currentUserId={user?.id} />

      {/* Modals */}
      {modal === 'deposit' && (
        <Modal
          title="Deposit Funds"
          icon={<ArrowDownLeft size={18} className="text-green-600" />}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            {success && <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm"><Check size={15} />{success}</div>}
            {error && <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm"><AlertCircle size={15} />{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input type="number" min="1" className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  placeholder="0.00" value={form.amount} onChange={setF('amount')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
                <option>•••• •••• •••• 4242 (Visa)</option>
                <option>•••• •••• •••• 5555 (Mastercard)</option>
                <option>Bank Transfer (ACH)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                placeholder="Purpose of deposit" value={form.note} onChange={setF('note')} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button fullWidth onClick={handleAction} leftIcon={<ArrowDownLeft size={15} />}>
                Deposit {form.amount ? fmt(parseFloat(form.amount) || 0) : ''}
              </Button>
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'withdraw' && (
        <Modal
          title="Withdraw Funds"
          icon={<ArrowUpRight size={18} className="text-red-500" />}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            {success && <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm"><Check size={15} />{success}</div>}
            {error && <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm"><AlertCircle size={15} />{error}</div>}
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              Available: <span className="font-semibold text-gray-900">{fmt(wallet.balance)}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input type="number" min="1" className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  placeholder="0.00" value={form.amount} onChange={setF('amount')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Withdraw To</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
                <option>Bank Account (Chase ••••3487)</option>
                <option>Bank Account (BoA ••••9921)</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button fullWidth variant="error" onClick={handleAction} leftIcon={<ArrowUpRight size={15} />}>
                Withdraw {form.amount ? fmt(parseFloat(form.amount) || 0) : ''}
              </Button>
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'transfer' && (
        <Modal
          title="Transfer Funds"
          icon={<RefreshCw size={18} className="text-blue-500" />}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            {success && <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm"><Check size={15} />{success}</div>}
            {error && <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm"><AlertCircle size={15} />{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                placeholder="Name or Nexus ID" value={form.recipient} onChange={setF('recipient')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input type="number" min="1" className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  placeholder="0.00" value={form.amount} onChange={setF('amount')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                placeholder="What's this for?" value={form.note} onChange={setF('note')} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button fullWidth onClick={handleAction} leftIcon={<RefreshCw size={15} />}>
                Send Transfer
              </Button>
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
