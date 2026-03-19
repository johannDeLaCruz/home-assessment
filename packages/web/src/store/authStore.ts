import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isOrganizer: () => boolean;
  isAttendee: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      },
      isOrganizer: () => get().user?.role === 'organizer',
      isAttendee: () => get().user?.role === 'attendee',
    }),
    { name: 'auth', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);
