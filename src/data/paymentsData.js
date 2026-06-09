export const walletData = {
  e1: { userId: 'e1', balance: 24500.0, currency: 'USD', escrowBalance: 10000.0 },
  e2: { userId: 'e2', balance: 8200.0, currency: 'USD', escrowBalance: 0 },
  e3: { userId: 'e3', balance: 5000.0, currency: 'USD', escrowBalance: 0 },
  e4: { userId: 'e4', balance: 15800.0, currency: 'USD', escrowBalance: 5000.0 },
  i1: { userId: 'i1', balance: 980000.0, currency: 'USD', escrowBalance: 150000.0 },
  i2: { userId: 'i2', balance: 1250000.0, currency: 'USD', escrowBalance: 200000.0 },
  i3: { userId: 'i3', balance: 750000.0, currency: 'USD', escrowBalance: 80000.0 },
};

export const transactions = [
  {
    id: 'tx1',
    type: 'deposit',
    amount: 50000,
    senderId: 'i1',
    senderName: 'Michael Rodriguez',
    receiverId: 'e1',
    receiverName: 'Sarah Johnson',
    description: 'Series A initial tranche – TechWave AI',
    status: 'completed',
    date: '2026-05-15T10:30:00Z',
    dealId: 'deal1',
  },
  {
    id: 'tx2',
    type: 'transfer',
    amount: 20000,
    senderId: 'i2',
    senderName: 'Jennifer Lee',
    receiverId: 'e2',
    receiverName: 'David Chen',
    description: 'Seed round deposit – GreenLife Solutions',
    status: 'completed',
    date: '2026-05-20T14:00:00Z',
    dealId: 'deal2',
  },
  {
    id: 'tx3',
    type: 'escrow',
    amount: 150000,
    senderId: 'i1',
    senderName: 'Michael Rodriguez',
    receiverId: 'escrow',
    receiverName: 'Nexus Escrow',
    description: 'Escrow hold – TechWave AI Series A',
    status: 'in_escrow',
    date: '2026-05-28T09:00:00Z',
    dealId: 'deal1',
  },
  {
    id: 'tx4',
    type: 'withdrawal',
    amount: 10000,
    senderId: 'e1',
    senderName: 'Sarah Johnson',
    receiverId: 'bank',
    receiverName: 'Bank Account',
    description: 'Withdrawal to bank',
    status: 'completed',
    date: '2026-06-01T11:00:00Z',
    dealId: null,
  },
  {
    id: 'tx5',
    type: 'transfer',
    amount: 80000,
    senderId: 'i3',
    senderName: 'Robert Torres',
    receiverId: 'escrow',
    receiverName: 'Nexus Escrow',
    description: 'Escrow – HealthPulse deal',
    status: 'pending',
    date: '2026-06-03T08:30:00Z',
    dealId: 'deal3',
  },
];

export const fundingDealFlow = [
  { step: 1, label: 'Term Sheet Signed', completed: true },
  { step: 2, label: 'Due Diligence', completed: true },
  { step: 3, label: 'Funds in Escrow', completed: true },
  { step: 4, label: 'Legal Review', completed: false },
  { step: 5, label: 'Funds Released', completed: false },
];

export const addTransaction = (tx) => {
  const newTx = {
    ...tx,
    id: `tx${transactions.length + 1}`,
    date: new Date().toISOString(),
    status: tx.status || 'pending',
  };
  transactions.push(newTx);
  return newTx;
};
