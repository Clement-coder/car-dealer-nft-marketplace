'use client';

import { Wallet, DollarSign, ArrowDownToLine } from 'lucide-react';

export default function WalletSection() {
  const activities = [
    { action: 'Sold', car: 'Tesla Model S', amount: '1.5 ETH', time: '2 hours ago' },
    { action: 'Minted', car: 'BMW M4', amount: '0.05 ETH', time: '1 day ago' },
    { action: 'Sold', car: 'Porsche 911', amount: '2.8 ETH', time: '3 days ago' },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">My Wallet</h1>
          <p className="text-gray-300">Manage your assets and earnings</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Wallet Address</h2>
              <Wallet className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
              <code className="text-gray-200 font-mono text-lg">0x742d...E5A8</code>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Available Balance</h2>
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-baseline space-x-2 mb-6">
              <span className="text-5xl font-bold text-white">0.0</span>
              <span className="text-2xl text-white/80">ETH</span>
            </div>
            <button className="w-full bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-105 flex items-center justify-center">
              <ArrowDownToLine className="h-5 w-5 mr-2" />
              Withdraw Proceeds
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                  <div>
                    <p className="text-white font-medium">{a.action} {a.car}</p>
                    <p className="text-gray-400 text-sm">{a.time}</p>
                  </div>
                  <span className="text-cyan-400 font-bold">{a.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
