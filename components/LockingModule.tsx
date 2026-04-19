"use client";

import React, { useState } from 'react';
import { Lock, AlertTriangle, Clock } from 'lucide-react';

const LockingModule = () => {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('HBAR');
  const [duration, setDuration] = useState('30'); // days

  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-8 max-w-xl mx-auto font-mono">
      <div className="flex items-center gap-2 mb-8">
        <Lock className="w-4 h-4 text-[#4d9a9a]" />
        <h2 className="text-sm font-bold tracking-widest">SECURE_VAULT_LOCK</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] text-[#555] block mb-2">SELECT_ASSET</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['HBAR', 'USDT', 'USDC'].map((a) => (
              <button
                key={a}
                onClick={() => setAsset(a)}
                className={`py-2 text-xs border ${
                  asset === a ? 'border-[#4d9a9a] text-white' : 'border-[#1a1a1a] text-[#555]'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-[#555] block mb-2">INPUT_AMOUNT</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#050505] border border-[#1a1a1a] p-3 text-white focus:border-[#4d9a9a] outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="text-[10px] text-[#555] block mb-2">LOCK_DURATION_(DAYS)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-[#050505] border border-[#1a1a1a] p-3 text-white focus:border-[#4d9a9a] outline-none"
          >
            <option value="21">21 DAYS (MIN_BONUS_PERIOD)</option>
            <option value="60">60 DAYS</option>
            <option value="180">180 DAYS</option>
            <option value="365">365 DAYS</option>
          </select>
        </div>

        {asset === 'HBAR' && (
          <div className="p-4 border border-[#4d9a9a]/20 bg-[#4d9a9a]/5 flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#4d9a9a] mt-1" />
            <div className="text-[10px] text-[#4d9a9a]">
              <p className="font-bold">STAKING_ADVANTAGE_ACTIVE</p>
              <p>HBAR accrues a 0.3% yield increase every 3 weeks of locking.</p>
            </div>
          </div>
        )}

        <div className="p-4 border border-[#8b4513]/20 bg-[#8b4513]/5 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#8b4513] mt-1" />
          <div className="text-[10px] text-[#8b4513]">
            <p className="font-bold">PENALTY_WARNING</p>
            <p>Early withdrawal results in a strict 5% deduction from principal.</p>
          </div>
        </div>

        <button className="w-full bg-[#1a1a1a] border border-[#2a2a2a] py-4 text-xs font-bold hover:bg-[#4d9a9a] hover:text-[#0a0a0a] transition-all">
          EXECUTE_LOCK_TRANSACTION // &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default LockingModule;
