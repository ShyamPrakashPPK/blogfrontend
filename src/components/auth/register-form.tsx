'use client';

import { useState } from 'react';
import api from '@/lib/axios';

export default function RegisterForm() {
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.status === 201) setMsg('Registered! Please login.');
      else setMsg('Registration failed');
    } catch {
      setMsg('Registration failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto border rounded p-6 bg-white">
      <h2 className="text-xl font-semibold">Register</h2>
      <div className="mt-4">
        <label className="text-sm">Name</label>
        <input className="mt-1 w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="mt-3">
        <label className="text-sm">Email</label>
        <input className="mt-1 w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mt-3">
        <label className="text-sm">Password</label>
        <input type="password" className="mt-1 w-full rounded border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <button className="mt-5 w-full rounded bg-neutral-900 text-white py-2">Create account</button>
    </form>
  );
}
