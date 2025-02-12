import { create } from 'zustand'

export const useNavigationStore = create((set) => ({
  gameMode: 'menu', // 'local', 'ai', 'multiplayer', 'options', 'about'
  selectGameMode: (parameter) => set(() => ({ gameMode: parameter })),
  multiplayerMode: 'menu', // 'private', 'matchmaking', 'account'
  selectMultiplayerMode: (parameter) => set(() => ({ multiplayerMode: parameter })),
  matchDifficulty: null, // 'easy', 'medium', 'hard'
  selectMatchDifficulty: (parameter) => set(() => ({ matchDifficulty: parameter })),
  matchWins: null,
  selectMatchWins: (parameter) => set(() => ({ matchWins: parameter })),
  copy: false,
  selectCopy: (parameter) => set(() =>({copy: parameter}))
}))
