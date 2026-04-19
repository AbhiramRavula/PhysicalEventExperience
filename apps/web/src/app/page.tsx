"use client";

import React, { useState, useEffect, useRef } from 'react';
import StadiumMap from '@/components/StadiumMap';

type Tab = 'live' | 'map' | 'order' | 'ticket';

// ── Ball-by-ball feed ──────────────────────────────────────────
const BALLS = [
  { run: 6, over: '15.1', bowler: 'Siraj', batter: 'Abhishek', desc: 'MAXIMUM! Pulled over mid-wicket!', color: 'from-purple-600 to-indigo-700' },
  { run: 1, over: '15.2', bowler: 'Siraj', batter: 'Abhishek', desc: 'Pushed to mid-on, quick single.', color: 'from-slate-700 to-slate-800' },
  { run: 4, over: '15.3', bowler: 'Siraj', batter: 'Heinrich', desc: 'FOUR! Driven through covers, beautiful!', color: 'from-blue-600 to-blue-800' },
  { run: 0, over: '15.4', bowler: 'Siraj', batter: 'Heinrich', desc: 'Good length, defended back.', color: 'from-slate-700 to-slate-800' },
  { run: 0, over: '15.5', bowler: 'Siraj', batter: 'Heinrich', desc: 'Bouncer, ducked under. Freebie coming?', color: 'from-slate-700 to-slate-800' },
];

const KEY_MOMENTS = [
  { time: '14.2', title: 'WICKET', desc: 'Shahbaz caught at long-on by Maxwell', icon: '🔴', color: 'text-red-400 border-red-500/20 bg-red-500/8' },
  { time: '10.0', title: 'SIX', desc: 'Heinrich Klaasen 100m meteor off Hazlewood', icon: '🟣', color: 'text-purple-400 border-purple-500/20 bg-purple-500/8' },
  { time: '6.4', title: 'FOUR', desc: 'Abhishek Sharma flicks fine leg boundary', icon: '🔵', color: 'text-blue-400 border-blue-500/20 bg-blue-500/8' },
  { time: '3.1', title: 'WICKET', desc: 'Head stumped down the pitch, Dinesh sharp!', icon: '🔴', color: 'text-red-400 border-red-500/20 bg-red-500/8' },
];

// ── Food menu ──────────────────────────────────────────────────
const MENU = [
  { id: 'm1', emoji: '🍛', name: 'Chicken Biryani', price: 299, prep: 8, cat: 'Food', popular: true, stall: 'Court L1 · Near Gate B' },
  { id: 'm2', emoji: '🥟', name: 'Samosa Platter (3pc)', price: 120, prep: 3, cat: 'Snacks', popular: false, stall: 'North Snacks · Gate A' },
  { id: 'm3', emoji: '🧆', name: 'Paneer Tikka (6pc)', price: 189, prep: 5, cat: 'Snacks', popular: true, stall: 'North Snacks · Gate A' },
  { id: 'm4', emoji: '🌽', name: 'Loaded Nachos', price: 149, prep: 6, cat: 'Snacks', popular: false, stall: 'Section D Kiosk' },
  { id: 'm5', emoji: '🥤', name: 'Chilled Pepsi 500ml', price: 60, prep: 1, cat: 'Drinks', popular: false, stall: 'Any Stand Kiosk' },
  { id: 'm6', emoji: '🍺', name: 'Kingfisher Draft', price: 180, prep: 2, cat: 'Drinks', popular: true, stall: 'Gate B Bar · Section D' },
  { id: 'm7', emoji: '☕', name: 'Masala Chai', price: 40, prep: 2, cat: 'Drinks', popular: false, stall: 'Any Stall' },
  { id: 'm8', emoji: '👕', name: 'SRH Jersey 2025', price: 1299, prep: 0, cat: 'Merch', popular: true, stall: 'Official Merch · East Wing' },
];

export default function FanExperience() {
  const [tab, setTab] = useState<Tab>('live');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cheerLevel, setCheerLevel] = useState(62);
  const [cheerBurst, setCheerBurst] = useState(false);
  const [activeCat, setActiveCat] = useState('All');
  const [currentBall, setCurrentBall] = useState(0);
  const [countdown, setCountdown] = useState(180); // seconds to next ball
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate cheer level fluctuating
  useEffect(() => {
    const t = setInterval(() => {
      setCheerLevel(prev => Math.min(100, Math.max(30, prev + (Math.random() * 10 - 5))));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Countdown to next delivery
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          setCurrentBall(b => (b + 1) % BALLS.length);
          return 30 + Math.floor(Math.random() * 20);
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU.find(m => m.id === id);
    return sum + (item?.price ?? 0) * qty;
  }, 0);

  const addToCart = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(c => {
    if ((c[id] || 0) <= 1) { const n = { ...c }; delete n[id]; return n; }
    return { ...c, [id]: c[id] - 1 };
  });

  const filteredMenu = activeCat === 'All' ? MENU : MENU.filter(m => m.cat === activeCat);

  const ball = BALLS[currentBall];

  const cheer = () => {
    setCheerBurst(true);
    setCheerLevel(prev => Math.min(100, prev + 15));
    setTimeout(() => setCheerBurst(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#04080f] text-white font-sans max-w-md mx-auto relative overflow-hidden flex flex-col shadow-2xl">

      {/* ── APP BAR ── */}
      <header className="px-5 pt-12 pb-3.5 bg-[#07101e]/95 backdrop-blur-xl sticky top-0 z-30 border-b border-white/5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight leading-none">Stadium<span className="text-blue-500">IQ</span></h1>
          <p className="text-[9px] text-white/35 font-bold uppercase tracking-[0.22em] mt-1">Rajiv Gandhi · IPL 2025</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/12 border border-red-500/25 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-red-400 uppercase tracking-wide">Live</span>
          </div>
          <button className="relative w-8 h-8 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="text-sm">🔔</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#07101e]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-black border border-white/10">AR</div>
        </div>
      </header>

      {/* ── SCROLLABLE BODY ── */}
      <main className="flex-1 overflow-y-auto pb-28 overscroll-contain">

        {/* ═══════════════════════════════════════ LIVE TAB */}
        {tab === 'live' && (
          <div className="space-y-0">
            {/* SCORE HERO */}
            <div className="bg-gradient-to-b from-[#09163a] to-[#04080f] px-5 pt-5 pb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400/80">T20 · IPL · Over 15.3</div>
                <div className="text-[9px] text-white/30 font-bold">HYD v/s BLR</div>
              </div>

              {/* Teams row */}
              <div className="flex items-center gap-3">
                {/* HYD */}
                <div className="flex-1">
                  <div className="text-[9px] font-black uppercase tracking-wide text-amber-400/80 mb-1">HYD 🟠</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black">156</span>
                    <span className="text-lg text-white/40 font-bold">/4</span>
                  </div>
                  <div className="text-[10px] text-white/40 mt-1">15.3 overs · RR 10.1</div>
                </div>

                {/* Divider */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="text-[8px] text-white/20 font-black uppercase">Need</div>
                  <div className="text-xl font-black text-amber-400">30</div>
                  <div className="text-[8px] text-white/20">27 balls</div>
                </div>

                {/* BLR */}
                <div className="flex-1 text-right">
                  <div className="text-[9px] font-black uppercase tracking-wide text-red-400/80 mb-1">🔴 BLR</div>
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-4xl font-black">185</span>
                    <span className="text-lg text-white/40 font-bold">/7</span>
                  </div>
                  <div className="text-[10px] text-white/40 mt-1">20 overs · RR 9.25</div>
                </div>
              </div>

              {/* This over */}
              <div className="mt-4">
                <div className="text-[8px] text-white/25 font-bold uppercase tracking-wider mb-1.5">This Over</div>
                <div className="flex gap-1.5 items-center">
                  {[1, 4, 0, 6, 1, 4].map((r, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full text-[10px] font-black flex items-center justify-center border ${
                        r === 6 ? 'bg-purple-600/80 border-purple-500 text-white' :
                        r === 4 ? 'bg-blue-600/80 border-blue-500 text-white' :
                        r === 'W' ? 'bg-red-600/80 border-red-500 text-white' :
                        r === 0 ? 'bg-white/5 border-white/10 text-white/40' :
                        'bg-white/10 border-white/15 text-white'
                      }`}
                    >{r}</div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-dashed border-white/15 flex items-center justify-center text-white/20 text-sm">·</div>
                </div>
              </div>
            </div>

            {/* BATTERS AT CREASE */}
            <div className="px-5 py-4 border-y border-white/5 bg-[#060e1c]">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">At The Crease</div>
              <div className="space-y-2">
                {[
                  { name: 'H. Klaasen ★', runs: 68, balls: 38, sr: '178.9', batting: true },
                  { name: 'Abhishek Sharma', runs: 42, balls: 28, sr: '150.0', batting: false },
                ].map(({ name, runs, balls, sr, batting }) => (
                  <div key={name} className={`flex items-center p-2.5 rounded-xl border ${batting ? 'border-amber-500/25 bg-amber-500/8' : 'border-white/5 bg-white/3'}`}>
                    <div className="flex-1">
                      <span className="text-xs font-black">{name}</span>
                      {batting && <span className="ml-2 text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">ON STRIKE</span>}
                    </div>
                    <div className="flex gap-4 text-right">
                      <div><div className="text-[8px] text-white/30">R(B)</div><div className="text-sm font-black">{runs}({balls})</div></div>
                      <div><div className="text-[8px] text-white/30">SR</div><div className={`text-sm font-black ${parseFloat(sr) > 150 ? 'text-emerald-400' : 'text-white'}`}>{sr}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHEER METER */}
            <div className="px-5 py-5 bg-[#04080f]">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">Crowd Energy</div>
              <div className="bg-[#080f1e] rounded-2xl border border-white/8 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[10px] text-white/40 font-bold">Stadium Buzz</div>
                    <div className={`text-2xl font-black mt-0.5 ${cheerLevel > 80 ? 'text-red-400' : cheerLevel > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>{Math.round(cheerLevel)}%</div>
                  </div>
                  <button
                    onClick={cheer}
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 font-black text-sm transition-all active:scale-90 ${cheerBurst ? 'bg-amber-500 scale-110' : 'bg-white/8 border border-white/15 hover:bg-white/12'}`}
                  >
                    <span className="text-2xl">{cheerBurst ? '🎉' : '📣'}</span>
                    <span className="text-[8px] uppercase tracking-wider text-white/60">Cheer!</span>
                  </button>
                </div>
                {/* Energy bar */}
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${cheerLevel > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : cheerLevel > 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                    style={{ width: `${cheerLevel}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-white/20 mt-1.5">
                  <span>Quiet</span><span>Buzzing</span><span>ROARING 🔥</span>
                </div>
              </div>
            </div>

            {/* LIVE DELIVERY CARD */}
            <div className="px-5 pb-5">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">Latest Delivery</div>
              <div className={`rounded-2xl bg-gradient-to-br ${ball.color} p-4 shadow-xl`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Over {ball.over}</div>
                  <div className={`text-2xl font-black ${ball.run === 6 ? 'text-yellow-300' : ball.run === 4 ? 'text-cyan-300' : 'text-white'}`}>{ball.run === 6 ? 'SIX!' : ball.run === 4 ? 'FOUR!' : ball.run === 0 ? 'DOT' : `${ball.run} RUN`}</div>
                </div>
                <div className="text-sm font-bold text-white/90 leading-snug">{ball.desc}</div>
                <div className="flex gap-3 mt-3 text-[9px] text-white/50">
                  <span>🏏 {ball.batter}</span>
                  <span>⚡ {ball.bowler}</span>
                </div>
              </div>
            </div>

            {/* KEY MOMENTS */}
            <div className="px-5 pb-6">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">Key Moments</div>
              <div className="space-y-2">
                {KEY_MOMENTS.map(moment => (
                  <div key={moment.time} className={`flex items-center gap-3 p-3 rounded-xl border ${moment.color}`}>
                    <span className="text-base shrink-0">{moment.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider">{moment.title}</span>
                        <span className="text-[8px] text-white/30">Over {moment.time}</span>
                      </div>
                      <div className="text-[10px] text-white/60 truncate mt-0.5">{moment.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════ MAP TAB */}
        {tab === 'map' && (
          <div className="px-5 pt-5 space-y-4">
            {/* Your seat card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 relative overflow-hidden">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/70 mb-1">Your Seat</div>
              <div className="flex items-end justify-between">
                <div className="flex gap-4">
                  {[['Gate', 'B'], ['Block', 'D4'], ['Row', '12'], ['Seat', '34']].map(([l, v]) => (
                    <div key={l}>
                      <div className="text-[8px] text-white/50">{l}</div>
                      <div className="text-lg font-black">{v}</div>
                    </div>
                  ))}
                </div>
                <button className="bg-white text-blue-600 px-3.5 py-2 rounded-xl text-[10px] font-black shadow-lg">Navigate →</button>
              </div>
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-[9px] text-white/35 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" />You</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Food</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" />Restroom</span>
            </div>

            {/* Stadium SVG */}
            <div className="bg-[#07101e] rounded-3xl border border-white/8 p-2 aspect-[5/4] overflow-hidden">
              <StadiumMap showPlayerPin compact />
            </div>

            {/* Facilities */}
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">Nearby Facilities</div>
              <div className="space-y-2">
                {[
                  { icon: '🍔', label: 'Gate B Food Court', sub: 'Section D · ~80m · 3 min queue', action: 'Order', color: 'text-amber-400', acColor: 'bg-amber-500/15 border-amber-500/25 text-amber-400' },
                  { icon: '🚻', label: 'Restrooms North', sub: 'Near Gate B entry · 1 min wait', action: 'Go', color: 'text-purple-400', acColor: 'bg-purple-500/15 border-purple-500/25 text-purple-400' },
                  { icon: '🏥', label: 'First Aid Station', sub: 'Gate A · Always open', action: 'Go', color: 'text-red-400', acColor: 'bg-red-500/15 border-red-500/25 text-red-400' },
                  { icon: '🛒', label: 'Official Merch', sub: 'East Wing · Currently busy', action: 'Go', color: 'text-emerald-400', acColor: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400' },
                  { icon: '🅿️', label: 'Parking Exit P3', sub: 'South Gate · ~400m', action: 'Go', color: 'text-blue-400', acColor: 'bg-blue-500/15 border-blue-500/25 text-blue-400' },
                ].map(({ icon, label, sub, action, acColor }) => (
                  <div key={label} className="flex items-center gap-3 bg-[#080f1e] border border-white/5 rounded-2xl p-3.5 hover:border-white/12 transition-colors">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl shrink-0">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{label}</div>
                      <div className="text-[9px] text-white/35 mt-0.5">{sub}</div>
                    </div>
                    <button className={`shrink-0 px-3 py-1.5 rounded-xl text-[9px] font-black border ${acColor}`}>{action}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════ ORDER TAB */}
        {tab === 'order' && (
          <div className="pt-5 space-y-4">
            {/* Seat delivery banner */}
            <div className="mx-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center gap-3">
              <span className="text-2xl">🛵</span>
              <div>
                <div className="text-xs font-black text-emerald-400">Deliver to Block D4 · Row 12 · Seat 34</div>
                <div className="text-[9px] text-white/40 mt-0.5">Avg wait 12–18 min · Free delivery today</div>
              </div>
            </div>

            {/* Category filter */}
            <div className="px-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Food', 'Snacks', 'Drinks', 'Merch'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black border transition-colors ${activeCat === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/45 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu items */}
            <div className="px-5 space-y-2.5">
              {filteredMenu.map(item => (
                <div key={item.id} className="bg-[#080f1e] border border-white/5 rounded-2xl p-4 flex gap-3 items-center hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl shrink-0">{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[8px] font-bold text-white/30 uppercase">{item.stall}</span>
                      {item.popular && <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/18 text-amber-400 rounded-full font-black">⭐ Popular</span>}
                    </div>
                    <div className="text-sm font-bold">{item.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-black">₹{item.price}</span>
                      {item.prep > 0 && <span className="text-[9px] text-white/25">· {item.prep} min prep</span>}
                    </div>
                  </div>
                  {/* Cart controls */}
                  {cart[item.id] ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 bg-white/8 rounded-lg text-lg font-black hover:bg-red-500/20 transition-colors flex items-center justify-center">−</button>
                      <span className="text-sm font-black w-4 text-center">{cart[item.id]}</span>
                      <button onClick={() => addToCart(item.id)} className="w-8 h-8 bg-blue-600 rounded-lg text-lg font-black hover:bg-blue-500 transition-colors flex items-center justify-center">+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item.id)} className="shrink-0 w-9 h-9 bg-white/5 border border-white/10 rounded-xl text-xl font-black hover:bg-blue-600 hover:border-blue-500 transition-colors flex items-center justify-center">+</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════ TICKET TAB */}
        {tab === 'ticket' && (
          <div className="px-5 pt-5 space-y-4">
            <div className="text-[9px] font-black uppercase tracking-widest text-white/25">Your Entry Pass</div>

            {/* QR */}
            <div className="bg-[#080f1e] rounded-3xl border border-white/8 overflow-hidden">
              <div className="p-6 flex flex-col items-center border-b border-dashed border-white/10">
                <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center shadow-2xl relative mb-4">
                  {/* Faux QR */}
                  <svg width="160" height="160" viewBox="0 0 21 21" className="rounded">
                    {/* Position detection squares */}
                    {[[0,0],[14,0],[0,14]].map(([ox, oy], i) => (
                      <g key={i}>
                        <rect x={ox} y={oy} width={7} height={7} fill="black" rx={0.5} />
                        <rect x={ox+1} y={oy+1} width={5} height={5} fill="white" />
                        <rect x={ox+2} y={oy+2} width={3} height={3} fill="black" />
                      </g>
                    ))}
                    {/* Data modules */}
                    {Array.from({ length: 21 * 21 }).map((_, idx) => {
                      const x = idx % 21; const y = Math.floor(idx / 21);
                      const inCorner = (x < 8 && y < 8) || (x > 13 && y < 8) || (x < 8 && y > 13);
                      if (inCorner) return null;
                      const on = (x + y + idx) % 3 === 0 || (x * y) % 4 === 0;
                      return on ? <rect key={idx} x={x} y={y} width={1} height={1} fill="black" /> : null;
                    })}
                  </svg>
                  <div className="absolute -top-3 -right-3 bg-emerald-500 px-2.5 py-0.5 rounded-full text-[9px] font-black text-white border-2 border-[#080f1e] uppercase">Valid</div>
                </div>
                <div className="text-[9px] text-white/35 font-bold uppercase tracking-widest">Scan at Turnstile · Gate B</div>
              </div>

              {/* Ticket details */}
              <div className="grid grid-cols-4 divide-x divide-white/5">
                {[['Gate', 'B'], ['Block', 'D4'], ['Row', '12'], ['Seat', '34']].map(([l, v]) => (
                  <div key={l} className="text-center py-4 px-2">
                    <div className="text-[8px] text-white/25 uppercase font-bold mb-0.5">{l}</div>
                    <div className="text-base font-black">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match details */}
            <div className="bg-[#080f1e] rounded-2xl border border-white/8 p-4 space-y-2.5">
              {[
                { label: 'Match', value: 'HYD Sunrisers vs BLR RCB' },
                { label: 'Venue', value: 'Rajiv Gandhi Intl. Cricket Stadium' },
                { label: 'Date', value: 'Sunday, 20 Apr 2025 · 7:30 PM IST' },
                { label: 'Ticket ID', value: 'SRH-IPL-2025-D4-12-34' },
                { label: 'Holder', value: 'Abhiram Ravula' },
                { label: 'Valid Until', value: '09:30 PM IST (end of match)' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-3">
                  <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider shrink-0">{label}</span>
                  <span className="text-[10px] font-bold text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Gate wait times */}
            <div className="bg-[#080f1e] rounded-2xl border border-white/8 p-4">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">Live Gate Wait Times</div>
              <div className="space-y-2.5">
                {[
                  { gate: 'Gate A', wait: '1m 20s', pct: 18, yours: false },
                  { gate: 'Gate B', wait: '4m 00s', pct: 58, yours: true },
                  { gate: 'Gate C', wait: '9m 15s', pct: 91, yours: false },
                  { gate: 'Gate D', wait: '2m 30s', pct: 30, yours: false },
                ].map(({ gate, wait, pct, yours }) => (
                  <div key={gate}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold">{gate}{yours && <span className="ml-1.5 text-blue-400 text-[8px] font-black">★ Yours</span>}</span>
                      <span className={`font-black ${pct > 75 ? 'text-red-400' : pct > 45 ? 'text-amber-400' : 'text-emerald-400'}`}>{wait}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${pct > 75 ? 'bg-red-500' : pct > 45 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── CART STICKY BAR (shows when items in cart on order tab) ── */}
      {cartCount > 0 && tab === 'order' && (
        <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[420px] z-40">
          <button className="w-full bg-blue-600 hover:bg-blue-500 transition-colors rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-blue-900/50">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-black">{cartCount}</span>
              <span className="text-sm font-black">View Order</span>
            </div>
            <span className="text-sm font-black">₹{cartTotal} →</span>
          </button>
        </div>
      )}

      {/* ── TAB BAR ── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#07101e]/96 backdrop-blur-2xl border-t border-white/8 px-6 py-3 flex justify-around items-center z-30 pb-safe">
        {([
          { id: 'live', icon: '🏏', label: 'Live' },
          { id: 'map', icon: '🗺️', label: 'My Seat' },
          { id: 'order', icon: '🍔', label: 'Order', badge: cartCount > 0 ? String(cartCount) : undefined },
          { id: 'ticket', icon: '🎟️', label: 'Ticket' },
        ] as { id: Tab; icon: string; label: string; badge?: string }[]).map(({ id, icon, label, badge }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-1 relative transition-all duration-200 min-w-[52px] ${tab === id ? 'opacity-100 scale-105' : 'opacity-35 hover:opacity-65'}`}
          >
            {tab === id && <span className="absolute -top-3 w-8 h-0.5 bg-blue-500 rounded-full" />}
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
            {badge && (
              <span className="absolute -top-1 right-0 bg-blue-500 text-[8px] min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center font-black">{badge}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
