'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import type { AuthResponse } from '@/lib/types';

export default function LoginForm() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/';
  const { setAuth } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token);
      router.push(next);
    } catch (e: any) {
      setErr('Invalid credentials');
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto border rounded p-6 bg-white">
      <h2 className="text-xl font-semibold">Login</h2>
      <div className="mt-4">
        <label className="text-sm">Email</label>
        <input className="mt-1 w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mt-3">
        <label className="text-sm">Password</label>
        <input type="password" className="mt-1 w-full rounded border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      <button className="mt-5 w-full rounded bg-neutral-900 text-white py-2">Sign in</button>
    </form>
  );
}
