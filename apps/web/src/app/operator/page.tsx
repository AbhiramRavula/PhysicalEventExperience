"use client";

import React, { useState, useEffect } from 'react';

// --- Types ---
interface ZoneDensity {
  id: string;
  name: string;
  density: number; // 0-100
}

interface Order {
  id: string;
  items: string;
  amount: number;
  time: string;
  status: string;
}

const OperatorDashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [densities, setDensities] = useState<ZoneDensity[]>([
    { id: 'zone-gate-a', name: 'Gate A', density: 15 },
    { id: 'zone-gate-b', name: 'Gate B', density: 45 },
    { id: 'zone-conc-n', name: 'North Concourse', density: 25 },
    { id: 'zone-conc-s', name: 'South Concourse', density: 60 },
    { id: 'zone-food-1', name: 'Food Court 1', density: 85 },
    { id: 'zone-stand-l', name: 'Lower Stand', density: 75 },
  ]);

  const [orders] = useState<Order[]>([
    { id: 'ORD-001', items: '2x Biryani, 1x Pepsi', amount: 658, time: '2m ago', status: 'In Kitchen' },
    { id: 'ORD-002', items: '1x Pizza, 2x Water', amount: 189, time: '5m ago', status: 'Ready' },
    { id: 'ORD-003', items: '3x Popcorn, 3x Coke', amount: 450, time: '8m ago', status: 'Delivered' },
  ]);

  useEffect(() => {
    setMounted(true);
    // Simulate live data updates
    const interval = setInterval(() => {
      setDensities(prev => prev.map(z => ({
        ...z,
        density: Math.min(100, Math.max(0, z.density + (Math.random() * 10 - 5)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const getDensityColor = (density: number) => {
    if (density > 80) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    if (density > 50) return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white font-sans selection:bg-blue-500/30">
      {/* --- Sidebar --- */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0A1124] border-r border-white/5 p-6 flex flex-col gap-8 z-20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">S</div>
          <h1 className="text-xl font-bold tracking-tight">Stadium<span className="text-blue-500">IQ</span></h1>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon="📊" label="Live Heatmap" active />
          <NavItem icon="📣" label="Broadcast Alert" />
          <NavItem icon="🛡️" label="Staff Dispatch" />
          <NavItem icon="🍔" label="Kitchen Queue" />
          <NavItem icon="📈" label="Analytics" />
          <NavItem icon="⚙️" label="Settings" />
        </nav>

        <div className="mt-auto p-4 bg-blue-600/10 rounded-xl border border-blue-500/20">
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">Live Event</div>
          <div className="text-sm font-bold">Hyderabad vs Bangalore</div>
          <div className="text-[10px] text-white/50 mt-1">Rajiv Gandhi Stadium • 45,230 Fans</div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="ml-64 p-8">
        {/* --- Top Bar --- */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Operator Dashboard</h2>
            <p className="text-white/50 text-sm">Real-time venue intelligence & command center</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xs font-bold text-red-500 uppercase tracking-tight">2 Critical Zones</span>
            </div>
            <button className="bg-red-600 hover:bg-red-700 transition-colors px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-red-900/20">
              🚨 SEND ALERT
            </button>
          </div>
        </header>

        {/* --- Stats Row --- */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Attendees" value="45,230" sub="82% Capacity" />
          <StatCard label="Wait Time (Gate)" value="4m 12s" sub="Trending Down" color="text-emerald-400" />
          <StatCard label="Active Orders" value="128" sub="12 Ready for Pickup" color="text-blue-400" />
          <StatCard label="Critical Alerts" value="02" sub="Gate B, Food Ct 1" color="text-red-400" />
        </div>

        {/* --- Central Grid --- */}
        <div className="grid grid-cols-3 gap-8">
          {/* Virtual Map Area */}
          <div className="col-span-2 bg-[#0A1124] rounded-3xl border border-white/5 p-8 relative min-h-[500px] overflow-hidden">
            <div className="absolute top-6 left-6 z-10">
              <h3 className="text-lg font-bold mb-1">Live Heatmap</h3>
              <div className="flex gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Med</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
              </div>
            </div>

            {/* Mock Layout Grid */}
            <div className="grid grid-cols-4 gap-4 mt-12 relative h-full">
               {densities.map((zone) => (
                 <div key={zone.id} className="relative group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className={`h-32 rounded-2xl ${getDensityColor(zone.density)} transition-all duration-1000 p-4 flex flex-col justify-between`}>
                      <div className="font-bold text-xs uppercase tracking-tighter opacity-80">{zone.name}</div>
                      <div className="text-2xl font-black">{Math.round(zone.density)}%</div>
                    </div>
                    {zone.density > 80 && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 animate-bounce">
                        BUSY
                      </div>
                    )}
                 </div>
               ))}
               
               {/* Pitch Center Representation */}
               <div className="col-span-4 h-48 bg-white/5 border border-white/10 rounded-3xl mt-4 flex items-center justify-center relative backdrop-blur-sm">
                  <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Field of Play</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Side Stream: Orders & Incidents */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#0A1124] rounded-3xl border border-white/5 p-6 flex-1">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold">Recent Orders</h3>
                 <span className="text-[10px] text-blue-400 font-bold hover:underline cursor-pointer">View All</span>
               </div>
               <div className="flex flex-col gap-4">
                 {orders.map(order => (
                   <div key={order.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-white/40">{order.id}</span>
                        <span className="text-[10px] text-white/40">{order.time}</span>
                      </div>
                      <div className="text-sm font-semibold truncate mb-2">{order.items}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-blue-400">₹{order.amount}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                          order.status === 'Ready' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-red-600/5 rounded-3xl border border-red-500/10 p-6 h-48">
               <h3 className="font-bold text-red-500 mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                 System Alerts
               </h3>
               <div className="text-sm text-white/50 italic flex items-center justify-center h-full pb-8">
                 No major security incidents reported.
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/50 hover:bg-white/5 hover:text-white'
  }`}>
    <span className="text-lg">{icon}</span>
    <span className="font-semibold text-sm">{label}</span>
  </div>
);

const StatCard = ({ label, value, sub, color = "text-white" }: { label: string, value: string, sub: string, color?: string }) => (
  <div className="bg-[#0A1124] rounded-2xl border border-white/5 p-6 hover:border-blue-500/30 transition-colors">
    <div className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">{label}</div>
    <div className={`text-3xl font-black mb-1 ${color}`}>{value}</div>
    <div className="text-[10px] text-white/30 font-medium">{sub}</div>
  </div>
);

export default OperatorDashboard;
