'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, device_id: 'web-client' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store JWT (in a real app, prefer HttpOnly cookies instead of localStorage)
      localStorage.setItem('stadiumiq_token', data.access_token);
      localStorage.setItem('attendee_id', data.attendee_id);
      
      // Redirect to the map view
      router.push('/map');
      
    } catch (err: any) {
      setError(err.message || 'Ticket not recognised. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Hero / Splash Area */}
      <div className="absolute top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-[#0F3460] to-[#1E4D8C] rounded-b-[40px] shadow-2xl flex flex-col items-center pt-24 z-0">
        <h1 className="text-white text-5xl font-extrabold tracking-tight mb-2 shadow-sm">
          StadiumIQ
        </h1>
        <p className="text-white/60 text-sm tracking-widest uppercase font-semibold">
          Physical Event Experience
        </p>
      </div>

      {/* Floating Auth Card Wrapper */}
      <div className="flex-1 flex flex-col justify-end pb-12 px-6 z-10 z-10 mt-[25vh]">
        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
          <h2 className="text-white/75 text-xs font-semibold uppercase tracking-wider mb-4 text-center">
            Scan your ticket
          </h2>

          {/* Camera Scan Zone Mockup */}
          <button className="w-full h-24 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition duration-200 mb-6 group cursor-pointer">
            <svg className="w-8 h-8 text-white/50 mb-2 group-hover:text-blue-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white/70 text-xs font-medium">Tap to open camera</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4 opacity-50">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-3 text-[10px] uppercase text-white/80 font-medium bg-transparent">or enter manually</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Booking ref: TKT-XXXX-XXXX"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full bg-white/90 text-slate-900 placeholder:text-slate-500 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
              {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white font-semibold py-3 rounded-lg shadow-lg disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Enter Venue →'
              )}
            </button>
          </form>
        </div>

        {/* Guest Link */}
        <button className="mt-8 text-center text-xs text-white/60 hover:text-white transition">
          No ticket? <span className="text-blue-400 font-medium underline underline-offset-2">Browse as guest</span>
        </button>
      </div>
    </div>
  );
}
