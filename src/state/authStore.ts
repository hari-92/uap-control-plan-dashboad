import { create } from 'zustand'

type AuthState = {
  isAuthenticated: boolean
  username: string
  password: string
  login: (params: { username: string; password: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  username: '',
  password: '',
  login: ({ username, password }) =>
    set({
      isAuthenticated: true,
      username,
      password,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      username: '',
      password: '',
    }),
}))

