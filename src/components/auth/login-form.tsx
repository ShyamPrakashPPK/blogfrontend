'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import type { AuthResponse } from '@/lib/types';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/';
  const { setAuth } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      toast.success('Login successful!');
      setAuth(res.data.user, res.data.token);
      router.push(next);
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto border rounded p-6 bg-white">
      <h2 className="text-xl font-semibold">Login</h2>
      <div className="mt-4">
        <label className="text-sm">Email</label>
        <input 
          type="email"
          required
          className="mt-1 w-full rounded border px-3 py-2" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="mt-3">
        <label className="text-sm">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? 'text' : 'password'}
            required
            className="mt-1 w-full rounded border px-3 py-2 pr-10" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <button 
        disabled={isLoading}
        className="mt-5 w-full rounded bg-neutral-900 text-white py-2 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
