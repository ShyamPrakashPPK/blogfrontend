'use client';

import { create } from 'zustand';
import type { User } from './types';

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clear: () => void;
  hydrate: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') localStorage.setItem('accessToken', token);
    set({ user, token });
  },
  clear: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
    set({ user: null, token: null });
  },
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      set({ token });
    }
  },
}));
