"use client";

import React, { useState } from 'react';
import StadiumMap from '@/components/StadiumMap';

type Tab = 'map' | 'food' | 'queue';

export default function FanExperience() {
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [showCartFlash, setShowCartFlash] = useState(false);

  const addToCart = (name: string) => {
    setCartItems(prev => [...prev, name]);
    setShowCartFlash(true);
    setTimeout(() => setShowCartFlash(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col">

      {/* ── APP BAR ── */}
      <header className="px-5 pt-12 pb-4 flex justify-between items-center bg-[#0A1124]/90 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
        <div>
          <h1 className="text-xl font-black tracking-tight">Stadium<span className="text-blue-500">IQ</span></h1>
          <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.22em] mt-0.5">Rajiv Gandhi Stadium · IPL 2025</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Live</span>
          </div>
          <button className="relative p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-base">🔔</span>
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050B18]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-black">AR</div>
        </div>
      </header>

      {/* ── BODY ── */}
      <main className="flex-1 overflow-y-auto pb-32">

        {/* MATCH TICKER */}
        <section className="px-5 pt-5 pb-0">
          <div className="bg-gradient-to-r from-[#0e1f42] via-[#111f48] to-[#0a1a3a] rounded-2xl border border-white/8 p-4 flex items-center gap-3 overflow-hidden relative">
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400/80 mb-1">Live Score · T20 · Over 15.3</div>
              <div className="flex items-baseline gap-3">
                <div>
                  <span className="text-2xl font-black text-white">156</span>
                  <span className="text-sm text-white/50 font-bold">/4</span>
                </div>
                <div className="text-[10px] text-white/40 font-bold uppercase">HYD <span className="text-white/20">vs</span> BLR</div>
                <div className="ml-auto text-right">
                  <div className="text-[9px] text-white/40 uppercase font-bold">Target</div>
                  <div className="text-sm font-black text-amber-400">186</div>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                {[1,4,0,6,1,2].map((r, i) => (
                  <span key={i} className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center ${r === 6 ? 'bg-purple-500/80' : r === 4 ? 'bg-blue-500/80' : r === 0 ? 'bg-white/10' : 'bg-white/20'}`}>{r}</span>
                ))}
                <span className="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center bg-white/5 text-white/30">·</span>
              </div>
            </div>
            <div className="shrink-0 w-px h-12 bg-white/10" />
            <div className="shrink-0 text-center px-2">
              <div className="text-[9px] text-white/40 uppercase font-bold mb-1">RRR</div>
              <div className="text-lg font-black text-amber-400">12.5</div>
              <div className="text-[8px] text-white/30">per over</div>
            </div>
          </div>
        </section>

        {/* ACTIVE TICKET */}
        <section className="px-5 pt-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-0.5">Your Ticket</div>
              <h2 className="text-base font-black mb-3">Hyderabad Sunrisers <span className="text-white/50">vs</span> Bangalore RCB</h2>
              <div className="flex gap-4 text-[10px]">
                {[
                  { label: 'Gate', value: 'B' },
                  { label: 'Block', value: 'D4' },
                  { label: 'Row', value: '12' },
                  { label: 'Seat', value: '34' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-white/50 mb-0.5">{label}</div>
                    <div className="font-black text-sm">{value}</div>
                  </div>
                ))}
                <button className="ml-auto bg-white text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black shadow-lg group-hover:scale-105 transition-transform self-end">
                  Navigate →
                </button>
              </div>
            </div>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-4 -bottom-10 w-24 h-24 bg-indigo-800/30 rounded-full blur-2xl pointer-events-none" />
          </div>
        </section>

        {/* ── MAP TAB ── */}
        {activeTab === 'map' && (
          <section className="px-5 pt-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Stadium Map</h3>
              <div className="flex items-center gap-3 text-[9px] text-white/40 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" />You</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />Food</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" />WC</span>
              </div>
            </div>

            {/* Stadium SVG */}
            <div className="bg-[#080f1e] rounded-3xl border border-white/8 p-3 relative overflow-hidden aspect-[5/4]">
              <StadiumMap showPlayerPin compact />
            </div>

            {/* Wayfinding card */}
            <div className="bg-[#0A1124] rounded-2xl border border-white/8 p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500/15 rounded-xl flex items-center justify-center text-lg shrink-0">📍</div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Nearest Food Stall</div>
                <div className="text-sm font-bold truncate">Gate B Concessions</div>
                <div className="text-[10px] text-white/40 mt-0.5">~80m · Est. 3 min wait</div>
              </div>
              <button className="shrink-0 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-xl text-[10px] font-bold transition-colors">Go</button>
            </div>

            {/* Facilities row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🚻', label: 'Restrooms', sub: 'North · 1m wait', color: 'text-purple-400' },
                { icon: '🏥', label: 'First Aid', sub: 'Gate A · Open', color: 'text-red-400' },
                { icon: '🛒', label: 'Merch', sub: 'East Wing · Busy', color: 'text-amber-400' },
              ].map(({ icon, label, sub, color }) => (
                <div key={label} className="bg-[#0A1124] rounded-2xl border border-white/5 p-3 hover:border-white/15 transition-colors cursor-pointer active:scale-95">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className={`text-[10px] font-bold ${color}`}>{label}</div>
                  <div className="text-[8px] text-white/30 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FOOD TAB ── */}
        {activeTab === 'food' && (
          <section className="px-5 pt-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Order to Seat</h3>
              {cartItems.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
                  <span className="text-[9px] font-bold text-blue-400">🛒 {cartItems.length} items</span>
                </div>
              )}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Food', 'Drinks', 'Snacks', 'Merch'].map((cat, i) => (
                <button key={cat} className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${i === 0 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {[
                { name: 'Classic Chicken Biryani', price: '₹299', cat: 'Food Court L1 · Gate B', emoji: '🍛', prep: '8 min', popular: true },
                { name: 'Paneer Tikka (6pc)', price: '₹189', cat: 'North Snacks · Gate A', emoji: '🧆', prep: '5 min', popular: false },
                { name: 'Samosa Platter (3pc)', price: '₹120', cat: 'North Snacks · Gate A', emoji: '🥟', prep: '3 min', popular: false },
                { name: 'Chilled Pepsi 500ml', price: '₹60', cat: 'Beverage Stand', emoji: '🥤', prep: '1 min', popular: false },
                { name: 'SRH Team Jersey 2025', price: '₹1,299', cat: 'Official Merch · East', emoji: '👕', prep: 'Pickup', popular: true },
                { name: 'Loaded Nachos', price: '₹149', cat: 'Food Court L1', emoji: '🌽', prep: '6 min', popular: false },
              ].map(({ name, price, cat, emoji, prep, popular }) => (
                <div key={name} className="bg-[#0A1124] rounded-2xl border border-white/5 p-4 flex gap-3 items-center group hover:border-white/10 transition-colors active:scale-[0.98]">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0">{emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">{cat}</div>
                      {popular && <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-bold uppercase">Popular</span>}
                    </div>
                    <div className="text-sm font-bold truncate">{name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="text-xs font-black">{price}</div>
                      <div className="text-[9px] text-white/30">· {prep}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(name)}
                    className="shrink-0 w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-lg hover:bg-blue-600 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── QUEUE TAB ── */}
        {activeTab === 'queue' && (
          <section className="px-5 pt-5 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Entry Pass</h3>

            {/* QR Card */}
            <div className="bg-[#0A1124] rounded-3xl border border-white/8 overflow-hidden">
              <div className="p-5 text-center border-b border-dashed border-white/10">
                <div className="w-44 h-44 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-2xl relative">
                  {/* Faux QR pattern */}
                  <div className="w-36 h-36 grid grid-cols-7 gap-0.5">
                    {Array.from({ length: 49 }).map((_, i) => {
                      const corners = [0,1,2,7,8,9,14,16,18,21,28,30,32,35,38,39,40,41,42,47,48];
                      const filled = corners.includes(i) || (i % 3 === 0 && i % 7 !== 6) || Math.random() > 0.6;
                      return <div key={i} className={`rounded-[1px] ${filled ? 'bg-black' : 'bg-transparent'}`} />;
                    })}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-emerald-500 px-2 py-0.5 rounded-full text-[9px] font-bold text-white border-2 border-[#0A1124] uppercase">Active</div>
                </div>
                <p className="text-[10px] text-white/40 mt-3 font-bold">SCAN AT TURNSTILE</p>
              </div>
              <div className="p-5 grid grid-cols-3 divide-x divide-white/5">
                {[
                  { label: 'Gate', value: 'B', sub: 'North Entry' },
                  { label: 'Valid Until', value: '04:30', sub: 'PM IST' },
                  { label: 'Block', value: 'D4', sub: 'Upper Tier' },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="text-center px-3">
                    <div className="text-[9px] text-white/30 uppercase font-bold mb-0.5">{label}</div>
                    <div className="text-lg font-black">{value}</div>
                    <div className="text-[9px] text-white/30">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wait time widget */}
            <div className="bg-[#0A1124] rounded-2xl border border-white/8 p-4">
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-3">Real-time Gate Wait</div>
              <div className="space-y-2.5">
                {[
                  { gate: 'Gate A', wait: '1m 20s', pct: 20, status: 'Low' },
                  { gate: 'Gate B ★ Yours', wait: '4m 00s', pct: 55, status: 'Medium' },
                  { gate: 'Gate C', wait: '8m 45s', pct: 85, status: 'Busy' },
                  { gate: 'Gate D', wait: '2m 10s', pct: 30, status: 'Low' },
                ].map(({ gate, wait, pct, status }) => (
                  <div key={gate}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold">{gate}</span>
                      <span className={`font-bold ${pct > 70 ? 'text-red-400' : pct > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{wait}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${pct > 70 ? 'bg-red-500' : pct > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Cart flash toast */}
      {showCartFlash && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-blue-600 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl shadow-blue-900/40 z-40 animate-bounce">
          ✓ Added to cart
        </div>
      )}

      {/* ── TAB BAR ── */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[88%] max-w-[400px] h-16 bg-[#0D1830]/95 backdrop-blur-2xl rounded-full border border-white/10 px-6 flex justify-around items-center shadow-2xl z-30">
        <TabBtn icon="🗺️" label="Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
        <TabBtn icon="🍔" label="Order" active={activeTab === 'food'} onClick={() => setActiveTab('food')} badge={cartItems.length > 0 ? String(cartItems.length) : undefined} />
        <TabBtn icon="🎟️" label="Queue" active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} badge={activeTab !== 'queue' ? '1' : undefined} />
      </nav>
    </div>
  );
}

const TabBtn = ({ icon, label, active, onClick, badge }: { icon: string; label: string; active: boolean; onClick: () => void; badge?: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 relative transition-all duration-200 ${active ? 'scale-110' : 'opacity-40 hover:opacity-80'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    {badge && (
      <span className="absolute -top-1 -right-2 bg-blue-500 text-[8px] min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center font-bold">{badge}</span>
    )}
    {active && <span className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />}
  </button>
);
