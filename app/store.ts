import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  email: string;
  password: string;
  name: string;
  userName: string;
  __v: number;
  _id: string;
  token: string;
  followers: any[];
  following: any[];
}

export const useStore = create(
  persist(
    (set: any) => ({
      user: {
        email: "",
        password: "",
        name: "",
        userName: "",
        __v: 0,
        _id: "",
        token: "",
        followers: [],
        following: [],
      },

      setUser: (payload: User) =>
        set((state: { user: User }) => ({
          user: payload,
        })),

      logout: () =>
        set({
          user: {
            email: "",
            password: "",
            name: "",
            userName: "",
            __v: 0,
            _id: "",
            token: "",
          },
        }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
