import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';
import Navigation from '../../components/Navigation';
import { decodeJwt } from '../../lib/utils';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('access_token');

  if (!tokenCookie || !tokenCookie.value) {
    redirect('/');
  }

  const user = decodeJwt(tokenCookie.value);
  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Off-White & Blue Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                <span className="p-1.5 bg-blue-600 text-white rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v.077c0 5.008 2.01 9.548 5.277 12.87z" />
                  </svg>
                </span>
                S.H.I.E.L.D. <span className="text-blue-600">Bites</span>
              </Link>

              {/* Navigation Tabs */}
              <Navigation />
            </div>

            {/* Profile Info & Logout */}
            <div className="flex items-center gap-4">
              {/* User badge */}
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                <div className="flex gap-1.5 justify-end mt-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : user.role === 'MANAGER'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {user.country || 'Global'}
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* Logout Button (Client Component) */}
              <LogoutButton />
            </div>

          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
