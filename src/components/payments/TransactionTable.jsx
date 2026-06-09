import React, { useState } from 'react';
import {
  ArrowUpRight, ArrowDownLeft, RefreshCw, Lock, Search, Filter,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card, CardBody, CardHeader } from '../ui/Card';

const typeIcon = {
  deposit: <ArrowDownLeft size={15} className="text-green-600" />,
  withdrawal: <ArrowUpRight size={15} className="text-red-500" />,
  transfer: <RefreshCw size={15} className="text-blue-500" />,
  escrow: <Lock size={15} className="text-yellow-600" />,
};

const typeColor = {
  deposit: 'text-green-600',
  withdrawal: 'text-red-500',
  transfer: 'text-blue-600',
  escrow: 'text-yellow-700',
};

const statusVariant = {
  completed: 'success',
  pending: 'warning',
  in_escrow: 'primary',
  failed: 'error',
};

const fmt = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const TransactionTable = ({ transactions = [], currentUserId }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      !search ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.senderName.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiverName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || tx.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 w-44"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-primary-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
              <option value="escrow">Escrow</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Type', 'Description', 'From', 'To', 'Amount', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isOut = tx.senderId === currentUserId;
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-gray-100 rounded-lg">{typeIcon[tx.type]}</span>
                          <span className="capitalize text-gray-700">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {tx.description}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{tx.senderName}</td>
                      <td className="px-4 py-3 text-gray-700">{tx.receiverName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${isOut ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {isOut ? '-' : '+'}{fmt(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[tx.status] || 'gray'} size="sm">
                          {tx.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};
