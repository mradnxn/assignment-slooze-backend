import React from 'react';
import LoginForm from '../components/LoginForm';

export const metadata = {
  title: 'S.H.I.E.L.D. Food Portal - Login',
  description: 'Secure food ordering interface for S.H.I.E.L.D. personnel.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <main className="flex-grow flex flex-col items-center justify-center">
        {/* Header/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-lg text-white mb-4 shadow-sm">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v.077c0 5.008 2.01 9.548 5.277 12.87z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9V7a4 4 0 00-4-4h0m4 6v3a3 3 0 01-3 3h0m3-6h3a2 2 0 012 2v3.077c0 3.197-1.006 6.158-2.731 8.57a13.907 13.907 0 01-2.583-6.42A13.924 13.924 0 0115 11.015V12a2 2 0 01-2 2h-1"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            S.H.I.E.L.D. <span className="text-blue-600">Avenger Bites</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Welcome, agent. Please select your profile card to sign in and access the food ordering system.
          </p>
        </div>

        {/* Login Form Wrapper (Client Component) */}
        <LoginForm />
      </main>

      {/* Simple Footer */}
      <footer className="text-center text-xs text-slate-400 mt-8 border-t border-slate-200 pt-6">
        <p>© 2026 S.H.I.E.L.D. Food Services. All Rights Reserved. careers@slooze.xyz</p>
      </footer>
    </div>
  );
}
