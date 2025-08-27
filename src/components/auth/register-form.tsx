'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/lib/axios';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.status === 201) {
        toast.success('Registration successful! Please login.');
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      // Handle different error scenarios based on your backend responses
      if (error.response?.status === 409) {
        toast.error('Email already in use');
      } else if (error.response?.status === 400) {
        // Handle validation errors from zod
        const errorMessage = error.response?.data?.message || 'Invalid input data';
        toast.error(errorMessage);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto border rounded p-6 bg-white">
      <h2 className="text-xl font-semibold">Register</h2>
      <div className="mt-4">
        <label className="text-sm">Name</label>
        <input 
          required
          className="mt-1 w-full rounded border px-3 py-2" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      <div className="mt-3">
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
            minLength={8}
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
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}


