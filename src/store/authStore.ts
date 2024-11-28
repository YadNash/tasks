import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    set({ user: userWithoutPassword, isAuthenticated: true });
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  },

  signup: async (email: string, password: string, name: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    set({ user: userWithoutPassword, isAuthenticated: true });
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('currentUser');
  },
}));