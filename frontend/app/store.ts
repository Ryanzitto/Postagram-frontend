import { create } from "zustand";

interface User {
  name: null | string;
  userName: null | string;
  email: null | string;
  avatar: null | string;
  id: null | string;
  token: null | string;
}

export const useStore = create((set: any) => ({
  user: {
    name: null,
    userName: null,
    email: null,
    avatar: null,
    id: null,
    token: null,
  },

  setUser: (payload: User) => set(() => ({ user: payload })),
  login: (payload: string) =>
    set((state: { user: User }) => ({
      user: { ...state.user, token: payload },
    })),
}));
