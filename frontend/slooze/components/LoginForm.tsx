'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../api/auth';
import Button from './ui/Button';

const DEMO_ACCOUNTS = [
  { name: 'Nick Fury', email: 'nick.fury@shield.gov', role: 'ADMIN', country: 'Global' },
  { name: 'Captain Marvel', email: 'captain.marvel@shield.gov', role: 'MANAGER', country: 'India' },
  { name: 'Captain America', email: 'captain.america@shield.gov', role: 'MANAGER', country: 'America' },
  { name: 'Thanos', email: 'thanos@shield.gov', role: 'MEMBER', country: 'India' },
  { name: 'Thor', email: 'thor@shield.gov', role: 'MEMBER', country: 'India' },
  { name: 'Travis', email: 'travis@shield.gov', role: 'MEMBER', country: 'America' },
];

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      
      router.push('/dashboard');
      router.refresh(); // Refresh route tree to load SSR pages with new cookie context
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to connect to the authentication server.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      {/* Login Form Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Enter Credentials</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-md border border-red-200 mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. nick.fury@shield.gov"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Log In
          </Button>
        </form>
      </div>

      {/* Demo Accounts Panel */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Quick Demo Accounts</h2>
        <p className="text-sm text-slate-500 mb-6">
          Click any profile card below to auto-fill the credentials:
        </p>

        <div className="grid grid-cols-2 gap-4">
          {DEMO_ACCOUNTS.map((account) => {
            const isSelected = email === account.email;
            return (
              <button
                key={account.email}
                type="button"
                onClick={() => handleQuickLogin(account.email)}
                className={`text-left p-4 rounded-md border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30'
                }`}
              >
                <div className="font-semibold text-slate-800 text-sm">{account.name}</div>
                <div className="text-xs text-slate-500 font-mono mb-2">{account.email}</div>
                
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    account.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : account.role === 'MANAGER'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {account.role}
                  </span>
                  
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {account.country}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
