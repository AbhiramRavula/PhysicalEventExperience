"use client";

import React, { useState } from 'react';

export default function FanExperience() {
  const [activeTab, setActiveTab] = useState('map');
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#050B18] text-white font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col">
      {/* --- App Bar --- */}
      <header className="p-6 pt-12 flex justify-between items-center bg-[#0A1124]/80 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Stadium<span className="text-blue-500">IQ</span></h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Rajiv Gandhi Stadium</p>
        </div>
        <div className="flex gap-4 items-center">
          <button className="relative p-2 bg-white/5 rounded-full border border-white/10">
            🔔<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050B18]"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold">AR</div>
        </div>
      </header>

      {/* --- Body --- */}
      <main className="flex-1 overflow-y-auto pb-32">
        {/* Active Ticket Banner */}
        <section className="p-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Your Active Event</div>
              <h2 className="text-lg font-bold mb-4">Hyderabad vs Bangalore</h2>
              <div className="flex justify-between items-end">
                <div>
                   <div className="text-[10px] text-white/60 mb-0.5">Seat Info</div>
                   <div className="text-sm font-bold">Gate B • Block D • Row 12 • Seat 34</div>
                </div>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold shadow-lg group-hover:scale-105 transition-transform">
                  View Path
                </button>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </section>

        {activeTab === 'map' && (
          <section className="px-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Real-time Map</h3>
              <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">Live</div>
            </div>
            {/* Visual Map Representation */}
            <div className="aspect-square bg-[#0A1124] rounded-3xl border border-white/10 p-4 relative overflow-hidden">
               <div className="w-full h-full border border-white/5 rounded-2xl flex items-center justify-center relative">
                  <div className="w-[80%] h-[60%] border border-white/10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-[10px] font-bold text-white/20 tracking-[0.4em]">Pitch</div>
                  </div>
                  {/* Map Markers */}
                  <div className="absolute top-10 left-10 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
                  <div className="absolute bottom-20 right-20 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] animate-ping"></div>

                   {/* Zone Overlays */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    <div className="border border-white/5 hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="border border-white/5 hover:bg-amber-500/10 transition-colors"></div>
                    <div className="border border-white/5 hover:bg-red-500/10 transition-colors"></div>
                    <div className="border border-white/5 hover:bg-emerald-500/10 transition-colors"></div>
                  </div>
               </div>
               <div className="absolute bottom-6 left-6 right-6">
                 <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">📍</div>
                    <div>
                      <div className="text-[10px] font-bold text-white/60">Heading To</div>
                      <div className="text-xs font-bold">Restrooms North (2m wait)</div>
                    </div>
                 </div>
               </div>
            </div>
          </section>
        )}

        {activeTab === 'food' && (
          <section className="px-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Featured Concessions</h3>
            <div className="grid grid-cols-1 gap-4">
              <FoodItem name="Classic Chicken Biryani" price="₹299" category="Food Court L1" onClick={() => setCartCount(c => c + 1)} />
              <FoodItem name="Samosa Platter (3pc)" price="₹120" category="North Gate Snacks" onClick={() => setCartCount(c => c + 1)} />
              <FoodItem name="Chilled Pepsi 500ml" price="₹60" category="Beverage Stand" onClick={() => setCartCount(c => c + 1)} />
              <FoodItem name="Team Jersey 2024" price="₹1,299" category="Official Merch" onClick={() => setCartCount(c => c + 1)} />
            </div>
          </section>
        )}

        {activeTab === 'queue' && (
          <section className="px-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
             <div className="w-48 h-48 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-2xl relative">
                {/* Mock QR */}
                <div className="w-40 h-40 bg-black/5 rounded-xl border-4 border-dashed border-black/10 flex items-center justify-center">
                   <div className="text-black font-black text-6xl opacity-5">QR</div>
                </div>
                <div className="absolute -top-3 -right-3 bg-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold border-2 border-[#050B18]">OPEN</div>
             </div>
             <div>
                <h4 className="text-xl font-bold">Gate B Entry Slot</h4>
                <p className="text-sm text-white/50 mt-1">Scan this at the turnstile</p>
             </div>
             <div className="flex justify-center gap-8 mt-4">
                <div>
                   <div className="text-[10px] text-white/30 uppercase font-bold">Valid Until</div>
                   <div className="text-lg font-bold text-red-400">04:15 PM</div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div>
                   <div className="text-[10px] text-white/30 uppercase font-bold">Section</div>
                   <div className="text-lg font-bold">Gate B</div>
                </div>
             </div>
          </section>
        )}
      </main>

      {/* --- Tab Bar --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-16 bg-[#0A1124]/90 backdrop-blur-xl rounded-full border border-white/10 px-6 flex justify-between items-center shadow-2xl z-30">
        <TabButton icon="🗺️" label="Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
        <TabButton icon="🍔" label="Order" active={activeTab === 'food'} onClick={() => setActiveTab('food')} />
        <TabButton icon="🎟️" label="Queue" active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} badge={activeTab !== 'queue' ? '1' : undefined} />
        {cartCount > 0 && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-2 rounded-full text-xs font-bold animate-bounce shadow-lg">
            🛒 {cartCount} Items in Cart
          </div>
        )}
      </nav>
    </div>
  );
}

const TabButton = ({ icon, label, active, onClick, badge }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 relative transition-all ${active ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}>
    <span className="text-lg">{icon}</span>
    <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
    {badge && (
      <span className="absolute -top-1 -right-1 bg-blue-500 text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">{badge}</span>
    )}
    {active && (
      <span className="absolute -bottom-2 w-1 h-1 bg-white rounded-full"></span>
    )}
  </button>
);

const FoodItem = ({ name, price, category, onClick }: any) => (
  <div className="bg-[#0A1124] rounded-2xl border border-white/5 p-4 flex justify-between items-center group active:scale-95 transition-transform">
    <div>
      <div className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter mb-0.5">{category}</div>
      <div className="text-sm font-bold mb-1">{name}</div>
      <div className="text-xs font-black">{price}</div>
    </div>
    <button onClick={onClick} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg hover:bg-blue-600 transition-colors">
      +
    </button>
  </div>
);
