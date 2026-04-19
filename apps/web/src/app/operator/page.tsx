"use client";

import React, { useState, useEffect } from 'react';
import StadiumMap from '@/components/StadiumMap';

interface ZoneDensity {
  id: string;
  name: string;
  density: number;
}

interface Order {
  id: string;
  items: string;
  amount: number;
  time: string;
  status: 'In Kitchen' | 'Ready' | 'Delivered';
}

interface Alert {
  id: string;
  zone: string;
  type: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
}

const OperatorDashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState('heatmap');

  const [densities, setDensities] = useState<ZoneDensity[]>([
    { id: 'zone-stand-n', name: 'North Pavilion', density: 35 },
    { id: 'zone-stand-s', name: 'South Stand', density: 72 },
    { id: 'zone-stand-e', name: 'East Stand', density: 88 },
    { id: 'zone-stand-w', name: 'West Stand', density: 45 },
    { id: 'zone-gate-a', name: 'Gate A', density: 18 },
    { id: 'zone-gate-b', name: 'Gate B', density: 62 },
    { id: 'zone-food-1', name: 'Food Court 1', density: 91 },
    { id: 'zone-food-2', name: 'Food Court 2', density: 54 },
  ]);

  const [orders] = useState<Order[]>([
    { id: 'ORD-001', items: '2× Biryani, 1× Pepsi', amount: 658, time: '2m ago', status: 'In Kitchen' },
    { id: 'ORD-002', items: '1× Pizza, 2× Water', amount: 189, time: '5m ago', status: 'Ready' },
    { id: 'ORD-003', items: '3× Popcorn, 3× Coke', amount: 450, time: '8m ago', status: 'Delivered' },
    { id: 'ORD-004', items: '1× Tikka, 1× Lassi', amount: 310, time: '11m ago', status: 'Delivered' },
  ]);

  const [alerts] = useState<Alert[]>([
    { id: 'A1', zone: 'East Stand', type: 'Crowd surge detected', time: '0m ago', severity: 'critical' },
    { id: 'A2', zone: 'Food Court 1', type: 'Queue length > 40 persons', time: '2m ago', severity: 'warning' },
    { id: 'A3', zone: 'Gate B', type: 'Entry rate elevated', time: '5m ago', severity: 'info' },
  ]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setDensities(prev => prev.map(z => ({
        ...z,
        density: Math.min(100, Math.max(0, z.density + (Math.random() * 8 - 4)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const criticalZones = densities.filter(z => z.density > 80);

  const getDensityColor = (d: number) => {
    if (d > 80) return { text: 'text-red-400', bg: 'bg-red-500/15 border-red-500/25', bar: 'bg-red-500', dot: 'bg-red-500' };
    if (d > 55) return { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', bar: 'bg-amber-500', dot: 'bg-amber-500' };
    return { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', bar: 'bg-emerald-500', dot: 'bg-emerald-500' };
  };

  const alertColor = (sev: Alert['severity']) => {
    if (sev === 'critical') return 'border-red-500/30 bg-red-500/8 text-red-400';
    if (sev === 'warning') return 'border-amber-500/30 bg-amber-500/8 text-amber-400';
    return 'border-blue-500/30 bg-blue-500/8 text-blue-400';
  };

  const orderStatusColor = (s: Order['status']) => {
    if (s === 'Ready') return 'bg-emerald-500/20 text-emerald-400';
    if (s === 'Delivered') return 'bg-white/10 text-white/40';
    return 'bg-blue-500/20 text-blue-400';
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white font-sans selection:bg-blue-500/30 flex">

      {/* ── SIDEBAR ── */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-[#07101e] border-r border-white/5 flex flex-col z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm">S</div>
          <h1 className="text-lg font-black">Stadium<span className="text-blue-500">IQ</span></h1>
          <span className="ml-auto text-[8px] border border-white/20 text-white/40 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">OPS</span>
        </div>

        {/* Event card */}
        <div className="mx-4 mt-4 p-3 bg-blue-600/10 rounded-xl border border-blue-500/15">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[8px] text-red-400 font-bold uppercase tracking-wider">Live · IPL 2025</span>
          </div>
          <div className="text-xs font-bold">HYD Sunrisers <span className="text-white/40">vs</span> BLR RCB</div>
          <div className="text-[9px] text-white/40 mt-0.5">Rajiv Gandhi Stadium</div>
          <div className="text-[9px] text-white/50 mt-1">Over 15.3 · 156/4 chasing 186</div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 mt-4 flex-1">
          {[
            { id: 'heatmap', icon: '📊', label: 'Live Heatmap' },
            { id: 'alerts', icon: '🚨', label: 'Alerts', badge: criticalZones.length },
            { id: 'orders', icon: '🍔', label: 'Kitchen Queue' },
            { id: 'staff', icon: '🛡️', label: 'Staff Dispatch' },
            { id: 'broadcast', icon: '📣', label: 'Broadcast' },
            { id: 'analytics', icon: '📈', label: 'Analytics' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map(({ id, icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeNav === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-base">{icon}</span>
              <span className="font-semibold text-sm flex-1">{label}</span>
              {badge ? (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Operator badge */}
        <div className="px-4 pb-6 pt-4 border-t border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-[10px] font-black">OP</div>
          <div>
            <div className="text-xs font-bold">Ops Manager</div>
            <div className="text-[9px] text-white/30">Gate B Control</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-60 flex-1 p-6 min-h-screen">

        {/* Top bar */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black">Operator Dashboard</h2>
            <p className="text-sm text-white/40 mt-0.5">Real-time venue intelligence & command center</p>
          </div>
          <div className="flex items-center gap-3">
            {criticalZones.length > 0 && (
              <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-xs font-bold text-red-400">{criticalZones.length} Critical Zone{criticalZones.length > 1 ? 's' : ''}</span>
              </div>
            )}
            <button className="bg-red-600 hover:bg-red-700 transition-colors px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-red-900/20">
              🚨 Send Alert
            </button>
          </div>
        </header>

        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Attendees', value: '45,230', sub: '82% Capacity', color: 'text-white' },
            { label: 'Avg Gate Wait', value: '4m 12s', sub: '▼ Trending Down', color: 'text-emerald-400' },
            { label: 'Active Orders', value: '128', sub: '12 Ready', color: 'text-blue-400' },
            { label: 'Critical Zones', value: String(criticalZones.length).padStart(2, '0'), sub: criticalZones.map(z => z.name.split(' ')[0]).join(', ') || 'None', color: criticalZones.length ? 'text-red-400' : 'text-emerald-400' },
            { label: 'Revenue Today', value: '₹8.4L', sub: '↑ 12% vs last match', color: 'text-amber-400' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-[#0A1124] rounded-2xl border border-white/5 p-4 hover:border-blue-500/20 transition-colors">
              <div className="text-[9px] text-white/35 font-bold uppercase tracking-wider mb-2">{label}</div>
              <div className={`text-2xl font-black mb-1 ${color}`}>{value}</div>
              <div className="text-[9px] text-white/25">{sub}</div>
            </div>
          ))}
        </div>

        {/* Central grid */}
        <div className="grid grid-cols-3 gap-5">

          {/* ── Stadium Heatmap (2 cols) ── */}
          <div className="col-span-2 bg-[#0A1124] rounded-3xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h3 className="font-black text-base">Live Stadium Heatmap</h3>
                <p className="text-[9px] text-white/30 mt-0.5">Zone density updates every 3 seconds</p>
              </div>
              <div className="flex gap-4 text-[9px] font-bold text-white/40 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Low</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Med</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" />Critical</span>
              </div>
            </div>

            {/* SVG Stadium */}
            <div className="px-6 py-4 aspect-[4/3] relative">
              <StadiumMap densities={densities} />
            </div>

            {/* Zone density strip */}
            <div className="px-6 pb-5 grid grid-cols-4 gap-3">
              {densities.slice(0, 4).map((zone) => {
                const c = getDensityColor(zone.density);
                return (
                  <div key={zone.id} className={`rounded-xl border p-3 ${c.bg}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      <span className="text-[9px] font-bold text-white/60 truncate">{zone.name}</span>
                    </div>
                    <div className={`text-lg font-black ${c.text}`}>{Math.round(zone.density)}%</div>
                    <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${c.bar}`} style={{ width: `${zone.density}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-5">

            {/* Alerts */}
            <div className="bg-[#0A1124] rounded-2xl border border-white/5 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm">Active Alerts</h3>
                <span className="text-[9px] text-red-400 font-bold border border-red-500/20 bg-red-500/10 px-2 py-0.5 rounded-full">{alerts.filter(a => a.severity === 'critical').length} Critical</span>
              </div>
              <div className="space-y-2.5">
                {alerts.map(alert => (
                  <div key={alert.id} className={`p-3 rounded-xl border text-xs ${alertColor(alert.severity)}`}>
                    <div className="flex justify-between mb-0.5">
                      <span className="font-bold">{alert.zone}</span>
                      <span className="text-white/30 text-[9px]">{alert.time}</span>
                    </div>
                    <div className="text-[10px] opacity-80">{alert.type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders */}
            <div className="bg-[#0A1124] rounded-2xl border border-white/5 p-5 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm">Recent Orders</h3>
                <span className="text-[9px] text-blue-400 font-bold hover:underline cursor-pointer">View All →</span>
              </div>
              <div className="space-y-2.5">
                {orders.map(order => (
                  <div key={order.id} className="p-3 bg-white/4 rounded-xl border border-white/5 hover:bg-white/7 transition-colors">
                    <div className="flex justify-between mb-1">
                      <span className="text-[9px] font-bold text-white/30">{order.id}</span>
                      <span className="text-[9px] text-white/25">{order.time}</span>
                    </div>
                    <div className="text-xs font-semibold truncate mb-2">{order.items}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-400">₹{order.amount}</span>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${orderStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gate wait times mini */}
            <div className="bg-[#0A1124] rounded-2xl border border-white/5 p-5">
              <h3 className="font-black text-sm mb-3">Gate Wait Times</h3>
              <div className="space-y-2">
                {[
                  { gate: 'Gate A', wait: '1m 20s', pct: 18 },
                  { gate: 'Gate B', wait: '4m 00s', pct: 62 },
                  { gate: 'Gate C', wait: '8m 45s', pct: 88 },
                  { gate: 'Gate D', wait: '2m 10s', pct: 30 },
                ].map(({ gate, wait, pct }) => {
                  const c = getDensityColor(pct);
                  return (
                    <div key={gate}>
                      <div className="flex justify-between text-[9px] mb-0.5">
                        <span className="text-white/60 font-bold">{gate}</span>
                        <span className={`font-bold ${c.text}`}>{wait}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${c.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperatorDashboard;
