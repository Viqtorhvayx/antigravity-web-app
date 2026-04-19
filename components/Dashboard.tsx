"use client";

import React from 'react';
import { Shield, Zap, TrendingUp, Lock } from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';

const Dashboard = () => {
  const { address, isConnected, walletType } = useWeb3();

  // Mock data for visual indicators
  const xp = 72;
  const healthFactor = 85;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d1d1d1] p-8 font-mono">
      <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-12 border-b border-[#1a1a1a] pb-6 gap-6">
        <div>
          <h1 className="text-lg font-light tracking-[0.3em] text-[#d1d1d1] font-outfit uppercase">CREDO</h1>
          <p className="text-[10px] text-[#4d9a9a] mt-1 tracking-widest opacity-60">STABILITY_THROUGH_REPUTATION</p>
        </div>
        <div className="flex gap-4">
          {!isConnected ? (
            <div className="flex gap-2">
              <button className="px-4 py-1 text-xs border border-[#2a2a2a] hover:bg-[#1a1a1a] transition-all">
                CONNECT_METAMASK
              </button>
              <button className="px-4 py-1 text-xs border border-[#2a2a2a] hover:bg-[#1a1a1a] transition-all">
                CONNECT_HASHPACK
              </button>
            </div>
          ) : (
            <button className="px-4 py-1 text-xs border border-[#2a2a2a] text-[#8b4513]">
              DISCONNECT_{walletType?.toUpperCase()}
            </button>
          )}
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* REPUTATION MODULE */}
        <section className="col-span-1 bg-[#0f0f0f] border border-[#1a1a1a] p-6">
          <h3 className="text-xs font-bold mb-6 text-[#4d9a9a]">REPUTATION_XP</h3>
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#1a1a1a"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#4d9a9a"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={552.92}
                strokeDashoffset={552.92 * (1 - xp / 100)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{xp}</span>
              <span className="text-[10px] text-[#555]">XP_INDEX</span>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-[10px]">
              <span>STATUS:</span>
              <span className="text-white">PRIME_BORROWER</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>COOLDOWN:</span>
              <span className="text-white">INACTIVE</span>
            </div>
          </div>
        </section>

        {/* HEALTH_FACTOR MODULE */}
        <section className="col-span-1 bg-[#0f0f0f] border border-[#1a1a1a] p-6">
          <h3 className="text-xs font-bold mb-6 text-[#8b4513]">HEALTH_FACTOR</h3>
          <div className="h-48 flex items-end justify-center gap-2 px-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-full transition-all duration-500 ${
                  i < (healthFactor / 10) ? 'bg-[#8b4513]' : 'bg-[#1a1a1a]'
                }`}
                style={{ height: `${(i + 1) * 10}%` }}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <span className="text-2xl font-bold text-white">{healthFactor}%</span>
            <p className="text-[10px] text-[#555]">SYSTEM_STABILITY_INDEX</p>
          </div>
        </section>

        {/* ASSET_STATS MODULE */}
        <section className="col-span-1 bg-[#0f0f0f] border border-[#1a1a1a] p-6">
          <h3 className="text-xs font-bold mb-6 text-white">ASSET_CONTROL</h3>
          <div className="space-y-6">
            <div className="border-l-2 border-[#1a1a1a] pl-4">
              <span className="text-[10px] block text-[#555]">TOTAL_LOCKED</span>
              <span className="text-xl font-bold text-white">4.2k HBAR</span>
            </div>
            <div className="border-l-2 border-[#1a1a1a] pl-4">
              <span className="text-[10px] block text-[#555]">LENDING_POINTS</span>
              <span className="text-xl font-bold text-[#4d9a9a]">12,850 pts</span>
            </div>
            <div className="border-l-2 border-[#1a1a1a] pl-4">
              <span className="text-[10px] block text-[#555]">ACTIVE_LOANS</span>
              <span className="text-xl font-bold text-[#8b4513]">150 USDT</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {['LOCK_ASSETS', 'PROVIDE_LIQUIDITY', 'BORROW_FUNDS', 'REPAY_LOANS'].map((action) => (
          <button
            key={action}
            className="p-4 border border-[#1a1a1a] text-xs hover:border-[#4d9a9a] hover:text-white transition-all text-left"
          >
            {action} // &gt;
          </button>
        ))}
      </footer>
    </div>
  );
};

export default Dashboard;
