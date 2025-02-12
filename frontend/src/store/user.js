import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null, // Datos del usuario logueado
  isLogged: false, // true o false
  setUser: (userData) => set({ user: userData, isLogged: true }), // Setea el usuario al loguearse
  logout: () => set({ user: null, isLogged: false }), // Limpia el estado al desloguearse
}))
