import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

export const WalletCard = ({ wallet, onDeposit, onWithdraw, onTransfer }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const fmt = (n) =>
    n.toLocaleString('en-US', { style: 'currency', currency: wallet?.currency || 'USD' });

  return (
    <div className="relative rounded-2xl overflow-hidden text-white"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0d9488 100%)',
        minHeight: 200,
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full bg-white/5" />

      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-white/80" />
            <span className="text-sm font-medium text-white/80">Nexus Wallet</span>
          </div>
          <button
            onClick={() => setBalanceVisible((p) => !p)}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            {balanceVisible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <div>
          <p className="text-xs text-white/60 mb-1">Available Balance</p>
          <p className="text-3xl font-bold tracking-tight">
            {balanceVisible ? fmt(wallet?.balance || 0) : '•••••••'}
          </p>
        </div>

        {wallet?.escrowBalance > 0 && (
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <RefreshCw size={14} className="text-yellow-300" />
            <p className="text-xs text-white/80">
              In Escrow:{' '}
              <span className="font-semibold text-yellow-300">
                {balanceVisible ? fmt(wallet.escrowBalance) : '•••••'}
              </span>
            </p>
          </div>
        )}

       <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            className="min-w-[30%] flex-1 sm:flex-none bg-white/20 hover:bg-white/30 text-white border-0"
            leftIcon={<ArrowDownLeft size={14} />}
            onClick={onDeposit}
          >
            Deposit
          </Button>
          <Button
            size="sm"
            className="min-w-[30%] flex-1 sm:flex-none bg-white/20 hover:bg-white/30 text-white border-0"
            leftIcon={<ArrowUpRight size={14} />}
            onClick={onWithdraw}
          >
            Withdraw
          </Button>
          <Button
            size="sm"
            className="min-w-[30%] flex-1 sm:flex-none bg-white/20 hover:bg-white/30 text-white border-0"
            leftIcon={<RefreshCw size={14} />}
            onClick={onTransfer}
          >
            Transfer
          </Button>
        </div>
      </div>
    </div>
  );
};



