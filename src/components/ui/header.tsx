'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/lib/auth-store';

export default function Header() {
  const { user, setAuth, clear, hydrate } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then((res) => setAuth(res.data.user, token))
      .catch(() => clear())
      .finally(() => setLoading(false));
  }, [hydrate, setAuth, clear]);

  const logout = () => {
    clear();
    window.location.href = '/';
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">Faircode Blogs</Link>
        <nav className="flex items-center gap-4">
          <Link href="/all-blogs" className="hover:underline">All Blogs</Link>
          {!loading && user ? (
            <>
              <Link href="/profile" className="hover:underline">{user.name}</Link>
              <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm hover:underline">Login</Link>
              <Link href="/auth/register" className="text-sm hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
