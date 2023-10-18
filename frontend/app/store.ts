import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  name: null | string;
  userName: null | string;
  email: null | string;
  avatar: null | string;
  id: null | string;
  token: null | string;
}

const unkownUser = {
  name: null,
  userName: null,
  email: null,
  avatar: null,
  id: null,
  token: null,
};
interface store {
  user: User;
  increase: (by: number) => void;
}

export const useStore = create(
  persist(
    (set: any) => ({
      user: unkownUser,

      login: (payload: User) => set(() => ({ user: payload })),

      logout: () =>
        set(() => ({
          user: unkownUser,
        })),

      saveToken: (payload: string) =>
        set((state: { user: User }) => ({
          user: { ...state.user, token: payload },
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
